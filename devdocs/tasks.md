# Phase Overview

### **Phase 1 — Proof of Concept (POC)**

Goal: Validate the core idea — display AI-generated single-file games with metadata and load them safely in a sandboxed iframe.

### **Phase 2 — Minimum Viable Product (MVP)**

Goal: Deliver the essential experience: gallery + detail + sandboxed play + contributor flow + CI validation + docs.

### **Phase 3 — Post-MVP Enhancements**

Goal: Improve discoverability, offline usage (PWA), tagging, minimal analytics.

### **Phase 4 — Full Releases (v1.1 → v2.0)**

Goal: Educational packs, jam features, community tooling, trust badges, advanced filtering.

---

# Sprint Breakdown

## **Sprint 1 — POC: Core System & Game Loading**

### **Task 1: Create Base Project Structure (Vite + React + Tailwind)**

**Description**
Initialize the SPA structure for the arcade using Vite, React, Tailwind 4.

**Acceptance Criteria**

- Vite project compiles and runs.
- Tailwind is configured and working.
- Source folder structure follows PRD guidelines.
- GitHub repo initialized.

---

### **Task 2: Implement Static Game Loader (local stub)**

**Description**
Create a local `/games/sample-game/` folder containing a tiny AI-generated single-file HTML example.

**Acceptance Criteria**

- `index.html` loads successfully when opened in browser.
- `info.json` recognized.
- `prompt.md` optional file present.

---

### **Task 3: Implement Sandbox Iframe Component**

**Description**
Create reusable React component to display a game in a strict sandbox for security-first compliance.

**Acceptance Criteria**

- Game loads in `<iframe sandbox="allow-scripts allow-pointer-lock allow-fullscreen">`.
- No same-origin access allowed.
- Error fallback message if file missing.

---

### **Task 4: Build Manifest Generator Script**

**Description**
Node script scans `/games` folder and generates `games-manifest.json`.

**Acceptance Criteria**

- Outputs complete list of games with validated metadata.
- Runs locally from CLI.
- Recognizes required fields in info.json.

**Dependencies:** Task 2

---

### **Task 5: Create Basic Gallery Page (POC version)**

**Description**
Render all games from manifest in a simple list/grid.

**Acceptance Criteria**

- List of sample games displayed.
- Each card clickable → opens game detail page.

**Dependencies:** Task 4

---

## **Sprint 2 — MVP: Core Experience + Contributions + CI Validation**

### **Task 6: Implement Full Game Gallery (UI + Search)**

**Description**
Convert POC gallery into polished version with search bar.

**Acceptance Criteria**

- Cards display name, model, description.
- Real-time search by name/description.
- Responsive layout (mobile → desktop).

**Dependencies:** Task 5

---

### **Task 7: Game Detail Page**

**Description**
Dedicated page/modal showing metadata, prompt, and actions.

**Acceptance Criteria**

- Displays full description, model, optional creator links.
- "Play Game" button loads iframe view.
- "View Prompt" button shows prompt.md text.

---

### **Task 8: Contributor Template Folder**

**Description**
Add `/templates/game/` folder to guide contributors.

**Acceptance Criteria**

- Includes: `index.html`, `info.json`, `prompt.md`.
- Schema example included.
- Documented in CONTRIBUTING.md.

---

### **Task 9: Write CONTRIBUTING.md (PRD-based)**

**Description**
Explain game structure, mandatory fields, security rules, AI-only requirement.

**Acceptance Criteria**

- Steps for adding a game.
- “AI-only submissions” rule clearly stated.
- Security rules: no POST, no WebSockets, allowed CDNs only.

**Dependencies:** Task 8

---

### **Task 10: Pre-Commit Hooks (Husky + lint-staged)**

**Description**
Prevent unsafe or invalid games from being committed locally.

**Acceptance Criteria**

- Prettier + ESLint run on staged files.
- `npm run validate:games` runs before commit.

---

### **Task 11: Build Validation Script (Security First)**

**Description**
Node script to validate:

- info.json schema
- Forbidden POST/WebSocket/EventSource
- Only approved CDNs
- No trackers/analytics

**Acceptance Criteria**

- Fails on prohibited patterns.
- Alerts contributor with specific errors.
- Fully automated; no manual checking required.

**Dependencies:** Task 10, Task 4

---

### **Task 12: GitHub Actions CI Pipeline**

**Description**
Runs validation + lint on every PR.

**Acceptance Criteria**

- PR blocked if validation fails.
- Preview deployment generated (Netlify).

**Dependencies:** Task 11

---

### **Task 13: MVP UI Polish**

**Description**
Complete gallery, detail view, and navigation polish.

**Acceptance Criteria**

- Consistent spacing, typography, brand colors.
- All required MVP flows work.
- Lighthouse ≥ 90 on desktop.

**Dependencies:** Task 6, Task 7

---

### **Task 14: MVP Documentation & README**

**Description**
High-quality README + getting-started instructions.

**Acceptance Criteria**

- Explains concept, AI-only rules.
- Screenshots included.
- Clear dev setup steps.

---

### **Task 15: Initial Seed Games (3–5 AI-generated examples)**

**Description**
Add validated games representing multiple models.

**Acceptance Criteria**

- Games pass validation.
- Represent diversity (GPT, Claude, Llama).
- Show correct metadata formatting.

---

## **Sprint 3 — v1.1 (Post-MVP): PWA + Tagging + Minimal Analytics**

### **Task 16: Add Tags Support (Model + Genre + Difficulty)**

**Description**
Extend info.json schema and manifest to include tags.

**Acceptance Criteria**

- Tags optional but recognized.
- Gallery filter bar shows tag options.
- Filters combine with search.

---

### **Task 17: PWA Installation Support**

**Description**
Add manifest.json, service worker caching shell + recent games.

**Acceptance Criteria**

- Install prompt appears.
- App opens as standalone.
- Recently viewed games load offline.

---

### **Task 18: Minimal Privacy-Compliant Analytics**

**Description**
Add cookie-less, anonymous tracking for:

- page_view
- game_opened
- PWA installed

Strict GDPR/CCPA compliance.

**Acceptance Criteria**

- No cookies.
- No fingerprinting.
- Opt-in (if required by policy).
- No analytics in game HTML.

---

## **Sprint 4 — v1.2: Community & Education Features**

### **Task 19: Jam Tagging System**

**Description**
Support “Jam: XYZ2025” label from info.json.

**Acceptance Criteria**

- Filter by jam.
- Jam badge displayed on card.

---

### **Task 20: Featured Games Mechanism**

**Description**
Highlight rotating curated games.

**Acceptance Criteria**

- Simple config file defines featured list.
- Display carousel or featured banner.

---

### **Task 21: Accessibility Improvements (WCAG 2.1 AA)**

**Description**
Ensure UI meets accessibility benchmarks.

**Acceptance Criteria**

- Keyboard navigation works for all UI.
- Proper ARIA labels.
- High contrast validation.

---

### **Task 22: Educator Packs (Docs Only)**

**Description**
Static curation of game sets for teaching.

**Acceptance Criteria**

- Markdown pages under `/docs/education`.
- At least 2 curated packs.

---

## **Sprint 5 — v2.0: Advanced Features**

### **Task 23: Trust Badges ("Verified / Reviewed")**

**Description**
Tag games that underwent optional manual review.

**Acceptance Criteria**

- Display badge on card + detail view.
- Trusted games filter.

---

### **Task 24: AI-Based Metadata Assistant (Optional CLI Tool)**

**Description**
Optional script to auto-generate `info.json` from a game folder.

**Acceptance Criteria**

- CLI runs locally.
- Suggests model, tags, description.
- Human approves final file.

---

### **Task 25: Performance & SEO Enhancements**

**Description**
Improve indexing, loading, and caching.

**Acceptance Criteria**

- Sitemap.xml auto-generated.
- Image lazy-loading.
- Lighthouse ≥ 90 on mobile.

---

# Ambiguities / Items Requiring Clarification

1. **Content Moderation Policy**
   - Should maintainers reject NSFW or political content even if AI-generated?

2. **Offline caching limit**
   - Cache last N games (N=3? 5? 10?) — decision required.

3. **Analytics vendor**
   - Plausible? Self-hosted? Custom? Needs selection.

4. **Brand Kit**
   - Until brand_kit.md exists, visual design tasks use placeholder values.
