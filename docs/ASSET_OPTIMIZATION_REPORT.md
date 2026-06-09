# ALIENXIP Asset Optimization Report

Date: 2026-06-09

Scope: asset and performance optimization before War Room. No design, copy, layout, UX, animation, or brand structure changes were intentionally made.

## Summary

| Metric | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| `src/assets` total | 87,807,739 bytes | 37,134,040 bytes | 50,673,699 bytes |
| `src/assets` total | 83.74 MiB | 35.41 MiB | 48.33 MiB |
| Reduction | - | - | 57.7% |

Current `src/assets` by type:

| Type | Count | Total |
| --- | ---: | ---: |
| WebP | 137 | 28.89 MiB |
| MP4 | 2 | 4.80 MiB |
| PNG | 8 | 1.72 MiB |

## Optimized Files

| File | Before | After | Technique | Gain |
| --- | ---: | ---: | --- | ---: |
| `src/assets/mission-003-screen.mp4` | 12,679,403 B | 4,373,769 B | H.264 CRF 27, slow preset, audio removed, faststart | 8,305,634 B |
| `src/assets/hero-video.mp4` | 1,990,922 B | 664,237 B | H.264 CRF 27, AAC 96k preserved, faststart | 1,326,685 B |
| `src/assets/solutions/card-1.webp` | 2,663,481 B | 443,904 B | PNG to WebP q92 | 2,219,577 B |
| `src/assets/solutions/card-2.webp` | 2,430,001 B | 338,444 B | PNG to WebP q92 | 2,091,557 B |
| `src/assets/solutions/card-3.webp` | 2,179,433 B | 281,886 B | PNG to WebP q92 | 1,897,547 B |
| `src/assets/solutions/card-4.webp` | 2,711,960 B | 419,808 B | PNG to WebP q92 | 2,292,152 B |
| `src/assets/solutions/card-5.webp` | 2,162,516 B | 241,910 B | PNG to WebP q92 | 1,920,606 B |
| `src/assets/solutions/card-6.webp` | 2,249,039 B | 343,756 B | PNG to WebP q92 | 1,905,283 B |
| `src/assets/mission-003-notebook.webp` | 2,413,956 B | 396,000 B | PNG to WebP q92 | 2,017,956 B |
| `src/assets/clients/clube-atletico-boa-vontade-clean.webp` | 1,978,960 B | 166,542 B | PNG to WebP q92 | 1,812,418 B |
| `src/assets/clients/faculdade-da-cidade-clean.webp` | 2,171,220 B | 125,400 B | PNG to WebP q92 | 2,045,820 B |
| `src/assets/clients/familia-mineira-clean.webp` | 2,222,815 B | 137,942 B | PNG to WebP q92 | 2,084,873 B |
| `src/assets/clients/fides7-clean.webp` | 2,173,656 B | 112,710 B | PNG to WebP q92 | 2,060,946 B |
| `src/assets/clients/instituto-transformando-historia-clean.webp` | 1,490,843 B | 107,326 B | PNG to WebP q92 | 1,383,517 B |
| `src/assets/clients/martronics-clean.webp` | 2,113,236 B | 83,352 B | PNG to WebP q92 | 2,029,884 B |
| `src/assets/clients/vision-car-clean.webp` | 2,090,940 B | 85,562 B | PNG to WebP q92 | 2,005,378 B |
| `src/assets/alienxip-liquid-glass-logo.webp` | 1,698,112 B | 146,530 B | PNG to WebP q95 | 1,551,582 B |
| `src/assets/alienxip-ship-clean.webp` | 1,441,551 B | 246,668 B | PNG to WebP q95 | 1,194,883 B |
| `src/assets/portal-final.webp` | 984,356 B | 75,538 B | Root PNG to WebP q92 and moved into `src/assets` | 908,818 B |

## Archived Files

Original production assets replaced by optimized versions were moved to:

`_archive/visual-references/optimized-originals/`

Unused source assets were moved to:

`_archive/visual-references/unused-src-assets/`

Root/support visual references were moved to:

`_archive/visual-references/root-and-support/`

The archive includes the old PNG/MP4 originals, `apoiadores/`, root visual references, and temporary `.tmp-*` screenshots. Nothing was permanently deleted.

Full per-file archive manifest:

`docs/ASSET_ARCHIVE_MANIFEST.json`

## Validation

| Check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run verify:env` | Passed |
| `npm run build` | Passed, no asset warning after portal fix |
| `npm run test:e2e` | Passed, 2/2 |
| `npm audit --audit-level=moderate` | Passed, 0 vulnerabilities |

Browser validation after optimization:

- Desktop and mobile screenshots captured in `.tmp/`.
- No broken images detected.
- No failed network requests detected.
- `mission-003-screen.mp4` loaded with `readyState=4`.
- Mobile horizontal overflow: false.
- Desktop horizontal overflow: true, consistent with the existing horizontal solutions section behavior and not caused by missing assets.

## Remaining Risks

- The hero image sequence still contains 120 WebP frames and remains the largest cumulative visual system.
- Desktop horizontal overflow should be reviewed separately only if it is not intentional for the horizontal solutions experience.
- WebP support is standard for current target browsers, but an AVIF/WebP fallback strategy can be added later if ALIENXIP targets older browsers.
