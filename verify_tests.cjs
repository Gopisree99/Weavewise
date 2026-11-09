const fs = require('fs');

// Simple TypeScript to JS stripping for CJS test runner
function stripTs(src) {
  return src
    .replace(/import\s+[^;]+;/g, '')
    .replace(/export\s+interface\s+[\s\S]*?\{[\s\S]*?\}/g, '')
    .replace(/export\s+type\s+[^;]+;/g, '')
    .replace(/:\s*[A-Z][a-zA-Z0-9_<>\[\]|&\s]+/g, '')
    .replace(/as\s+[a-zA-Z0-9_<>\[\]|]+/g, '')
    .replace(/export\s+function/g, 'function')
    .replace(/export\s+const/g, 'const');
}

const promptUtilsCode = fs.readFileSync('src/utils/promptUtils.ts', 'utf8');
const searchUtilsCode = fs.readFileSync('src/utils/searchUtils.ts', 'utf8');

const promptUtilsFn = new Function(
  stripTs(promptUtilsCode) + '\nreturn { buildOutfitPrompt };'
)();

const searchUtilsFn = new Function(
  stripTs(searchUtilsCode) + '\nreturn { matchProductSearch, getImplicitCategoryFromQuery };'
)();

const { buildOutfitPrompt } = promptUtilsFn;
const { matchProductSearch, getImplicitCategoryFromQuery } = searchUtilsFn;

// 1. Extract products list from products.ts
const productsCode = fs.readFileSync('src/data/products.ts', 'utf8');
const productBlocks = productsCode.split(/id:\s*'(p\d+)'/g);
const testProducts = [];

for (let i = 1; i < productBlocks.length; i += 2) {
  const id = productBlocks[i];
  const body = productBlocks[i + 1] || '';

  const nameMatch = body.match(/name:\s*'([^']+)'/);
  const catMatch = body.match(/category:\s*'([^']+)'/);
  const garmentMatch = body.match(/garmentType:\s*("[^"]+"|'[^']+')/);
  const fabricMatch = body.match(/fabric:\s*'([^']+)'/);
  const tagsMatch = body.match(/tags:\s*\[([^\]]+)\]/);
  const descMatch = body.match(/description:\s*\n?\s*'([^']+)'/);

  if (nameMatch && catMatch) {
    testProducts.push({
      id,
      name: nameMatch[1],
      category: catMatch[1],
      garmentType: garmentMatch ? garmentMatch[1].replace(/['"]/g, '') : '',
      fabric: fabricMatch ? fabricMatch[1] : '',
      description: descMatch ? descMatch[1] : '',
      tags: tagsMatch
        ? tagsMatch[1]
            .split(',')
            .map((t) => t.trim().replace(/['"]/g, ''))
            .filter(Boolean)
        : [],
      occasion: ['Wedding', 'Daily Wear'],
      colors: [{ name: 'Red' }, { name: 'Gold' }],
      pattern: 'Traditional',
    });
  }
}

console.log(`Loaded ${testProducts.length} products for verification testing.\n`);

// ----------------------------------------------------
// TEST SET 1: SEARCH INDIVIDUAL QUERIES
// ----------------------------------------------------
console.log('====================================================');
console.log('TEST SUITE 1: INDIVIDUAL SEARCH QUERIES');
console.log('====================================================');

const searchTerms = [
  'Saree',
  'Sari',
  'Silk Saree',
  'Kanjivaram',
  'Kanjivaram Saree',
  'Lehenga',
  'Kurti',
  'Sherwani',
  'Kurta',
  'Frock',
  'Kids Frock',
];

let totalSearchTestsPassed = 0;

searchTerms.forEach((term) => {
  const matches = testProducts.filter((p) => matchProductSearch(p, term));
  console.log(`\n🔍 Search for: "${term}"`);
  console.log(`   Count: ${matches.length} matching products found`);
  if (matches.length > 0) {
    totalSearchTestsPassed++;
    console.log(`   Sample matches:`);
    matches.slice(0, 3).forEach((m) => {
      console.log(`     - [${m.id}] ${m.name} (${m.category} | ${m.garmentType} | ${m.fabric})`);
    });
  } else {
    console.error(`   ❌ FAILED: 0 matches found for "${term}"!`);
  }
});

console.log(`\nSearch Queries Result: ${totalSearchTestsPassed} / ${searchTerms.length} Passed`);

// ----------------------------------------------------
// TEST SET 2: PROMPT ARCHITECTURE FOR EXACT OUTFITS
// ----------------------------------------------------
console.log('\n====================================================');
console.log('TEST SUITE 2: OUTFIT-SPECIFIC PROMPT GENERATION');
console.log('====================================================');

const testOutfits = [
  {
    name: 'Saree',
    params: {
      category: 'Women',
      garmentType: 'Saree',
      fabric: 'Kanjivaram Silk',
      color: 'Crimson Red and Temple Gold',
      occasion: 'Wedding',
    },
    requiredKeywords: ['saree', 'pleats', 'pallu', 'blouse', 'border', 'texture'],
    forbiddenKeywords: ['sherwani', 'lehenga', 'frock'],
  },
  {
    name: 'Lehenga',
    params: {
      category: 'Women',
      garmentType: 'Lehenga',
      fabric: 'Banarasi Brocade Silk',
      color: 'Royal Crimson and Gold',
      occasion: 'Wedding',
    },
    requiredKeywords: ['lehenga', 'choli', 'skirt', 'embroidery', 'dupatta'],
    forbiddenKeywords: ['sherwani', 'saree', 'frock'],
  },
  {
    name: 'Sherwani',
    params: {
      category: 'Men',
      garmentType: 'Sherwani',
      fabric: 'Banarasi Silk',
      color: 'Royal Gold and Cream',
      occasion: 'Wedding',
    },
    requiredKeywords: ['sherwani', 'bandhgala', 'coat', 'buttons', 'trousers', 'mojaris'],
    forbiddenKeywords: ['saree', 'lehenga', 'frock'],
  },
  {
    name: 'Kurti',
    params: {
      category: 'Women',
      garmentType: 'Kurti',
      fabric: 'Chanderi Silk',
      color: 'Mustard Yellow and Gold',
      occasion: 'Festival',
    },
    requiredKeywords: ['kurti', 'neckline', 'sleeves', 'trousers'],
    forbiddenKeywords: ['sherwani', 'lehenga', 'frock'],
  },
  {
    name: "Children's Frock",
    params: {
      category: 'Children',
      garmentType: "Children's Frock",
      fabric: 'Soft Mulberry Silk',
      color: 'Baby Pink and Gold',
      occasion: 'Festival',
    },
    requiredKeywords: ['frock', 'sleeves', 'skirt', 'girl'],
    forbiddenKeywords: ['sherwani', 'adult', 'choli'],
  },
];

let totalPromptTestsPassed = 0;

testOutfits.forEach((o) => {
  const prompt = buildOutfitPrompt(o.params);
  console.log(`\n👗 Testing Outfit: ${o.name}`);
  console.log(`   Generated Prompt: "${prompt.slice(0, 110)}..."`);

  const missing = o.requiredKeywords.filter((kw) => !prompt.toLowerCase().includes(kw));
  const illegal = o.forbiddenKeywords.filter((kw) => prompt.toLowerCase().includes(kw));

  if (missing.length === 0 && illegal.length === 0) {
    totalPromptTestsPassed++;
    console.log(`   ✓ All required details verified: [${o.requiredKeywords.join(', ')}]`);
    console.log(`   ✓ Free of mismatched outfit elements`);
  } else {
    if (missing.length > 0) console.error(`   ❌ Missing required keywords: ${missing.join(', ')}`);
    if (illegal.length > 0) console.error(`   ❌ Contaminated with illegal keywords: ${illegal.join(', ')}`);
  }
});

console.log(`\nPrompt Tests Result: ${totalPromptTestsPassed} / ${testOutfits.length} Passed`);
