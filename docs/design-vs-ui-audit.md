# Design vs Running UI — Comprehensive Audit

**Date:** 2026-03-13 (Playwright re-audit)
**Design File:** `docs/ui-design.pen`
**Source:** `src/BlackSpace.Web/`
**Method:** Automated CSS extraction via Playwright at `http://localhost:4200` (1440px viewport)

---

## Critical Discrepancies

### 1. Problem Section H2 — Literal `\n` Displayed Instead of Line Break

The headline renders as `The talent is here.\nThe network wasn't.` with a literal backslash-n visible on screen, instead of breaking across two lines.

- **Design:** Two-line headline with line break
- **Code:** Literal `\n` string in text content

---

### 2. Section Background Colors Systematically Wrong (REGRESSION)

Previous audit marked this as fixed, but all section backgrounds are incorrect — both the alternation pattern is swapped and some hex values are wrong.

| Section | Design | Code (Computed) | Status |
|---------|--------|-----------------|--------|
| Hero | Radial gradient `#0D1B3E -> #07080F` | `radial-gradient(rgb(13,27,62), rgb(7,8,15) 70%)` | Gradient OK but position wrong (see #3) |
| Problem | `#0A0B14` | `rgb(7,8,15)` = `#07080F` | **WRONG** |
| Who It's For | `#07080F` | `rgb(10,13,20)` = `#0A0D14` | **WRONG** (also wrong hex — `0D` not `0B`) |
| What We Do | `#0A0B14` | `rgb(7,8,15)` = `#07080F` | **WRONG** |
| Signup | `#07080F` | `rgb(10,13,20)` = `#0A0D14` | **WRONG** |
| Founder | `#0A0B14` | `rgb(7,8,15)` = `#07080F` | **WRONG** |
| Footer | `#07080F` | `rgb(5,6,8)` = `#050608` | **WRONG** |

**Issues:** Alternation pattern is inverted. Sections using lighter color have `#0A0D14` instead of `#0A0B14`. Footer uses `#050608` instead of `#07080F`.

---

### 3. Hero Gradient Center Position Missing (REGRESSION)

- **Design:** Radial gradient centered at `y: 0.4` (40% from top) with `size: 1.2 x 1.2`
- **Code:** `radial-gradient(rgb(13,27,62), rgb(7,8,15) 70%)` — no position specified, defaults to center
- **Expected:** `radial-gradient(ellipse 120% 120% at center 40%, #0D1B3E 0%, #07080F 100%)`

---

### 4. Nav Logo Font Family Wrong (REGRESSION)

- **Design:** `fontFamily: "Sora"`, `letterSpacing: 2`
- **Code:** `fontFamily: Inter, sans-serif`, `letterSpacing: 2.4px`
- **Fix needed:** Change to `font-family: 'Sora', sans-serif` and `letter-spacing: 2px`

---

### 5. Nav CTA Button Using Default Size Instead of Small (REGRESSION)

| Property | Design (Nav CTA) | Code |
|----------|-----------------|------|
| Font size | 14px | 16px |
| Padding | 10px 24px | 16px 32px |
| Border radius | 6px | 8px |

The `size="small"` variant is not being applied to the nav CTA button.

---

### 6. Signup Form Card Wrapper Missing (REGRESSION)

The design wraps the signup form in a card. The code has no card styling.

| Property | Design | Code |
|----------|--------|------|
| Background | `#0D0E18` | transparent |
| Border | `1px solid #1A1A2E` | none |
| Border radius | 16px | 0px |
| Padding | 40px | 0px |
| Width | 520px | 560px |
| Gap | 20px | 16px |

---

### 7. Founder Photo Size and Shape Wrong (REGRESSION)

| Property | Design | Code |
|----------|--------|------|
| Width | 100px | 200px |
| Height | 100px | 200px |
| Border radius | 50% (circular) | 16px (rounded square) |
| Border | 2px solid `#4F9CF730` | none |

---

### 8. Audience Grid Bottom Row Not Centered (REGRESSION)

The bottom row (cards 4 & 5) is left-aligned instead of centered within the grid.

- **Design:** Row 1 = 3 cards full width, Row 2 = 2 cards centered
- **Code:** Simple 3-column grid, bottom row left-aligned. Card 4 starts at left: 0, card 5 at left: 392. Grid width: 1152. Not centered.
- **Grid gap:** 24px (should be 20px)

---

## Major Discrepancies

### 9. Hero Section Padding Wrong

- **Design:** `padding: [120, 200]` (120px vertical, 200px horizontal)
- **Code:** `padding: 96px 24px 64px`
- All section vertical padding is 96px instead of the design-specified values (120px hero, 100px most sections, 80px founder)

---

### 10. Hero Tag Text Styling Wrong

| Property | Design | Code |
|----------|--------|------|
| Font size | 12px | 14px |
| Padding (vertical) | 8px | 6px |
| Letter spacing | 0.5px | normal |

---

### 11. Hero Headline Missing Letter Spacing (REGRESSION)

- **Design:** `letterSpacing: -2`
- **Code:** `letter-spacing: normal`
- **Also:** `line-height: 70.4px` (1.1) — should be `1.05` (67.2px)

---

### 12. Hero Subtitle Sizing Wrong (REGRESSION)

| Property | Design | Code |
|----------|--------|------|
| Font size | 20px | 18px |
| Max width | 700px | 600px |
| Color | `#8A8A9A` | `rgba(255,255,255,0.7)` |
| Line height | 1.6 (at 20px = 32px) | 28.8px (1.6 at 18px) |

---

### 13. Nav Link Styling Wrong

| Property | Design | Code |
|----------|--------|------|
| Font weight | 500 | 400 |
| Color | `#8A8A9A` | `rgba(255,255,255,0.7)` |

---

### 14. Nav Background Alpha Wrong

- **Design:** `#07080FE0` = `rgba(7,8,15,0.878)`
- **Code:** `rgb(7,8,15)` — fully opaque, no transparency

---

### 15. Nav Has Extra "Founder" Link

- **Design:** Shows 3 links: "About", "Who It's For", "What We Do"
- **Code:** Shows 4 links: "About", "Who It's For", "What We Do", "Founder"

---

### 16. Problem Section Paragraph Text Wrong (REGRESSION)

| Property | Design | Code |
|----------|--------|------|
| Font size | 17px | 16px |
| Line height | 1.7 | 1.8 (28.8/16) |
| Color | `#8A8A9A` | `rgba(255,255,255,0.7)` |

---

### 17. Problem Section H2 Line Height

- **Design:** `lineHeight: 1.15` (46px at 40px font)
- **Code:** `60px` (1.5 at 40px)

---

### 18. Stat Callout Styling Wrong (REGRESSION)

| Property | Design | Code |
|----------|--------|------|
| Padding | 32px 48px | 40px (uniform) |
| Border radius | 12px | 16px |

---

### 19. Stat Content Different from Design

| Property | Design | Code |
|----------|--------|------|
| Number | "12,000+" | "0" |
| Description | "jobs in Canada's space and defence sector" | "The number of dedicated professional networks for Black Canadians in the space and defence sector." |

---

### 20. Problem Section Closing Statement Not Emphasized (REGRESSION)

- **Design:** color: `#FFFFFF`, fontWeight: 500, fontSize: 19px
- **Code:** color: `rgba(255,255,255,0.7)`, fontWeight: 400, fontSize: 16px
- **Text also differs:** Design says "We're here to change that..." / Code says "We're building the network..."

---

### 21. Founder Name Styling Wrong

| Property | Design | Code |
|----------|--------|------|
| Font size | 22px | 24px |
| Letter spacing | -0.5px | normal |

---

### 22. Founder Title Styling Wrong

| Property | Design | Code |
|----------|--------|------|
| Font size | 15px | 14px |
| Font weight | 500 | 400 |

---

### 23. Founder Bio Styling Wrong

| Property | Design | Code |
|----------|--------|------|
| Font size | 15px | 16px |
| Color | `#8A8A9A` | `rgba(255,255,255,0.7)` |
| Line height | 1.6 (24px) | 25.6px (1.6 at 16px) |

---

### 24. Required Asterisk Color Wrong (REGRESSION)

- **Design (normal state):** `#8A8A9A` (gray, same as label)
- **Code:** `rgb(255,59,48)` = `#FF3B30` (red) — always red, not just on error

---

### 25. Submit Button Text Wrong

- **Design:** "Join Black Space Canada"
- **Code:** "Join the Community"

---

### 26. Reassurance Text Wrong (REGRESSION)

| Property | Design | Code |
|----------|--------|------|
| Font size | 13px | 14px |
| Color | `#52526A` | `rgba(255,255,255,0.6)` |
| Text align | center | start (left) |
| Content | "We'll send you a welcome email with a link to our LinkedIn group and details on the next virtual meetup. No spam, ever." | "We'll never spam you. Just community updates and opportunities." |

---

### 27. Footer Background Wrong

- **Design:** `#07080F`
- **Code:** `rgb(5,6,8)` = `#050608`

---

### 28. Footer Logo Font Family Wrong (REGRESSION)

- **Design:** `Sora`, letterSpacing: 2px
- **Code:** `Inter, sans-serif`, letterSpacing: 2.1px

---

### 29. Footer Links Structure Wrong

- **Design:** Shows `hello@blackspace.ca` email + LinkedIn icon
- **Code:** Shows "About", "Who It's For", "What We Do", "Contact" links + LinkedIn icon
- **Footer link color:** `rgba(255,255,255,0.6)` — should be `#8A8A9A`
- **Footer link font size:** 14px — should be 13px

---

### 30. Footer Text Styling Wrong (REGRESSION)

| Element | Property | Design | Code |
|---------|----------|--------|------|
| Disclaimer | Font size | 12px | 13px |
| Disclaimer | Color | `#52526A` | `rgba(255,255,255,0.4)` |
| Copyright | Font size | 12px | 13px |
| Copyright | Color | `#3A3A4A` | `rgba(255,255,255,0.4)` |

---

## Minor Discrepancies

### 31. Cookie Banner Text Different

- **Design:** "We use analytics to improve your experience. No personal data is sold."
- **Code:** "We use cookies to improve your experience. By continuing to use this site, you agree to our use of cookies."

---

### 32. Cookie Button Styling Wrong

| Property | Design | Code |
|----------|--------|------|
| Font size | 13px | 14px |
| Border radius | 6px | 8px |
| Button gap | 10px | (not measured but likely off) |

---

### 33. Audience Card Titles Different from Design

| Card | Design | Code |
|------|--------|------|
| 1 | "Software & Systems Engineers" | "Software Engineers" |
| 2 | "Hardware & Mechanical Engineers" | "Hardware Engineers" |
| 3 | "Students & Early-Career" | "Students & New Grads" |
| 4 | "Entrepreneurs & Contractors" | "Entrepreneurs" |
| 5 | "Scientists & Researchers" | "Scientists & Researchers" (matches) |

Card descriptions also differ from design.

---

### 34. Color Approach: Hex vs RGBA Throughout (REGRESSION)

Many colors have reverted to rgba values instead of the flat hex colors specified in the design:

| Element | Design | Code |
|---------|--------|------|
| Hero subtitle | `#8A8A9A` | `rgba(255,255,255,0.7)` |
| Problem paragraphs | `#8A8A9A` | `rgba(255,255,255,0.7)` |
| Nav links | `#8A8A9A` | `rgba(255,255,255,0.7)` |
| Footer links | `#8A8A9A` | `rgba(255,255,255,0.6)` |
| Disclaimer | `#52526A` | `rgba(255,255,255,0.4)` |
| Copyright | `#3A3A4A` | `rgba(255,255,255,0.4)` |
| Reassurance | `#52526A` | `rgba(255,255,255,0.6)` |
| Founder bio | `#8A8A9A` | `rgba(255,255,255,0.7)` |
| Stat description | `#8A8A9A` | `rgba(255,255,255,0.6)` |

---

### 35. Section Vertical Padding All Wrong

| Section | Design | Code |
|---------|--------|------|
| Hero | 120px | 96px top, 64px bottom |
| Problem | 100px | 96px |
| Who It's For | 100px | 96px |
| What We Do | 100px | 96px |
| Signup | 100px | 96px |
| Founder | 80px | 96px |
| Footer | 48px top/bottom | 48px top, 32px bottom |

---

### 36. Pillar Card (What We Do) Gap Wrong

- **Design:** `gap: 16`
- **Code:** `gap: 16px` (matches)
- **But grid gap:** Design says 24px between cards, code has 24px (matches)

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical (completely wrong/missing) | 8 | All OPEN |
| Major (visually noticeable) | 22 | All OPEN |
| Minor (subtle differences) | 6 | All OPEN |
| **Total** | **36** | **0 fixed** |

### Top Priority Fixes
1. Fix literal `\n` in problem headline (renders as text instead of line break)
2. Fix ALL section background colors (swapped pattern + wrong hex values)
3. Add signup form card wrapper (background, border, padding, radius)
4. Fix founder photo (100px circular with border, not 200px rounded square)
5. Fix nav logo to use Sora font
6. Apply `size="small"` to nav CTA button
7. Fix hero gradient position (center at 40% from top)
8. Center audience grid bottom row
9. Fix hero headline letter-spacing (-2px) and line-height (1.05)
10. Fix hero subtitle (20px, 700px max-width, #8A8A9A color)
11. Fix all rgba colors to flat hex equivalents per design
12. Fix all section vertical padding to match design values
