import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { buildOutfitPrompt } from './src/utils/promptUtils.ts';

function backendApiPlugin(): Plugin {
  return {
    name: 'weavewise-backend-api',
    configureServer(server) {
      // Middleware for API routes
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/') || req.url.startsWith('/api/tryon')) {
          return next();
        }

        const env = loadEnv('development', process.cwd(), '');
        const cfAccountId = env.CLOUDFLARE_ACCOUNT_ID?.trim() || '';
        const cfApiToken = env.CLOUDFLARE_API_TOKEN?.trim() || '';
        const openAiKey = env.OPENAI_API_KEY?.trim() || '';
        const hfKey = env.HUGGINGFACE_API_KEY?.trim() || '';
        const stabilityKey = env.STABILITY_API_KEY?.trim() || '';

        // Determine active provider: priority to cloudflare if configured or specified
        let activeProvider = env.AI_IMAGE_PROVIDER || 'cloudflare';
        if (activeProvider === 'cloudflare' && (!cfAccountId || !cfApiToken)) {
          // If cloudflare requested but credentials partially missing, fallback to pollinations
          activeProvider = 'pollinations';
        }

        // Route: GET /api/status
        if (req.url === '/api/status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: 'online',
              activeProvider,
              hasCloudflareToken: Boolean(cfApiToken && cfApiToken.length > 10),
              hasCloudflareAccountId: Boolean(cfAccountId && cfAccountId.length > 10),
              cloudflareModel: '@cf/black-forest-labs/flux-1-schnell',
              hasOpenAiKey: Boolean(openAiKey && openAiKey.length > 5),
              hasHuggingFaceKey: Boolean(hfKey && hfKey.length > 5),
              hasStabilityKey: Boolean(stabilityKey && stabilityKey.length > 5),
              timestamp: new Date().toISOString(),
            })
          );
          return;
        }

        // Route: POST /api/generate-outfit-image
        if (req.url === '/api/generate-outfit-image' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });

          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const body = JSON.parse(bodyStr || '{}');
              const category = body.category || 'Women';
              const garmentType = body.garmentType || 'Saree';
              const fabric = body.fabric || 'Silk';
              const color = body.color || 'Royal Gold & Crimson';
              const occasion = body.occasion || 'Wedding';
              const style = body.style || 'Traditional Royal';
              const designTitle = body.designTitle || `${color} ${fabric} ${garmentType}`;

              // Construct exact, outfit-specific high-fashion prompt (with pleats, pallu, bandhgala, kalis, etc.)
              const prompt = buildOutfitPrompt({
                category,
                garmentType,
                fabric,
                color,
                occasion,
                style,
                customPrompt: body.customPrompt,
              });

              let generatedImageUrl = '';
              let usedProvider = activeProvider;

              // 1. Cloudflare Workers AI with @cf/black-forest-labs/flux-1-schnell
              if (cfAccountId && cfApiToken) {
                try {
                  console.log(
                    `[Cloudflare Workers AI] Dispatching inference to @cf/black-forest-labs/flux-1-schnell for ${garmentType}...`
                  );
                  const cfEndpoint = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

                  const cfRes = await fetch(cfEndpoint, {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${cfApiToken}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      prompt,
                      steps: 4,
                      num_steps: 4,
                    }),
                  });

                  if (cfRes.ok) {
                    const contentType = cfRes.headers.get('content-type') || '';
                    if (contentType.includes('application/json')) {
                      const cfData = (await cfRes.json()) as {
                        result?: { image?: string };
                        success?: boolean;
                        errors?: { message: string }[];
                      };

                      if (cfData.result?.image) {
                        const rawImg = cfData.result.image;
                        generatedImageUrl = rawImg.startsWith('data:')
                          ? rawImg
                          : `data:image/jpeg;base64,${rawImg}`;
                        usedProvider = 'Cloudflare Workers AI (@cf/black-forest-labs/flux-1-schnell)';
                        console.log(
                          '[Cloudflare Workers AI] Generated high-fidelity outfit concept image successfully.'
                        );
                      }
                    } else {
                      // Direct binary stream from Workers AI
                      const arrayBuffer = await cfRes.arrayBuffer();
                      const base64 = Buffer.from(arrayBuffer).toString('base64');
                      generatedImageUrl = `data:image/jpeg;base64,${base64}`;
                      usedProvider = 'Cloudflare Workers AI (@cf/black-forest-labs/flux-1-schnell)';
                      console.log(
                        '[Cloudflare Workers AI] Received binary image stream and encoded to base64.'
                      );
                    }
                  } else {
                    const errBody = await cfRes.text().catch(() => '');
                    console.warn(
                      `[Cloudflare Workers AI] Call failed (HTTP ${cfRes.status}):`,
                      errBody
                    );
                  }
                } catch (cfErr: any) {
                  console.warn('[Cloudflare Workers AI] Network/fetch error:', cfErr.message);
                }
              }

              // 2. OpenAI DALL-E 3 (if configured and previous did not produce image)
              if (!generatedImageUrl && openAiKey) {
                try {
                  const aiRes = await fetch('https://api.openai.com/v1/images/generations', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${openAiKey}`,
                    },
                    body: JSON.stringify({
                      model: 'dall-e-3',
                      prompt,
                      n: 1,
                      size: '1024x1024',
                      quality: 'standard',
                    }),
                  });

                  if (aiRes.ok) {
                    const aiData = (await aiRes.json()) as { data?: { url?: string }[] };
                    if (aiData.data?.[0]?.url) {
                      generatedImageUrl = aiData.data[0].url;
                      usedProvider = 'OpenAI DALL-E 3';
                    }
                  }
                } catch (openAiErr) {
                  console.warn('OpenAI call error:', openAiErr);
                }
              }

              // 3. Hugging Face Inference API (if configured and previous did not produce image)
              if (!generatedImageUrl && hfKey) {
                try {
                  const hfRes = await fetch(
                    'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${hfKey}`,
                      },
                      body: JSON.stringify({ inputs: prompt }),
                    }
                  );

                  if (hfRes.ok) {
                    const arrayBuffer = await hfRes.arrayBuffer();
                    const base64 = Buffer.from(arrayBuffer).toString('base64');
                    generatedImageUrl = `data:image/jpeg;base64,${base64}`;
                    usedProvider = 'Hugging Face FLUX.1 [schnell]';
                  }
                } catch (hfErr) {
                  console.warn('Hugging Face call error:', hfErr);
                }
              }

              // 4. Pollinations AI Live Diffusion Fallback (Zero-config, fast, 100% reliable)
              if (!generatedImageUrl) {
                const seed = Math.floor(Math.random() * 999999);
                generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
                  prompt
                )}?width=768&height=1024&nologo=true&enhance=true&seed=${seed}`;
                usedProvider =
                  cfAccountId && cfApiToken
                    ? 'Pollinations AI Diffusion (Cloudflare Fallback)'
                    : 'Pollinations AI Diffusion';
              }

              res.end(
                JSON.stringify({
                  success: true,
                  imageUrl: generatedImageUrl,
                  prompt,
                  provider: usedProvider,
                  generatedAt: new Date().toISOString(),
                  outfitDetails: {
                    name: designTitle,
                    description: `AI-synthesized ${style} outfit created for ${occasion} wear with genuine ${fabric} handloom weave.`,
                    fabric,
                    color,
                    occasion,
                    category,
                    style,
                  },
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Generation Failed',
                  message: err.message || 'Unknown server error during AI image generation',
                })
              );
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), backendApiPlugin()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/tryon': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 4173,
  },
});
