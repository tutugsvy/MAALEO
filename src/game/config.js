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

// ─── GPU ECONOMY ────────────────────────────────────────────────────────────
export const GPU_COST = 500_000;         // 500k PAY tokens per GPU
export const POOL_PER_HOUR = 200;        // 200 PONS/hour total pool (shared)
export const MAX_GPU_PER_WALLET = 10;
export const TICK_SECONDS = 60;          // miner accrues every minute

// ─── GPU MODELS (cosmetic tiers — each GPU mines the same shared pool) ─────
export const GPU_MODELS = [
  { id: 'RTX4080', label: 'RTX 4080',  fans: 3, power: 1.0, color: '#2b3542', edge: '#9aa7b8' },
  { id: 'RTX4090', label: 'RTX 4090',  fans: 3, power: 1.0, color: '#3b1f52', edge: '#b06cff' },
  { id: 'A100',    label: 'A100',      fans: 2, power: 1.0, color: '#14301c', edge: '#7ee787' },
  { id: 'H100',    label: 'H100',      fans: 2, power: 1.0, color: '#1a2a3a', edge: '#8fd3ff' },
  { id: 'B200',    label: 'B200',      fans: 3, power: 1.0, color: '#3a2a10', edge: '#ffd257' },
];

// ─── PLAY MONEY (prototype) ────────────────────────────────────────────────
export const FUEL_PLAY = 600_000;       // play PAY tokens on new save
export const SETTLE_SECONDS = 60;       // accrual tick

export const SAVE_KEY = 'ponsminer_gpu_v1';
