# UI Design — Death Star Planning Poker

## Theme

**Imperial Death Star.** The UI evokes the control rooms and targeting displays of the Death Star — cold, authoritarian, dimly lit with the occasional green targeting reticle. Every interaction feels like an Imperial operation briefing.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-void` | `#050505` | Page background — the void of space |
| `--bg-surface` | `#111111` | Panels, modals, card backs |
| `--bg-elevated` | `#1c1c1c` | Cards, inputs, list items |
| `--border-dim` | `#2e2e2e` | Subtle dividers and card borders |
| `--border-active` | `#4a4a4a` | Hovered / focused borders |
| `--text-primary` | `#d4d4d4` | Main body text |
| `--text-secondary` | `#6b6b6b` | Placeholders, labels, secondary info |
| `--text-bright` | `#f0f0f0` | Headings, card values |
| `--imperial-red` | `#9b1c1c` | Host-only controls (Reveal, Reset) |
| `--imperial-red-hover` | `#c02626` | Hover state for host controls |
| `--targeting-green` | `#22c55e` | "Has voted" indicators, success states |
| `--targeting-green-glow` | `rgba(34,197,94,0.25)` | Glow around voted cards |
| `--laser-green` | `#4ade80` | Death Star laser / unanimous celebration accent |
| `--warning-amber` | `#b45309` | Inline error messages |

---

## Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Room title / headings | `"Orbitron", monospace` | 700 | 1.5rem–2rem |
| Card values | `"Orbitron", monospace` | 700 | 2rem–3rem |
| Body / names | `"Inter", system-ui, sans-serif` | 400 | 0.9rem–1rem |
| Error / status text | `"Inter", system-ui, sans-serif` | 500 (italic) | 0.85rem |

> Orbitron (Google Fonts) has a mechanical, Imperial readout quality. Fall back to any monospace if unavailable.

---

## Card Deck

The deck follows standard Fibonacci planning poker. Special symbol cards are replaced with Star Wars references. Cards are portrait-oriented, roughly credit-card shaped (64px × 96px base, scales up when selectable).

| Position | Value sent to server | Face label | Flavour |
|---|---|---|---|
| 1 | `"0"` | **0** | — |
| 2 | `"1"` | **I** | — |
| 3 | `"2"` | **II** | — |
| 4 | `"3"` | **III** | — |
| 5 | `"5"` | **V** | — |
| 6 | `"8"` | **VIII** | — |
| 7 | `"13"` | **XIII** | — |
| 8 | `"?"` | ☠ **"Bad Feeling"** | *"I have a bad feeling about this."* — replaces the ? / unsure card |
| 9 | `"☕"` | ☕ **"Jawa Juice"** | *"This calls for Jawa Juice."* — replaces the coffee / break card |
| 10 | `"∞"` | 🌑 **Death Star** | Too large to estimate. Features a Death Star graphic. |

### Card Visual States

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│              │   │  ░░░░░░░░░░  │   │              │
│              │   │  ░░░░░░░░░░  │   │      5       │
│   [BACK]     │   │  ░░░░░░░░░░  │   │              │
│  ─────────── │   │  ░░░░░░░░░░  │   │   ★ VOTED ★  │
│  ░░░░░░░░░░  │   │  ░░░░░░░░░░  │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
  Unselected         Selected            Revealed
  (default)          (green border       (value shown,
                     + glow)             read-only)
```

**Unselected:** Dark gray background (`--bg-elevated`), dim border, large value in `--text-bright`.

**Selected / voted:** Same card with a `--targeting-green` border (2px solid) and `--targeting-green-glow` box shadow. A subtle scale transform (`scale(1.06)`) lifts the card.

**Revealed:** Cards flip face-up (CSS 3D flip animation, ~400ms). Value is shown in full size. Cards belonging to other users display in a results row.

**Disabled (post-reveal):** Reduced opacity (`0.4`), `cursor: not-allowed`, no hover effect.

### Death Star Card Design

The Death Star card uses an SVG of the Death Star silhouette (circle with the equatorial trench line and superlaser dish indent) rendered in `--border-dim` / `--text-secondary` tones on the card face, with a tiny `--laser-green` dot at the dish. Label beneath: `∞` in small caps.

### "Bad Feeling" Card

Dark card face with a skull/warning glyph and the label **"Bad Feeling"** in two lines. Subtext in tiny italics: *I have a bad feeling about this.*

### "Jawa Juice" Card

Coffee cup icon (Unicode ☕) with **"Jawa Juice"** label. Subtext: *This calls for a break.*

---

## Screens

### 1. Landing / Join Screen

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│            ░░░░░░░░  DEATH STAR  ░░░░░░░░           │
│                   PLANNING POKER                    │
│                                                     │
│         ┌─────────────────────────────┐             │
│         │  Enter your callsign...     │             │
│         └─────────────────────────────┘             │
│                                                     │
│         [ INITIATE NEW SESSION  ▶ ]                 │
│                                                     │
│         ─────── or join existing ───────            │
│                                                     │
│         Room ID from URL auto-populated             │
│         [ JOIN BRIEFING  ▶ ]                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Full-bleed `--bg-void` background with a faint star-field (CSS box-shadow dots or SVG).
- A faint Death Star wireframe watermark, low-opacity, centered behind the form.
- The title uses `Orbitron` bold, tracked out, in `--text-bright`.
- Input has a dark background, `--border-dim` border, focuses to `--border-active`.
- CTA button: dark gray with `--imperial-red` left-border accent; hover fills to `--imperial-red`.

---

### 2. Voting Room

```
┌──────────────────────────────────────────────────────────┐
│  ☽  DEATH STAR POKER         Room: xk29-4plm  [copy]    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────┐  ┌─────────────┐  │
│  │  PERSONNEL                       │  │  MISSION    │  │
│  │                                  │  │  STATUS     │  │
│  │  ● Alice (HOST)     ✔ voted      │  │             │  │
│  │  ● Bob              ✔ voted      │  │  Waiting    │  │
│  │  ● Carol            ○ thinking…  │  │  for all    │  │
│  │                                  │  │  votes      │  │
│  └──────────────────────────────────┘  └─────────────┘  │
│                                                          │
│  ─────────────────── YOUR VOTE ──────────────────────    │
│                                                          │
│  ┌──┐ ┌──┐ ┌───┐ ┌───┐ ┌──┐ ┌────┐ ┌────┐ ┌─────┐ ┌───┐ ┌──┐│
│  │ 0│ │ I│ │ II│ │III│ │ V│ │VIII│ │XIII│ │ ☠  │ │ ☕ │ │🌑││
│  └──┘ └──┘ └───┘ └───┘ └──┘ └────┘ └────┘ └─────┘ └───┘ └──┘│
│                                                          │
│  [HOST ONLY]          [ REVEAL VOTES ]  [ RESET ]        │
└──────────────────────────────────────────────────────────┘
```

**Participant list:**
- Each entry shows display name + a targeting-green checkmark (✔) if voted, or a dimmed "○ thinking…" if not.
- HOST badge next to the host's name (small `--imperial-red` label).
- Updates in real-time; disconnected users fade out and are removed.

**Card tray:**
- Horizontal scrollable row of cards.
- Selected card gets the green glow treatment.
- Post-reveal: cards are dimmed and non-interactive.

**Host controls (Reveal / Reset):**
- Only rendered for the host.
- `REVEAL VOTES` — `--imperial-red` background, white text, uppercase Orbitron.
- `RESET` — outlined variant with `--imperial-red` border; less prominent.
- Non-host users see neither button.

---

### 3. Revealed State

```
┌──────────────────────────────────────────────────────────┐
│  VOTES REVEALED                                          │
│                                                          │
│  Alice    ┌───┐    Bob     ┌───┐    Carol   ┌───┐        │
│  (HOST)   │ 5 │            │ 8 │            │ 5 │        │
│           └───┘            └───┘            └───┘        │
│                                                          │
│  Average: 6.0   │  Spread: 3   │  Mode: 5               │
│                                                          │
│  [HOST ONLY]                            [ RESET ROUND ]  │
└──────────────────────────────────────────────────────────┘
```

- Cards flip with a CSS 3D rotation to reveal the value.
- A summary bar shows **Average**, **Spread** (max − min), and **Mode** — computed client-side.
- Reset button returns to voting state.

---

### 4. Unanimous Vote — "I Love Democracy"

Triggered client-side when `revealed === true`, all users voted, all values identical.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│            ⬡  ORDER ACHIEVED  ⬡                            │
│                                                             │
│          [ Emperor Palpatine image ]                        │
│                                                             │
│      "I love democracy."                                    │
│                                                             │
│       Everyone voted  ·  All agreed on  ·  8               │
│                                                             │
│                          [ Dismiss ]                        │
└─────────────────────────────────────────────────────────────┘
```

- Full-screen overlay (`--bg-void` at 90% opacity) with a centered modal.
- `--laser-green` glow pulses around the border.
- Dismissible by clicking outside or the Dismiss button.
- Does not alter game state.

---

### 5. Error Toast

```
╔══════════════════════════════════════╗
║  ⚠  Only the host can reveal votes  ║
╚══════════════════════════════════════╝
```

- Fixed bottom-right toast, `--bg-elevated` background, `--warning-amber` left border.
- Auto-dismisses after 4 seconds. Stackable.
- Does not disconnect the session.

---

## Responsive Behaviour

| Viewport | Card tray | Participant list |
|---|---|---|
| Desktop (≥ 1024px) | Side-by-side row | Sidebar column |
| Tablet (768–1023px) | Wrapped grid | Above card tray |
| Mobile (< 768px) | 2-row scrollable grid | Collapsible drawer |

---

## Motion & Micro-interactions

| Interaction | Animation |
|---|---|
| Card select | `scale(1.06)` + green glow, 150ms ease-out |
| Card reveal | CSS 3D Y-axis flip, 400ms ease-in-out |
| Participant join | Fade-in slide from left, 200ms |
| Participant leave | Fade-out, 300ms |
| Toast appear | Slide up from bottom, 200ms |
| Unanimous overlay | Fade-in + scale from 0.9→1, 300ms |

Respect `prefers-reduced-motion`: replace all transitions with instant opacity changes.

---

## Assets Required

| Asset | Format | Notes |
|---|---|---|
| Death Star SVG | SVG | Card face + watermark; two sizes |
| Star-field background | CSS / SVG | Box-shadow dots or subtle SVG pattern |
| Emperor Palpatine image | JPG/PNG/WebP | Unanimous easter egg only |
| Favicon | ICO / SVG | Death Star silhouette |
