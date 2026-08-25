// ─── PONSMINER · core config ───────────────────────────────────────────────
// Everything tunable lives here. The game reads these constants only.

// ─── TOKEN & TREASURY (the token you deploy later) ──────────────────────────
export const TOKEN = {
  symbol: 'PONS',
  name: 'Pons',
  decimals: 18,
  supply: 1_000_000_000,        // 1B, fixed-supply launchpad pattern
  // Determined emission: the whole pool pays this per hour, split by GPU count.
  poolPerHour: 200,             // 200 PONS/hour divided among ALL GPU owners
};

// Payment token details (token will be deployed by the user later — CA placeholder)
export const PAY_TOKEN = {
  symbol: 'PAY',                // ← ganti jadi simbol token yang lo deploy nanti
  name: 'Payment Token',
  decimals: 18,
  contractAddress: null,        // ← isi CA token setelah deploy
};

// Treasury address — collects all GPU purchase payments
export const TREASURY = '0x0000000000000000000000000000000000000000'; // ← isi address penampung

// ─── CHAIN ──────────────────────────────────────────────────────────────────
export const TARGET_CHAIN_ID = 4663;         // Robinhood Chain
export const NETWORK_NAME = 'Robinhood Chain';

// ─── GPU ECONOMY ────────────────────────────────────────────────────────────
export const GPU_COST = 500_000;         // 500k PAY tokens per GPU
export const POOL_PER_HOUR = 200;        // 200 PONS/hour total pool (shared)
export const MAX_GPU_PER_WALLET = 10;
export const TICK_SECONDS = 60;          // miner accrues every minute

// ─── GPU MODELS (cosmetic tiers — each GPU mines the same shared pool) ─────
// Dark card body + glowing LED strip (accent) + white fans. Style reference:
// GPU promo render — NOT a copy, original procedural art.
export const GPU_MODELS = [
  { id: 'RTX4080', label: 'RTX 4080',  fans: 3, power: 1.0, color: '#23272e', edge: '#9aa7b8', accent: '#ff5c4d', led: '#2b0f0b' },
  { id: 'RTX4090', label: 'RTX 4090',  fans: 3, power: 1.0, color: '#241f2e', edge: '#b9a4d8', accent: '#b06cff', led: '#1e0f33' },
  { id: 'A100',    label: 'A100',      fans: 2, power: 1.0, color: '#16221c', edge: '#7ee787', accent: '#3ddc84', led: '#0a2415' },
  { id: 'H100',    label: 'H100',      fans: 2, power: 1.0, color: '#14202c', edge: '#8fd3ff', accent: '#38bdf8', led: '#082032' },
  { id: 'B200',    label: 'B200',      fans: 3, power: 1.0, color: '#2c2413', edge: '#ffd257', accent: '#ffb020', led: '#2b1a05' },
];

// ─── PLAY MONEY (prototype) ────────────────────────────────────────────────
export const FUEL_PLAY = 600_000;       // play PAY tokens on new save
export const SETTLE_SECONDS = 60;       // accrual tick

export const SAVE_KEY = 'ponsminer_gpu_v1';
