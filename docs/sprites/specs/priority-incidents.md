# Sprite Specifications — Priority Incidents

Specifications for all 7 priority incident sprites. These specs define the visual design, palette, and animation so that any pixel artist can recreate them consistently.

Each sprite is **16×16 px** designed for **3× upscale to 48×48 px**.

---

## 404_not_found

**Visual Concept:** A floating "404" error page with stubby legs and a confused expression.

**Frames:** 2 (2-frame wobble)

| Frame | Description |
|---|---|
| 0 | Body upright; "404" text visible on the page face; legs straight |
| 1 | Body tilted slightly clockwise; legs spread apart in a "shrug" stance |

**Palette:**

| Color | Hex | Usage |
|---|---|---|
| Transparent | `#00000000` | Background |
| Outline | `#141414` | All borders |
| White | `#F8F8F8` | Page body |
| Light gray | `#C8C8D2` | Page face area |
| Black (eyes) | `#141414` | ×× eye marks (confused expression) |

**Animation:** Frame rate 2 fps, infinite repeat. Frame 0 is the upright pose. Frame 1 is shifted 1 px right with legs splayed.

**Key details:**
- The page body is a rounded rectangle taking up the top 75% of the sprite
- "404" rendered as dot-matrix pixel text in outline color on the white page
- Two small black dot eyes; confused "??" eyebrows
- Two stubby legs (2px wide) descend from the bottom of the page

**File:** `assets/sprites/incidents/404_not_found.png`

---

## missing_semicolon

**Visual Concept:** A giant glowing semicolon (`;`) character that flickers in and out of existence.

**Frames:** 2 (2-frame blink)

| Frame | Description |
|---|---|
| 0 | Solid bright blue semicolon, fully opaque |
| 1 | Same semicolon rendered at 50% alpha (faded/ghostly) |

**Palette:**

| Color | Hex | Usage |
|---|---|---|
| Transparent | `#00000000` | Background |
| Outline | `#141414` | Character border |
| Blue | `#5082DC` | Semicolon body (opaque) |
| Blue (faded) | `#5082DC80` | Semicolon body (frame 2 ghost) |

**Animation:** Frame rate 2 fps, infinite repeat. Creates a slow "flicker" effect — the semicolon keeps appearing and disappearing.

**Key details:**
- The semicolon glyph takes up ~60% of the sprite width and ~80% of the height
- Top circle of the semicolon is in the upper half; the tail/comma curves in the lower half
- The outline remains solid in both frames; only the fill color changes opacity

**File:** `assets/sprites/incidents/missing_semicolon.png`

---

## port_conflict

**Visual Concept:** Two ethernet ports (gray rectangular connectors) facing each other, fighting over a single teal ethernet cable between them.

**Frames:** 2 (2-frame tug-of-war)

| Frame | Description |
|---|---|
| 0 | Cable pulled slightly left; left port is winning |
| 1 | Cable pulled slightly right; right port is winning |

**Palette:**

| Color | Hex | Usage |
|---|---|---|
| Transparent | `#00000000` | Background |
| Outline | `#141414` | All borders |
| Mid gray | `#8C8C96` | Port connector body |
| Light gray | `#C8C8D2` | Port face/highlight |
| Dark gray | `#3C3C46` | Port socket |
| Teal | `#3CB4C8` | Ethernet cable |
| Yellow | `#FFDC3C` | "Spark" / tension indicator |

**Animation:** Frame rate 2 fps, infinite repeat. The cable shifts 2px left/right between frames to simulate the tug-of-war.

**Key details:**
- Left port and right port are symmetrical rectangles (~4×8 px each)
- Each port has a small socket hole in the facing side
- Cable runs between the two ports as a horizontal line
- Small yellow spark dots appear near the cable midpoint

**File:** `assets/sprites/incidents/port_conflict.png`

---

## npm_install_hang

**Visual Concept:** A spinning loading ring with a frustrated face in the center, above an npm terminal banner.

**Frames:** 2 (2-frame spin)

| Frame | Description |
|---|---|
| 0 | Loading ring at 0° (bright segment at top) |
| 1 | Loading ring at 90° (bright segment at right) |

**Palette:**

| Color | Hex | Usage |
|---|---|---|
| Transparent | `#00000000` | Background |
| Outline | `#141414` | Ring border |
| Green | `#3CC864` | Ring body (loading arc) |
| White | `#F8F8F8` | Face highlight |
| Orange | `#E69632` | npm terminal banner |
| White | `#F8F8F8` | Terminal text |

**Animation:** Frame rate 3 fps, infinite repeat. Eye expression changes between frames (mouth stays fixed); loading ring bright segment rotates clockwise. The 2-frame rotation creates a spinning effect.

**Key details:**
- Loading ring: 4px radius circle outline, with a small bright segment that rotates
- Face inside ring: two small dots for eyes + straight-line mouth (frustrated)
- npm banner: bottom 5px is a rounded rectangle with "npm" written in pixel text
- Eye expression: `· ·` normal in frame 0, `> <` in frame 1 (increasingly frustrated); mouth stays as a straight line in both frames

**File:** `assets/sprites/incidents/npm_install_hang.png`

---

## 503_error

**Visual Concept:** A server rack with crossed-out (×) red eyes, smoking from the top.

**Frames:** 2 (2-frame smoke puff)

| Frame | Description |
|---|---|
| 0 | One small smoke wisp above the server; eyes are red × marks |
| 1 | Two larger smoke wisps; eyes glow brighter red |

**Palette:**

| Color | Hex | Usage |
|---|---|---|
| Transparent | `#00000000` | Background |
| Outline | `#141414` | All borders |
| Mid gray | `#8C8C96` | Server rack body |
| Light gray | `#C8C8D2` | Server rack face/front panel |
| Dark gray | `#3C3C46` | Rack shadow/sides |
| Red | `#DC3232` | × eyes (error indicators) |
| Orange | `#E69632` | Smoke wisps |
| Green | `#3CC864` | Status LED (ironic green "on" light) |

**Animation:** Frame rate 2 fps, infinite repeat. Smoke wisps offset by 1 px between frames. Eyes stay fixed.

**Key details:**
- Server rack is a tall rectangle with horizontal panel lines (~3 rack units visible)
- Front panel has small indicator LEDs on the left side
- × marks for eyes are 2×2 px each, positioned on the front panel
- Smoke wisps emerge from the top of the rack (1–2 wavy pixels)

**File:** `assets/sprites/incidents/503_error.png`

---

## merge_conflict

**Visual Concept:** Two git branches (one purple, one green) approaching each other, colliding with sparks flying.

**Frames:** 3 (3-frame clash)

| Frame | Description |
|---|---|
| 0 | Two branch arrows approaching from opposite sides |
| 1 | Branches overlap at center; yellow spark flash |
| 2 | Collision complete; mixed purple/green blob with sparks radiating |

**Palette:**

| Color | Hex | Usage |
|---|---|---|
| Transparent | `#00000000` | Background |
| Outline | `#141414` | All borders |
| Purple | `#9650C8` | Left git branch |
| Green | `#3CC864` | Right git branch |
| Yellow | `#FFDC3C` | Spark/collision effect |
| White | `#F8F8F8` | Spark highlight |

**Animation:** Frame rate 3 fps, infinite repeat. The 3-frame sequence creates a looping "impact" feel: approach → collision → sparks → repeat.

**Key details:**
- Frame 0: Purple arrow pointing right from left side; green arrow pointing left from right side; ~4px gap between them
- Frame 1: Arrows overlap in center; 4 yellow spark pixels flash at contact point
- Frame 2: Mixed color blob at center; 8 spark pixels radiating diagonally outward

**File:** `assets/sprites/incidents/merge_conflict.png`

---

## failed_pipeline

**Visual Concept:** A broken pipe/tube (in two disconnected halves) leaking green data droplets.

**Frames:** 2 (2-frame drip)

| Frame | Description |
|---|---|
| 0 | Pipe halves separated; small data drop just forming at the break |
| 1 | Same pipe halves; data drop has fallen further; new drop forming |

**Palette:**

| Color | Hex | Usage |
|---|---|---|
| Transparent | `#00000000` | Background |
| Outline | `#141414` | All borders |
| Mid gray | `#8C8C96` | Pipe body |
| Dark gray | `#3C3C46` | Pipe shadow |
| Light gray | `#C8C8D2` | Pipe highlight |
| Green | `#3CC864` | Data drip |
| Teal | `#3CB4C8` | Data stream inside pipe |

**Animation:** Frame rate 2 fps, infinite repeat. The drip moves 3px down between frames. Creates a continuous "leaking data" effect.

**Key details:**
- Two rectangular pipe sections (~6×4 px each) positioned left-right with a 2px gap at center
- Each pipe has a 1px highlight along the top edge
- Data drip is 1–2 px wide, elongated teardrop shape
- Small teal dot inside the pipe openings to suggest data flow

**File:** `assets/sprites/incidents/failed_pipeline.png`
