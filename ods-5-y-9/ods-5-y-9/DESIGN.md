---
name: Industry, Innovation & Equality
description: SDG 5 + SDG 9 from Guanajuato, staged as one hazed hall lit by a half sun and its mirror.
colors:
  neblina-0: "#e7d3ec"
  neblina-1: "#e1cdeb"
  neblina-2: "#d6c3e9"
  neblina-3: "#c9b6e6"
  lavanda: "#9b86d6"
  magenta: "#c2187a"
  magenta-2: "#9e1263"
  rosa: "#ff86bb"
  azul: "#5fb3e3"
  azul-claro: "#cbeaff"
  tinta: "#141c36"
  tinta-2: "#3a4672"
  anochecer: "#23183d"
  anochecer-2: "#33255a"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "min(8vw, 14vh)"
    fontWeight: 900
    lineHeight: 0.84
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 5.2rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  title:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(1.3rem, 1.9vw, 1.65rem)"
    fontWeight: 800
    lineHeight: 1.02
    fontVariation: "'wdth' 75"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.08em"
  button:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.07em"
rounded:
  hairline: "2px"
  card: "3px"
  disc: "999px"
spacing:
  gutter: "5vw"
  container: "1240px"
  section-block: "clamp(96px, 12vw, 168px)"
  section-gap: "clamp(80px, 10vw, 130px)"
  row: "2.2rem"
components:
  button-primary:
    backgroundColor: "{colors.magenta}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.hairline}"
    padding: "0.95rem 1.35rem"
  button-primary-hover:
    backgroundColor: "{colors.magenta-2}"
    textColor: "{colors.white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    typography: "{typography.button}"
    rounded: "{rounded.hairline}"
    padding: "0.95rem 1.35rem"
  button-outline-hover:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.neblina-0}"
  button-outline-dark:
    backgroundColor: "transparent"
    textColor: "{colors.neblina-0}"
    rounded: "{rounded.hairline}"
    padding: "0.95rem 1.35rem"
  button-outline-dark-hover:
    backgroundColor: "{colors.neblina-0}"
    textColor: "{colors.anochecer}"
  button-small:
    padding: "0.65rem 1rem"
  input-field:
    backgroundColor: "{colors.neblina-0}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.hairline}"
    padding: "0.9rem 1rem"
  game-option:
    backgroundColor: "transparent"
    textColor: "{colors.neblina-0}"
    rounded: "{rounded.hairline}"
    padding: "1.05rem 1.2rem"
  myth-card:
    backgroundColor: "{colors.neblina-0}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    padding: "2.2rem"
---

# Design System: Industry, Innovation & Equality

## Overview

**Creative North Star: "The Hall of the Half Sun"**

The whole site is one vast room filled with a single frequency of light. The ground is lavender-magenta haze, never white; a magenta half sun (SDG 5) sits on the far wall and its light blue mirror (SDG 9) hangs from the ceiling. Neither half is complete on its own, and every surface of the system restates that: the disc that only closes when both halves meet, the two-color dots, the reflected echoes under selections. Depth comes from haze and distance, not from cards and shadows.

Typography carries the architecture. Condensed black Archivo is set low on long horizon hairlines that run edge to edge, like a floor line in a gallery; small tracked uppercase captions are scattered like figures standing in the room. Content is laid out as rows divided by hairlines, never as tiles. When the visitor enters the games the hall dims to dusk violet, and the same rules continue in negative.

The palette is bound to the team logo: lavender buildings, magenta arrow and gender symbol, light blue gear, navy ring. The system rejects the SDG-template look of icon grids and stat-card rows.

**Key Characteristics:**
- One-frequency haze ground in four steps, with a dusk inversion for play.
- Magenta and light blue always appear as halves of one whole.
- Condensed black display type sitting on full-bleed horizon hairlines.
- Rows and hairlines instead of cards; 2px corners on anything you press.
- Selections answered twice: once in place, once as a faint mirror.
- Slow exponential ease-out on everything that moves.

## Colors

A monofrequency haze translated from sodium amber into the logo's lavender, with two saturated halves and navy ink.

### Primary
- **Sun Magenta** (`magenta`): the SDG 5 half of the sun, the filled primary button, checked boxes, active underlines and the focus ring. Also floods the full-bleed Guanajuato band with white text.
- **Deep Sun Magenta** (`magenta-2`): primary hover, emphasised small text on haze (figure units, terms in the memory game, the hero's closing line, error text) where plain magenta would be too light for small type.
- **Sun Core Pink** (`rosa`): the hot centre of the sun's radial gradient; on the dusk ground it replaces magenta for active tab rules, wrong answers and selected city works.

### Secondary
- **Mirror Blue** (`azul`): the SDG 9 half of the sun in the ceiling, the upper half of every split dot, timeline nodes on the lower axis, correct answers, reflected silhouettes.
- **Mirror Glare** (`azul-claro`): the pale centre of the mirror half; links, coins and icons on the dusk ground, matched memory cards.

### Tertiary
- **Logo Lavender** (`lavanda`): the logo's buildings; scrollbar thumb and the third series colour in the city indicators. Used sparingly.

### Neutral
- **Haze 0 to Haze 3** (`neblina-0` to `neblina-3`): the ground, lightest to deepest. `neblina-1` is the default page and hero colour; `neblina-0` fills fields, card faces and light text on dark; `neblina-2` and `neblina-3` deepen section gradients and the sources section. `neblina-3` is also the secondary text colour on dusk.
- **Silhouette Ink** (`tinta`): all body text, outlines, hairlines (at 20 to 40% opacity), silhouettes in the hall, the footer ground.
- **Dim Ink** (`tinta-2`): secondary text, intros, sources and captions on haze.
- **Dusk** (`anochecer`, `anochecer-2`): the dimmed hall of the games section and the backs of memory cards, washed with a magenta radial glow from the top right.

### Named Rules
**The Two Halves Rule.** Magenta sits below, blue sits above. Any split mark (sun, dot, node, card back) puts the magenta half on the floor and the blue half in the ceiling; a gradient between them runs magenta to blue.

**The No White Ground Rule.** Surfaces are haze, dusk, magenta or ink. Pure white is only text on magenta or dark, never a page or panel background.

## Typography

**Display Font:** Archivo variable (with Arial Narrow), width axis 62% to 75%
**Body Font:** Archivo variable (with Helvetica Neue, Arial)

**Character:** One family stretched two ways: compressed to 62% width and weight 900 for architecture, regular width for reading. The condensed caps feel like signage cut into a wall; the body stays plain and open.

### Hierarchy
- **Display** (900, 62% width, min(8vw, 14vh), 0.84, uppercase): the hero title only, set low left beside the rail with its bottom resting on the floor horizon (40.5% from the stage bottom); lead and actions sit below the horizon.
- **Headline** (900, 62% width, clamp(2.6rem, 6vw, 5.2rem), 0.88, uppercase): section titles, always followed by a full-bleed hairline under them. Also the big result numerals and readout figures.
- **Title** (800, 75% width, 1.2 to 2.6rem, about 1.0, uppercase): row headings, half-sun headings (900 at 62% there), accordion summaries, game tabs, trivia questions, myth cards.
- **Body** (400, 1.0625rem, 1.6): reading text, held to 60 to 68ch; intros at 1.15rem in Dim Ink.
- **Label** (700, 0.7 to 0.82rem, 0.05 to 0.12em tracking, uppercase): rail metadata, navigation, source links, scores, field labels, hall numbers.

### Named Rules
**The Horizon Rule.** A section headline sits on a 1px ink hairline at 28% opacity that runs past the container to both viewport edges. Type stands on lines; lines are never boxes.

**The Tabular Figure Rule.** Every changing or comparable number uses tabular numerals.

## Layout

A single centred column of max 1240px inside 5vw side gutters (`spacing.container`, `spacing.gutter`). Sections breathe vertically with clamp(96px, 12vw, 168px) top and clamp(80px, 10vw, 140px) bottom; major blocks inside a section are separated by clamp(80px, 10vw, 130px).

The hero is a 230vh scroll track with a sticky 100svh stage: the WebGL hall full-bleed; a metadata rail at the left that hangs from the top bar on a feathered haze backdrop (fading to clear on its right edge and masked out along its bottom), holding compact hairline-topped readout rows (their captions drop out below 1000px viewport height); the title resting on the floor horizon beside the rail; lead and actions below the horizon; and a seven-column hall-number strip along the bottom edge. Scroll progress (`--p`) dollies the camera and completes the disc.

The hall itself: exponential haze fog (density 0.017) in Haze 0; the half sun on the far wall right of centre (world x 28 on desktop, near centre on mobile) with its faint mirror half in the ceiling and a softened copy in the polished floor; a pale column of sunlight crossing the floor from the foot of the sun to the visitor, white at its core with a magenta edge glow, narrowing toward the viewer. Far silhouettes dissolve into the fog; the nearest figures are drawn unfogged in Silhouette Ink so they read as solid navy.

Data is presented as three-column rows (heading, text, source) divided by hairlines, collapsing to two columns at 1080px and one at 860px. The two-halves section is a three-column grid with the sun in the centre spanning two rows and the SDG 9 text above-left, SDG 5 text below-right, a hairline through the middle. The 2050 timeline alternates items above and below a horizontal axis, turning vertical under 1080px.

Breakpoints: 1000px viewport height (rail readout captions hidden), 1080px (rail hidden, rows reflow, timeline vertical) and 860px (menu becomes a drop panel, hall strip hidden, hero copy stacks at the bottom over a haze fade, all two-column grids go single).

## Elevation & Depth

Depth is atmospheric. The system is flat at rest; distance is conveyed by haze gradients, WebGL fog, opacity and blur. Rows still below the reading line sit in "mist" (20% opacity, 6px blur) and clear as they arrive. Light in the hall is emitted, not cast: the sun, its halo and the floor column glow through the fog. The sticky top bar, hero rail and hall strip use translucent haze with backdrop blur rather than shadows.

### Shadow Vocabulary
- **Sun glow** (`box-shadow: 0 30px 80px rgba(194, 24, 122, 0.35)`): under the magenta half of the CSS sun only.
- **Lifted card** (`box-shadow: 0 24px 50px rgba(0, 0, 0, 0.35)`): the draggable myth card on the dusk ground.
- **Drop panel** (`box-shadow: 0 12px 30px rgba(20, 28, 54, 0.12)`): the mobile menu panel.
- **Bar hairline** (`box-shadow: 0 1px 0 rgba(20, 28, 54, 0.2)`): the top bar once it turns solid.
- **Field focus** (`box-shadow: 0 0 0 3px rgba(194, 24, 122, 0.22)`): text input focus halo.

### Named Rules
**The Mirror Rule.** A chosen thing answers twice. Selected trivia options and myth cards carry a faint reflection below; the connection text has an inverted blue echo; silhouettes and the visitor's own figure are mirrored in blue above the floor line.

**The Haze Not Shadow Rule.** Separate planes with haze, blur and hairlines. Soft shadows are reserved for the glow of the sun and for things that physically lift or float (a dragged card, a dropped panel).

## Shapes

Hairline geometry. Anything pressable has near-square 2px corners (`rounded.hairline`); playing cards use 3px (`rounded.card`). The only true curves are circles: the sun halves (`rounded.disc`), the split dots, timeline nodes, coins and the footer logo plate. Borders are 1.5px solid currentColor on controls and 1px ink at 20% on dividers. Icons are drawn in-house on a 24px grid with a 1.75 stroke, round caps and joins.

## Components

### Buttons
Flat, tracked, uppercase, with an arrow that nudges forward.
- **Shape:** near-square (2px), 1.5px border in currentColor, padding 0.95rem 1.35rem; small variant 0.65rem 1rem at 0.8rem.
- **Primary (sun):** filled Sun Magenta, white text; hover deepens to Deep Sun Magenta.
- **Outline:** transparent with Silhouette Ink text and border; hover fills with ink and turns text to Haze 0.
- **Outline on dusk:** Haze 0 text and border; hover fills with Haze 0 and turns text to Dusk.
- **States:** the arrow icon slides 4px on hover; press drops 1px; disabled at 40% opacity.

### Segmented Switch
An ink-outlined two-state switch (the 2050 scenario). Unpressed segments are transparent; the pressed segment fills with ink and light text. Same type as buttons at 0.85rem.

### Inputs / Fields
- **Style:** Haze 0 fill, 1.5px ink stroke, 2px corners, 0.9rem 1rem padding, tracked uppercase label above.
- **Focus:** border turns Sun Magenta with a 3px translucent magenta halo.
- **Checkbox:** custom 22px square, ink outline; checked fills magenta with a white tick that scales in. Each option sits in a hairline-topped row.
- **Error:** Deep Sun Magenta, bold.

### Navigation
- **Top bar:** transparent over the hall, turning translucent haze with blur and a hairline once scrolled. Logo plus condensed caps name at left, tracked uppercase links (0.82rem, 0.1em) with a magenta underline that draws from the left on hover and active.
- **Hall strip:** seven numbered sections across the hero's bottom edge, each a tracked number over a bold label; active hall gets a 2px magenta rule drawn along the top and Deep Sun Magenta text.
- **Mobile:** a 44px outlined burger whose two lines cross; the menu drops as a full-width haze panel with hairline-separated links.

### Data Rows
Hairline-divided rows instead of cards: condensed title, Dim Ink body capped at 65ch, and a source column with a tracked uppercase link and external-link icon. Every figure carries its source here.

### Game Tabs and Options (dusk)
Tabs are condensed caps in Haze 3, active in Haze 0 with a Sun Core Pink rule drawn underneath. Answer options are outlined (1.5px at 35% Haze 0, 2px corners); correct answers take Mirror Blue border and tint, wrong answers Sun Core Pink border with magenta tint. Progress bars are 3px tracks filled with a magenta-to-blue gradient.

### The Half Sun (signature)
Two semicircles stacked into a disc: the lower half a radial gradient from Sun Core Pink to Sun Magenta, the upper half from Mirror Glare to Mirror Blue. The upper half starts faint (about 18%) and offset, and settles to full opacity over 1.8s when the section is reached or the scenario is "acting". Miniature versions appear as split dots in the rail, chain nodes (halves slide in from above and below) and card backs.

### Silhouette Crowd
Navy silhouettes (lying, sitting, reclining, standing) on a floor line, with blue reflections at 40% above. The visitor's committed figure appears in magenta with a fuller blue reflection and rises in over 1s.

## Do's and Don'ts

### Do:
- **Do** keep every ground in the haze family (`neblina-0` to `neblina-3`), the dusk pair for play, or full magenta for one emphatic band.
- **Do** split marks magenta below, blue above, and let blue reach full strength only when the idea "both goals together" is met.
- **Do** set section headlines in Archivo 900 at 62% width, uppercase, on a full-bleed 1px hairline.
- **Do** present facts as hairline rows with a source link in tracked uppercase.
- **Do** use the exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) for reveals, rules and the disc, with long durations (0.4s to 1.8s) for atmospheric changes.
- **Do** collapse motion to near-instant under reduced motion and lift the mist so all rows are visible.

### Don't:
- **Don't** build icon grids or rows of stat cards; that is the SDG template this world refuses.
- **Don't** use a white page or white panels.
- **Don't** round pressable controls beyond 2px or use pill buttons.
- **Don't** separate planes with drop shadows where haze, blur or a hairline will do.
- **Don't** show a figure without its source.
