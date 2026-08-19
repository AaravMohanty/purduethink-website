# PurdueTHINK — website

Static site. No build step, no dependencies. Open `index.html` in a browser.

## Layout

    index.html      all five views in one document
    css/site.css    fonts, reveal animation, hover states
    js/app.js       view switching, nav, accordion, scroll reveal
    img/            photos and headshots
    fonts/          Open Sans / Source Serif 4 / IBM Plex Mono (woff2)

## How the page works

One document, five views, toggled by JS — only one `display: block` at a time:

| View | Element id |
|---|---|
| Home | `#home` |
| Our People | `#people` |
| Projects | `#projects` |
| Apply | `#apply` |
| Consulting | `#consulting` |
| Interview Process | `#interview` |

Nav links carry `data-home`, `data-people`, `data-projects`, `data-apply`,
`data-consulting`, `data-interview`. Optional `data-target="<id>"` scrolls to a section after switching.

Other hooks:

- `data-reveal` — fades up when scrolled into view. `data-delay="1|2|3"` staggers.
- `data-acc` on a `<button>` — accordion toggle. Panel is the sibling `.ptk-acc-panel`.
- `data-openacc="<button id>"` — opens that accordion row and scrolls to it.
- `.slot` — a cropped photo frame. Crop is a `transform` on the inner `<img>`.

## Design rules

Palette:

    #0F1D33  ink      heroes, footer
    #1A2F50  navy     dark content bands
    #3E72C8  accent   buttons, eyebrows, rules
    #F4F5F7  gray     light alternating bands
    #FFFFFF  white
    #6E97D8 / #8FB2EA  light blues, for use on dark grounds

Hard rules, applied throughout — keep them:

1. **No rounded corners, no drop shadows, no gradients** except the hero photo scrims.
2. **No two adjacent sections share a background.** Bands run ink → white → navy → gray.
3. **No repeated decorative icons.** Section heads use a 40px rule + tracked uppercase label.
4. Headings weight 700, tight tracking. One accent colour, used sparingly.
5. Hero photos: `opacity: 0.34–0.40` under a two-axis scrim so headline text stays legible.

## Editing

Styles are inline on elements (the page was authored that way). Shared rules —
fonts, reveal, hover states — live in `css/site.css`. Hover states are the `.h01`–`.h09`
classes; they were inline `style-hover` attributes before unbundling.

## Content still to fill

- Current-member and alumnus quotes on the home page (bracketed placeholders).
- Recruitment dates are Fall 2026; update each semester in the `#apply-timeline` section.
- The apply button points at a Google Form — swap the URL when the cycle changes.
