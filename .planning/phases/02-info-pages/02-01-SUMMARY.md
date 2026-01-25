---
phase: 02-info-pages
plan: 01
status: complete
---

# Plan 02-01 Summary: Terms + Privacy Pages

**Completed:** 2026-01-25
**Duration:** ~5 min

## What Was Built

### /terms page
- Converted to client component with accordion state management
- Added sticky TOC sidebar (desktop) with scroll position tracking
- Mobile collapsible TOC at top
- All 9 sections as expandable/collapsible accordions
- ChevronDown icon rotates on expand
- First section expanded by default
- Warm amber-50 styling with rounded-xl, shadow-sm

### /privacy page
- Added TL;DR summary box at top with Shield icon
- 5 key privacy facts in Bulgarian
- 10 sections organized into visual cards
- Grouped by topic: Data collection, Processing, Your rights, Third parties, Complaints
- "Your Rights" sections highlighted with green gradient
- Icons per section (User, Database, Scale, Clock, etc.)
- Warm aesthetic with soft shadows

## Commits

| Hash | Message |
|------|---------|
| 1d5f0cf | feat(02-01): redesign /terms page with accordion + sticky TOC |
| 3156439 | feat(02-01): redesign /privacy page with card layout + summary box |

## Files Modified

- `tools-shop/src/app/terms/page.tsx` - Client component with accordion + sticky TOC
- `tools-shop/src/app/privacy/page.tsx` - Card layout with summary box and grouped sections

## Verification

- Build passes without TypeScript errors
- /terms: TOC visible, accordions work, smooth scrolling
- /privacy: Summary box at top, cards organized, sections grouped
- Both pages: Warm aesthetic, Bulgarian text preserved
