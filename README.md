# PONSMINER ⛏️

> **GPU mining game on Robinhood Chain (4663)**  
> *Coming soon — silhouette landing with 3D-modeled GPUs*

Buy GPU cards with PAY tokens, earn PONS emissions. No fake signups, no points — honest Web3 mining simulation.

---

## Status

| State | Description |
|---|---|
| **Landing** | OPEN SOON silhouette scene with 3D-modeled GPU rigs, active |
| **Game** | Parked until token deployment — EIP-1193 wallet connect, GPU purchase, pool mining all coded |
| **Live** | [`tutugsvy.github.io/MAALEO`](https://tutugsvy.github.io/MAALEO/) |

---

## Tech Stack

- **React 18** — component-based UI
- **Vite 5** — fast build, HMR, code-split
- **CSS** — 3D transforms (`perspective`, `rotateX`, `rotateY`), `conic-gradient` fans, `radial-gradient` depth, custom properties for per-rig variation
- **EIP-1193** — injected wallet connection (`eth_requestAccounts`, `accountsChanged` listener)
- **localStorage** — per-wallet save/load
- **GitHub Pages** — `gh-pages` branch, `base: '/MAALEO/'`

---

## Project Structure

```
src/
├── App.jsx                  # Root — renders ComingSoon (landing) or game
├── main.jsx                 # Entry point
├── styles.css               # All styles (landing + game, ~26KB)
├── assets/
│   ├── logo-v2.jpg          # PONSMINER logo (monokrom P)
│   └── bg-shaft.jpg         # Background texture (game mode)
├── components/
│   ├── ComingSoon.jsx       # OPEN SOON landing — 3D GPU rigs, particles
│   ├── HUD.jsx              # Top bar: wallet, stats, title
│   ├── GPUPanel.jsx         # GPU card shop (game mode)
│   ├── Floor.jsx            # Facility floor (game mode)
│   ├── MachinePanel.jsx     # (legacy — replaced by GPUPanel)
│   ├── Shop.jsx             # Shop panel (game mode)
│   ├── ShiftBar.jsx         # Mining shift display (game mode)
│   └── Rules.jsx            # Game rules panel (game mode)
└── game/
    ├── config.js            # Constants: token addresses, treasury, rates
    ├── state.js             # Game state manager (save/load, per-wallet)
    ├── useGame.js           # React hook: wallet, mining, pool
    ├── wallet.js            # EIP-1193 wallet connect
    ├── rng.js               # Deterministic RNG (not in active use)
    └── sprite.js            # GPU canvas rendering (legacy — replaced by DOM/CSS)
```

---

## The 3D GPU Scene

The landing page renders 7 mining rigs with modeled 3D hardware:

```
┌─────────────────────────────────────────────────────────┐
│  🌌 Dark navy sky · stars twinkle · fog bands · embers  │
│                                                         │
│            PONSMINER · OPEN SOON badge                   │
│                                                         │
│  ╔══╗  ╔══╗  ╔══╗  ╔══╗  ╔══╗  ╔══╗  ╔══╗  ← 7 rigs   │
│  ║GPU║  ║GPU║  ║GPU║  ║GPU║  ║GPU║  ║GPU║  ║GPU║       │
│  ║ 3F║  ║ 2F║  ║ 3F║  ║ 2F║  ║ 3F║  ║ 2F║  ║ 3F║       │
│  ║  │  ║  │  ║  │  ║  │  ║  │  ║  │  ║  │  ║           │
│  ╚══╝  ╚══╝  ╚══╝  ╚══╝  ╚══╝  ╚══╝  ╚══╝              │
│  🔥 Horizon glow · gold rim light · dust particles       │
└─────────────────────────────────────────────────────────┘
```

### Rig Architecture (per rig)

Each rig is a 3D scene with `perspective: 900px`:

```
┌─── Rig Frame ──────────────────────────────────┐
│  ┌─── Top Rail ───┐                            │
│  ┌─────────────────┐  ← GPU card 1 (3D box)   │
│  │  █▓▓▓▓▓▓▓▓███  │     backplate ↑ above     │
│  │  ═══ LED ════   │     gold glow sweep       │
│  │  ○ ○ ○  ○ ○     │     3 fans (shroud + hub) │
│  │  ▒▒▒▒▒▒▒▒▒▒▒▒   │     shroud gradient       │
│  │  ░░░░░░░░░░░░   │     underside thickness    │
│  ├ bracket ────────┤                            │
│  ┌─────────────────┐  ← GPU card 2             │
│  │  ...             │                            │
│  ┌─────────────────┐  ← GPU card 3             │
│  └── PSU ──────────┘                            │
└══════════════════════════════════════════════════┘
```

### 3D Modeling Details

| Feature | CSS Technique |
|---|---|
| **Card volume** | Vertical gradient `#1c2436 → #0a0e18` + `inset` shadows for bevel |
| **Backplate** | `::before` strip above card, lighter color `#2d3852` |
| **Underside** | `::after` 4px bottom strip, dark `#04060c` |
| **Bracket** | Absolutely positioned left tab with gradient |
| **Fan shroud** | `radial-gradient` cylinder illusion + border ring |
| **Fan blades** | `conic-gradient` 9-blade, each blade: lighter leading edge + darker trailing → 3D curvature |
| **Fan hub** | `radial-gradient` sphere `#43506e → #171e2e` + `inset` highlight |
| **Rack frame** | `perspective` + `rotateX(14°)` + per-rig `rotateY(±8°)` |
| **Rim light** | `::after` strip with `rgba(255,194,74,0.3)` gradient |
| **Variation** | Even rigs: fans spin reversed at 1.6s (vs 1.1s) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

```bash
# Install
npm install

# Dev server (HMR at localhost:5173)
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Deploy to GitHub Pages

```bash
# 1. Build
npm run build

# 2. Set up gh-pages worktree
git worktree add /tmp/gh-pages gh-pages

# 3. Copy build
rm -rf /tmp/gh-pages/*
cp -r dist/* /tmp/gh-pages/
touch /tmp/gh-pages/.nojekyll

# 4. Commit + push
cd /tmp/gh-pages
git add -A
git commit -m "deploy: $(git log -1 --format='%s')"
git push origin gh-pages

# 5. Clean up
git worktree remove /tmp/gh-pages
```

> **Note:** The `vite.config.js` has `base: '/MAALEO/'` to match the repo name.  
> Enable GitHub Pages → Source: `gh-pages` branch, root `/`.

---

## Design System

### Colors

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#070a12` | Page background |
| `--bg2` | `#0b0f18` | Card background |
| `--text` | `#d4dce8` | Primary text |
| `--muted` | `#8494ab` | Secondary text |
| `--accent` | `#ffc24a` | Gold accent (LED, buttons) |
| `--accent2` | `#8fd3ff` | Cyan accent (secondary) |
| `--line` | `rgba(255,255,255,0.06)` | Borders |
| `--line2` | `rgba(255,255,255,0.12)` | Stronger borders |

### Typography

- **Press Start 2P** — pixel font (titles, badges)
- **Silkscreen** — pixel body font
- **JetBrains Mono** — monospace (stats, pills, footer)

### Layout

- Radius: `2px` (sharp)
- Nav/landing bg: `#0b0e15` with `backdrop-filter: blur(12px)`
- HUD: sticky top bar, glass-morphism

---

## Game Mechanics (when active)

### Economy

```
PAY token → Buy GPU (500,000 PAY) → TREASURY address
                                    ↓
                          Emission pool: 200 PONS/hour
                                    ↓
                    Split evenly among all GPU owners
```

### Rules

- **GPU purchase**: 500,000 PAY per card → sent to TREASURY
- **Max**: 10 GPUs per wallet
- **Mining rate**: 200 PONS / hour ÷ total GPUs owned across all wallets
- **Accrual**: Every 1 minute, add `(rate / 60)` to balance
- **Wallet required**: EIP-1193 injected wallet (MetaMask, Rabby, etc.)
- **Per-wallet save**: Each address has independent save in localStorage

### Tokenomics

| Token | Role | Address |
|---|---|---|
| PAY | Purchase GPU | *Placeholder — set in `config.js`* |
| PONS | Mining reward | [`0x39dBED3a2bd333467115dE45665cC57F813C4571`](https://robinhoodchain.blockscout.com/token/0x39dBED3a2bd333467115dE45665cC57F813C4571) — live on Robinhood Chain ✓ |
| TREASURY | Payment receiver | *Placeholder — set in `config.js`* |

---

## Configuration

Edit `src/game/config.js`:

```js
// ─── TOKEN & TREASURY (the token you deploy later) ───
export const TOKEN = {
  symbol: 'PONS',
  name: 'Pons',
  decimals: 18,
  supply: 1_000_000_000,   // 1B fixed supply
  poolPerHour: 200,        // 200 PONS/hour split among ALL GPU owners
};

export const PAY_TOKEN = {
  symbol: 'PAY',               // ← ganti jadi simbol token lo
  name: 'Payment Token',
  decimals: 18,
  contractAddress: null,       // ← isi CA token setelah deploy
};

export const TREASURY = '0x0000…';  // ← isi address penampung

// ─── GPU ECONOMY ───
export const GPU_COST = 500_000;   // 500k PAY per GPU
export const POOL_PER_HOUR = 200;  // PONS/hour shared pool
export const MAX_GPU_PER_WALLET = 10;
export const TICK_SECONDS = 60;    // accrual every minute
```

---

## Roadmap

- [x] EIP-1193 wallet connect (real injected wallet)
- [x] 3D-modeled GPU rig landing scene
- [x] GPU purchase + per-wallet save
- [x] Pool mining (200 PONS/hour ÷ total GPU)
- [x] Design system: Stock Miners-inspired pixel theme
- [ ] Deploy PAY token
- [ ] Activate game UI (flip landing → game mode)
- [ ] Token staking / treasury dashboard
- [ ] Leaderboard / top miners

---

## Deployment History

| Date | Commit | Description |
|---|---|---|
| Aug 25 | `aadc270` | GPU 3D modeled: beveled shroud, backplate, 3D fans, tilted rack |
| Aug 25 | `80f94ac` | Landing OPEN SOON silhouette: rigs, atmosphere, particles |
| Aug 25 | `740ed49` | Stock Miners design system: pixel fonts, navy/gold palette |
| Aug 25 | `805ced5` | DOM/CSS 3D GPU cards (conic-gradient fans, LED strip, shroud) |
| Aug 25 | `6382175` | Real EIP-1193 wallet connect, per-wallet save |
| Aug 25 | `89bb677` | HUD logo + favicon |
| Aug 25 | `194cc6e` | GPU mining shared pool (buy GPU → earn PONS) |

---

*Built with Hermes Agent · Nous Research*