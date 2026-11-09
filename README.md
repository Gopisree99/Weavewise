# WeaveWise AI — AI-Based Smart Handloom Design, Yarn Recommendation and Loom Setup Advisor

> **Tagline:** *Tradition Woven with Intelligence.*  
> **Academic Level:** Second-Year Engineering College Capstone Project  
> **Domain:** Artificial Intelligence, Full-Stack Web Development, Expert Systems & Constraint Satisfaction Problems (CSP)

---

## 1. Project Overview

**WeaveWise AI** is a fully functional web application and intelligent design studio celebrating India's rich handloom heritage. The platform bridges the gap between discerning patrons and rural artisan weaver communities by deploying transparent, rule-based AI algorithms and mathematical models.

Unlike generic e-commerce templates, WeaveWise AI incorporates three domain-specific AI engines:
1. **Personalized Outfit Recommendation System:** A multi-dimensional inference engine using forward-chaining rules and a 100-point scoring algorithm across category, occasion, fabric, color, weave, and budget.
2. **Deterministic Yarn Quantity & Cost Calculator:** A textile engineering calculation engine applying metric area conversions, fabric GSM, and weave-specific crimp take-up factors (Plain: 1.15x, Jacquard: 1.45x, Brocade: 1.55x).
3. **Smart Loom Setup Advisor using CSP:** A Constraint Satisfaction Problem (CSP) solver executing arc-consistency filtering across cluster loom specifications (fabric width, yarn tension, shedding shafts, and workshop availability) with an automated pre-weaving setup checklist.

---

## 2. Key Features

- **Heritage Handloom Catalog:** Over 40 authentic, diverse handloom records across **Women**, **Men**, **Children**, and **Unisex** categories with high-resolution photography and graceful fallbacks.
- **Multidimensional Recommendation Wizard:** 10-step configuration wizard generating ranked recommendations with transparent scoring reasons.
- **Personalized Color Advisor & Local Photo Analysis:** Client-side HTML5 Canvas pixel analysis extracting dominant color swatches without sending user images to external cloud servers.
- **Seven-Language Localized Interface:** Native script translations for **English**, **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, **Tamil (தமிழ்)**, **Kannada (ಕನ್ನಡ)**, **Malayalam (മലയാളം)**, and **Bengali (বাংলা)**.
- **Product Customization Studio:** Real-time tailoring of raw yarns, weave structures, and custom regional temple color variants with dynamic price adjustments.
- **Master Artisan & Dealer Portal:** Demo authentication, workshop dashboard, inventory management with browser image uploads, and order milestone tracking.
- **Simulated Commerce & Order Tracking Pipeline:** Full shopping cart, free-shipping threshold calculations, delivery address validation, unique order ID generation (`WW-2024-XXXX`), and a 5-step visual tracking timeline.
- **Academic Project Review Page:** Comprehensive documentation with architecture diagrams, DFDs, mathematical formulations, and 10 verification test cases designed for faculty evaluation.
- **Demo Platform Administration:** Global inventory monitoring, tariff adjustment, and one-click demo data reset.

---

## 3. Technology Stack

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 8
- **Routing:** React Router v7
- **Styling:** Tailwind CSS (Custom ivory, deep indigo `#1e2060`, muted teal `#166666`, terracotta `#b85030`, and temple gold accents)
- **Icons:** Lucide React
- **Data Persistence:** Browser `localStorage` (with reactive multi-tab sync)
- **Image Processing:** Browser File API & HTML5 Canvas API (100% Client-Side)
- **Algorithms:** Rule-Based Expert Systems, Forward Chaining, and Constraint Satisfaction Problems (CSP)

---

## 4. System Architecture & Folder Structure

```
Handloom AI Project/
├── index.html                     # HTML5 entry point with Google Fonts preconnect
├── package.json                   # Dependencies and npm scripts
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Brand color extensions, typography & weave patterns
├── tsconfig.app.json              # TypeScript compilation configuration
├── vite.config.ts                 # Vite bundler configuration
└── src/
    ├── algorithms/
    │   ├── loomCSP.ts             # Formal CSP engine with arc-consistency filtering
    │   ├── recommendation.ts      # Forward-chaining inference & 6-vector scoring
    │   └── yarnCalculator.ts      # Cloth area, GSM mass, crimp factors & wastage math
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx         # Sticky header with 7-language selector & badges
    │   │   └── Footer.tsx         # Academic demo footer with quick links & guild info
    │   └── ui/
    │       ├── FilterPanel.tsx    # Multi-facet catalog sidebar
    │       ├── LoadingSpinner.tsx # Animated shimmer skeleton & loaders
    │       ├── Modal.tsx          # Accessible modal dialog
    │       ├── ProductCard.tsx    # 3:4 aspect ratio cards with badges & quick actions
    │       └── SearchBar.tsx      # Debounced search input
    ├── context/
    │   ├── CartContext.tsx        # Global shopping cart provider
    │   └── LanguageContext.tsx    # Multi-language dictionary translation provider
    ├── data/
    │   ├── adminConfig.ts         # Shipping thresholds & system settings
    │   ├── colorPalettes.ts       # 8 traditional Indian handloom palettes
    │   ├── dealers.ts             # 4 verified artisan societies & demo credentials
    │   ├── looms.ts               # 12 detailed cluster loom inventory records
    │   ├── products.ts            # 43 diverse handloom garments (Women, Men, Kids, Unisex)
    │   ├── translations.ts        # Full dictionaries for en, te, hi, ta, kn, ml, bn
    │   └── yarns.ts               # 12 yarn specifications with count, twist & pricing
    ├── hooks/
    │   ├── useCart.ts             # Cart hook
    │   ├── useFavorites.ts        # Wishlist persistence hook
    │   ├── useLanguage.ts         # Language switching hook
    │   └── useProducts.ts         # Merged catalog (static + dealer uploads)
    ├── models/
    │   └── types.ts               # Strongly-typed TypeScript interfaces
    ├── pages/
    │   ├── AdminPage.tsx          # Platform configuration & inventory control
    │   ├── AdvisorPage.tsx        # 10-step AI recommendation wizard & score cards
    │   ├── CartPage.tsx           # Shopping bag & price breakdown
    │   ├── ChatPage.tsx           # Local rule-based AI handloom assistant
    │   ├── CheckoutPage.tsx       # Address validation & demo checkout
    │   ├── ColorAdvisorPage.tsx   # Canvas photo color extractor & palette studio
    │   ├── CustomizationPage.tsx  # Interactive product customization studio
    │   ├── DealerPortalPage.tsx   # Dealer login, product upload & order tracking
    │   ├── ExplorePage.tsx        # Faceted catalog with search, filters & pagination
    │   ├── HomePage.tsx           # Hero, categories, AI engines, artisans & reviews
    │   ├── LoomAdvisorPage.tsx    # CSP loom solver & pre-weaving checklist
    │   ├── NotFoundPage.tsx       # 404 error page
    │   ├── OrderConfirmationPage.tsx # Order confirmation with visual milestone pipeline
    │   ├── OrdersPage.tsx         # Customer order history
    │   ├── ProductDetailPage.tsx  # Product specs, gallery, yarn/loom shortcuts
    │   ├── ProfilePage.tsx        # User profile, favorites & side-by-side comparison
    │   ├── ProjectReviewPage.tsx  # Academic presentation & faculty documentation
    │   └── YarnCalculatorPage.tsx # Mathematical yarn quantity & costing engine
    ├── services/
    │   └── localStorage.ts        # Central persistence service
    ├── utils/
    │   ├── imageUtils.ts          # Image fallbacks & client-side canvas color sampler
    │   ├── orderUtils.ts          # Order ID generator & status stylers
    │   └── validationUtils.ts     # Phone, email, PIN code & price validators
    ├── App.tsx                    # Route definitions & layout wrappers
    ├── index.css                  # Tailwind directives & custom animations
    └── main.tsx                   # React root mount point
```

---

## 5. Core Algorithms & Mathematical Formulations

### 5.1 Recommendation Scoring Algorithm
Every candidate garment $P$ is scored against customer preferences $Q$ across a 100-point normalized scale:
$$\text{Total Score} = S_{\text{category}} (30) + S_{\text{occasion}} (20) + S_{\text{fabric}} (15) + S_{\text{color}} (15) + S_{\text{weave}} (10) + S_{\text{budget}} (10)$$

- **$S_{\text{category}}$ (30 pts):** Hard constraint; garment category must strictly match recipient.
- **$S_{\text{occasion}}$ (20 pts):** 20 pts for exact match, 10 pts for overlapping family (e.g., Casual vs. Daily Wear).
- **$S_{\text{fabric}}$ (15 pts):** 15 pts for exact fiber match, 8 pts for related natural fibers (e.g., Silk vs. Mulberry Silk).
- **$S_{\text{color}}$ (15 pts):** Points awarded when product swatches contain user-selected preferred pigments.
- **$S_{\text{weave}}$ (10 pts):** 10 pts for exact match, 5 pts for structural alternative.
- **$S_{\text{budget}}$ (10 pts):** 10 pts if price $\le$ budget; 5 pts if within 20% tolerance; 0 pts if exceeded.

### 5.2 Yarn Quantity Formulation
$$\text{Area } (m^2) = \text{Length } (m) \times \text{Width } (m)$$
$$\text{Mass}_{\text{cloth}} \text{ (kg)} = \frac{\text{Area} \times \text{GSM}}{1000}$$
$$\text{Mass}_{\text{base}} \text{ (kg)} = \text{Mass}_{\text{cloth}} \times C_{\text{weave}}$$
$$\text{Mass}_{\text{total}} \text{ (kg)} = \text{Mass}_{\text{base}} \times \left(1 + \frac{\text{Wastage}_{\text{loom}}}{100}\right)$$

*Weave Crimp Multipliers ($C_{\text{weave}}$):* Plain Weave = 1.15x, Twill = 1.25x, Jacquard = 1.45x, Brocade = 1.55x.

### 5.3 Constraint Satisfaction Problem (CSP) for Loom Allocation
- **Variables ($V$):** Loom assignment $L$ for production order.
- **Domain ($D$):** Available candidate looms $\{L_1, L_2, \dots, L_{12}\}$ in artisan network.
- **Unary Constraints:**
  - $C_1$: $\text{Width}(L) \ge \text{Width}_{\text{cloth}}$
  - $C_2$: $\text{Available}(L) = \text{true}$
- **Binary Constraints:**
  - $C_3$: $\text{Yarn}_{\text{order}} \in \text{CompatibleYarns}(L)$
  - $C_4$: $\text{Weave}_{\text{order}} \in \text{SupportedWeaves}(L)$
  - $C_5$: $\text{Shafts}(L) \ge \text{MinShafts}(\text{Weave}_{\text{order}})$
- **Solver Technique:** Arc-consistency forward filtering prunes violating candidates before ranking compliant looms by clearance tolerance and dent density.

---

## 6. Installation & Execution Instructions

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (Node Package Manager)

### Commands for Windows PowerShell / Command Prompt

1. Open a terminal in the project directory:
   ```powershell
   cd "c:\Users\HASINI\OneDrive\Desktop\Handloom AI Project"
   ```

2. Install dependencies:
   ```powershell
   npm.cmd install
   ```

3. Run the development server:
   ```powershell
   npm.cmd run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

5. To verify production build:
   ```powershell
   npm.cmd run build
   ```

---

## 7. Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Artisan / Dealer** | `lakshmi@demo.com` | `demo123` | Dealer Portal (Product Uploads & Orders) |
| **System Administrator** | `admin@weavewise.com` | `admin123` | Global Administration & Settings |

---

## 8. Academic Project Review Verification Test Cases

| Test ID | Test Scenario | Input Criteria | Expected Result | Result |
|---|---|---|---|---|
| **TC-01** | Bridal Silk Recommendation | Women, Wedding, Silk, Budget ₹25,000 | Ranks Kanjivaram Silk Saree as #1 match (>90% score) | **PASSED** |
| **TC-02** | Men's Festival Kurta | Men, Festival, Cotton, Budget ₹2,500 | Recommends Cotton Kurta-Pyjama set | **PASSED** |
| **TC-03** | Children's Comfort Apparel | Children, Casual, Cotton, Budget ₹1,000 | Filters to pure cotton kids wear; zero synthetic stiffeners | **PASSED** |
| **TC-04** | Saree Yarn Calculation | 5.5m × 1.15m, 120 GSM, Plain Weave, 10% waste | Computes ~0.96 kg yarn with 55% warp / 45% weft split | **PASSED** |
| **TC-05** | Jacquard Loom Compatibility | Width 120cm, Jacquard weave, Mulberry Silk | Matches Varanasi Jacquard Loom; prunes narrow pit looms | **PASSED** |
| **TC-06** | Excessive Width Violation | Width 250cm (beyond handloom bounds) | Prunes all candidates; reports width constraint violation | **PASSED** |
| **TC-07** | Yarn Input Boundary Check | Negative length or 0 GSM | Validation flags input; calculation safely prevented | **PASSED** |
| **TC-08** | Vernacular Language Switch | Switch to Telugu (తెలుగు) or Tamil (தமிழ்) | Full UI translates to native script; persists across reload | **PASSED** |
| **TC-09** | Dealer Product Sync | Upload new custom weave in Dealer Portal | New item immediately appears in customer gallery & advisor | **PASSED** |
| **TC-10** | Simulated Checkout Flow | Submit delivery address with 10-digit phone | Creates order `WW-2024-XXXX`; updates pipeline timeline | **PASSED** |

---

## 9. Academic Limitations & Future Scope

### Honest Technical Disclosures
- **Client Storage:** Data is stored in browser `localStorage` for complete local zero-cost demonstration without requiring an active PostgreSQL or MongoDB database.
- **Rule-Based Assistant:** The AI Chatbot uses deterministic expert keyword-rule inference rather than an external paid LLM API.
- **Simulated Payment:** Checkout is in demonstration mode; no real financial transactions take place.

### Future Scope
- Integration with live Indian State Handloom Apex Societies (Co-optex, APCO, Boyanika).
- Automated computer vision loom inspection using Raspberry Pi camera modules.
- Blockchain-backed decentralized Handloom Mark authenticity verification.
