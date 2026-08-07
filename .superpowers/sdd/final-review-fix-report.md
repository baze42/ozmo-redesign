# Final Whole-Branch Review Fix Report

## Root Cause Summary

1. **Sticky header anchor clearance:** At widths up to 900px, the header switched to a single-column, three-row grid. Its rendered height exceeded the audit form's fixed `110px` scroll margin, so smooth anchor scrolling placed the form under the sticky header on tablet and mobile.
2. **CTA and kicker contrast:** Buttons used white text on `--terracotta` (`#C1622D`), and small kickers used that terracotta on `--background` (`#F5EFE6`). The contrast ratios were about 4.16:1 and 3.64:1, below the 4.5:1 WCAG AA requirement for normal text.
3. **Field error semantics:** Form submission only inserted visible error text. Error nodes had no IDs, controls had no `aria-describedby` or `aria-invalid` state, and failed submission did not move focus to the first invalid control.
4. **Eager PNG delivery:** All four content images were direct PNG `<img>` elements without responsive sources or loading priority. This made the browser eligible to fetch roughly 7.3 MB of original image data during the initial page load.
5. **Optional website validation:** The form used `novalidate`, while custom validation checked only the required fields and email. A populated invalid URL therefore passed custom validation.
6. **Fragment and reduced-motion behavior:** A JavaScript click handler prevented default anchor navigation and called `scrollIntoView`, so URLs did not receive fragments and the behavior always requested smooth motion. CSS had no reduced-motion override.

## Tests And RED/GREEN Evidence

### RED

- `node --test tests/form-behavior.test.mjs tests/visual-system.test.mjs tests/image-assets.test.mjs` failed on populated invalid URLs, missing error associations/invalid state/focus, missing responsive image markup and files, and missing reduced-motion CSS.
- The corrected focused contrast assertion failed because `.button` and `.section-kicker` still referenced `--terracotta` instead of `--terracotta-700`.
- `npx playwright test tests/browser.spec.mjs --grep='anchor navigation|hero audit CTA'` passed on desktop but failed all four tablet/mobile cases because `formRect.top < headerRect.bottom` after scrolling settled.
- Browser checks for URL fragments and an invalid populated website failed while custom anchor interception and incomplete validation were still present.

### GREEN

- Focused Node regressions: 16 passed, 0 failed.
- Focused exact header-clearance regressions: 6 passed across desktop, tablet, and mobile.
- Full verification: 19 Node tests and 21 Playwright tests passed.

## Implementation Summary

- Reworked the responsive header into a compact two-column first row plus navigation row and applied `132px` responsive anchor clearance to sections and the audit form.
- Moved CTA surfaces, kickers, and plan numbers to `--terracotta-700`. White-on-dark-terracotta is about 5.97:1; dark-terracotta-on-background is about 5.22:1.
- Added stable error IDs and `aria-describedby` attributes, dynamic `aria-invalid`, invalid-control styling, cleared state for corrected fields, and first-invalid-control focus.
- Added optional website validation for populated values, accepting only valid HTTP or HTTPS URLs.
- Removed custom anchor interception so native navigation updates history and fragments. Added a `prefers-reduced-motion: reduce` override for scrolling and button motion.
- Wrapped all four content images in responsive AVIF/WebP `<picture>` sources with intrinsic dimensions. The hero has `fetchpriority="high"`; all below-fold images use `loading="lazy"`.
- Added Sharp as a development dependency and `npm run optimize:images` backed by `scripts/optimize-images.mjs`. All four original PNG files remain unchanged.
- Generated 16 optimized variants totaling 507,096 bytes, below the 1,500,000-byte regression budget.

## Verification Commands And Results

- `npm run optimize:images` - passed; generated AVIF and WebP variants for four source PNGs.
- Focused Node test command - 16 passed, 0 failed.
- Focused Playwright clearance command - 6 passed, 0 failed.
- `npm run verify` - passed; 19 Node tests and 21 browser tests across Desktop Chrome, Tablet Safari, and Mobile Safari.
- `git diff --check` - passed with no whitespace errors.
- `npm audit --omit=dev` - passed with 0 production vulnerabilities.
- Rendered image check - hero loaded eagerly; each lazy image loaded an AVIF source with nonzero intrinsic dimensions after entering the viewport.

## Files Changed

- `index.html`
- `styles.css`
- `script.js`
- `package.json`
- `package-lock.json`
- `scripts/optimize-images.mjs`
- `assets/images/optimized/*.avif`
- `assets/images/optimized/*.webp`
- `tests/browser.spec.mjs`
- `tests/form-behavior.test.mjs`
- `tests/image-assets.test.mjs`
- `tests/visual-system.test.mjs`
- `.superpowers/sdd/final-review-fix-report.md`

## Commit SHA(s)

- `cad2d5e94a07c256df4731412d2e4837ef46b5b5` - implementation, generated assets, and regressions.
