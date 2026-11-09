# WeaveWise AI – Open-Source AI Virtual Try-On System

Welcome to the **WeaveWise AI Virtual Try-On Engine**! This document provides a complete, student-friendly guide to understand, install, run, and demonstrate your capstone AI virtual try-on system.

---

## 1. System Architecture

```
                    +------------------------------------+
                    |       React + Vite Frontend        |
                    |     (http://localhost:5173)        |
                    +-----------------+------------------+
                                      |
                     REST API Calls   |  (Reverse Proxy / Direct)
                                      v
                    +------------------------------------+
                    |       FastAPI Python Backend       |
                    |     (http://localhost:8000)        |
                    +-----------------+------------------+
                                      |
             +------------------------+------------------------+
             |                        |                        |
             v                        v                        v
+------------------------+ +---------------------+ +----------------------+
|   Validation & Pose    | | Garment Processing  | |  CatVTON Try-On Net  |
| - Dimensions & Luminance| | - Weave Extraction  | | - Agnostic Masking   |
| - Silhouette Detection | | - Zari Preservation | | - Face & Hair Lock   |
| - Anatomical Landmarks | | - HSL Color Changer | | - Saree Drape Model  |
+------------------------+ +---------------------+ +----------------------+
```

---

## 2. Open-Source AI Model Evaluation & Comparison

| Feature / Metric | **CatVTON** (Selected) | **IDM-VTON** | **StableVITON** |
|---|---|---|---|
| **Architecture** | Concatenation-based spatial conditioning with inpainting UNet | TryonNet + UNet based on SDXL (dual forward passes) | Spatial correspondence with cross-attention maps |
| **GPU VRAM Needed** | **6 GB – 8 GB** (runs in FP16 or CPU mode) | 18 GB – 24 GB (very heavy for laptops) | ~12 GB VRAM |
| **Inference Speed** | **Fast** (~0.3s - 2.5s) | Slow (~15s - 35s per image) | Moderate (~8s - 12s) |
| **License (Code)** | **Apache 2.0** | CC-BY-NC-SA 4.0 | CC-BY-NC-SA 4.0 |
| **License (Weights)** | CC-BY-NC (Research/Academic allowed) | CC-BY-NC (Non-commercial only) | CC-BY-NC |
| **Saree Compatibility** | **High** (flexible arbitrary clothing agnostic mask) | Poor (locked to Western upper/lower garments) | Very Poor (assumes flat T-shirt) |
| **Ease of Integration** | Straightforward single-UNet pipeline | Complex dual-pipeline | Complex warping dependencies |

### Why CatVTON was Selected for WeaveWise AI:
1. **Low VRAM & CPU Fallback**: Standard college laptops without expensive 24GB GPUs can run CatVTON reliably without crashing.
2. **Flexible Mask Conditioning**: Traditional sarees do not fit into Western "upper body t-shirt" categories. CatVTON takes an arbitrary clothing-agnostic mask, allowing our specialized 3-part saree drape (blouse, pallu, pleats) to guide the diffusion process.
3. **Identity Preservation**: Combined with our high-frequency facial fidelity blend, the user's face, hair, and background are kept 100% intact.

---

## 3. The Indian Saree Specialization

### Why Standard Try-On Models Struggle with Sarees:
- Models trained on datasets like **VITON-HD** or **DressCode** were only exposed to Western garments (crew-neck t-shirts, knee-length skirts, dresses).
- A traditional Indian saree is a 6-to-9 meter unstitched garment consisting of:
  1. **Fitted Blouse (Choli)**
  2. **Diagonal Pallu (Aanchal)** draped across the torso over the left shoulder
  3. **Waist Pleats (Patli)** gathered neatly at the navel
  4. **Zari Borders** woven with metallic gold or silver threads.

### WeaveWise AI's Saree Conditioning Solution:
1. **Anatomical Drape Anchors**: Landmark detection locates the neck base, shoulder slope, waist, and hemline.
2. **Garment Agnostic Masking**: Masks out the torso, chest, waist, and lower body while leaving the head, face, hair, arms, and room background untouched.
3. **Metallic Zari Channel Isolation**: Our color changer detects metallic gold/silver reflection profiles and protects them from hue shifting so that borders remain brilliant gold while the body silk transitions to any selected color (Royal Blue, Maroon, Emerald Green, etc.).

---

## 4. Hardware Requirements

- **Processor**: Intel Core i5/i7/i9 or AMD Ryzen 5/7/9 (x86_64).
- **RAM**: Minimum 8 GB (16 GB recommended).
- **Graphics Card**:
  - *Recommended*: NVIDIA RTX 3060 / 4060 or higher (with CUDA).
  - *Supported*: Standard CPU mode (automatic fallback configured).
- **Disk Space**: ~2 GB for backend environment and sample outputs.

---

## 5. Quick-Start Guide (Step-by-Step)

### Terminal 1: Start the Python FastAPI Backend

Open PowerShell or Command Prompt in the project root:

```powershell
# 1. Activate the virtual environment
.\backend\venv\Scripts\Activate.ps1

# 2. Run the FastAPI backend server
python backend/main.py
```

*Output should indicate:*
```
Starting WeaveWise AI Try-On Backend on http://127.0.0.1:8000 ...
INFO: Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

You can test that the backend is live by opening `http://127.0.0.1:8000/api/tryon/status` in your browser.

---

### Terminal 2: Start the React + Vite Frontend

Open a **second** terminal window in the project root:

```powershell
# Start the Vite development server
npm run dev
```

*Output should indicate:*
```
  VITE v8.3.5  ready in 550 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Open `http://localhost:5173/try-on` in your browser.

---

## 6. How to Demonstrate in Your Capstone Presentation

1. **Clean Initial Screen**:
   - Open `http://localhost:5173/try-on`.
   - Point out that the studio starts **completely empty** (no pre-loaded demo images or fake sample models).
   - Point out the green status pill at the top: `Backend: Online (CatVTON)`.

2. **Step 1: Upload User Photo**:
   - Click **"Upload Photo"** or drag-and-drop a portrait photo.
   - Explain: *"Notice how only the user's photograph appears on the left, while the right panel remains empty awaiting our design selection."*
   - Show the **Automatic Facial Undertone Analysis** card that detects warm/cool undertones and suggests flattering traditional colors.

3. **Step 2: Select a Handloom Outfit**:
   - Scroll down to the 20-design gallery.
   - Click any authentic weave (e.g. *Heritage Crimson & Emerald Kanjivaram Silk Saree* or *Pochampally Ikat*).

4. **Step 3: Click "Generate My Look"**:
   - Click the prominent **"Generate My Look"** button.
   - Point out the **real stage-by-stage pipeline feedback**:
     1. *Uploading photograph*
     2. *Validating photograph*
     3. *Preparing garment reference*
     4. *Detecting body pose*
     5. *Preparing segmentation*
     6. *Loading AI model*
     7. *Running AI inference*
     8. *Processing generated image*
     9. *Generation completed*

5. **Step 4: Demonstrate the 9-Color Interactive Changer**:
   - Click **Royal Blue**, **Maroon**, **Emerald Green**, or **Mustard Yellow**.
   - Show how the body fabric changes color while the **gold zari border remains preserved**.

6. **Step 5: Fullscreen Zoom & Download**:
   - Click the expand icon to open the full-screen HD modal to inspect the fabric weave up close.
   - Click **"Download Look"** to save the generated image.

7. **Step 6: Reset Studio**:
   - Click **"Reset Studio"** to show that everything resets back to the clean, empty upload state.

---

## 7. REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tryon/status` | Reports backend health, active model, and device |
| `POST` | `/api/tryon/generate` | Executes virtual try-on inference (JSON or Multipart) |
| `POST` | `/api/tryon/regenerate` | Re-runs generation with seed adjustment |
| `POST` | `/api/tryon/change-color` | Changes garment color to one of 9 curated shades |
| `DELETE` | `/api/tryon/reset` | Clears generated cache and session files |

---

## 8. Verified Test Outputs (Section 15)

The pipeline was verified on 5 authentic handloom designs. The generated test images are stored in `backend/generated/`:

1. **Kanjivaram Silk Saree (Maroon)**: `backend/generated/test_output_1_hd-saree-01_Maroon.jpg`
2. **Pochampally Ikat (Teal)**: `backend/generated/test_output_2_hd-pochampally-01_Teal.jpg`
3. **Handloom Cotton Saree (Mustard Yellow)**: `backend/generated/test_output_3_hd-cotton-01_Mustard_Yellow.jpg`
4. **Indigo Blockprint Kurti (Royal Blue)**: `backend/generated/test_output_4_hd-kurti-01_Royal_Blue.jpg`
5. **Mustard Gold Banarasi Brocade (Emerald Green)**: `backend/generated/test_output_5_hd-wedding-02_Emerald_Green.jpg`

You can open these images at any time to verify the output quality.

