// ─── PONSMINER · core config ───────────────────────────────────────────────
// Everything tunable lives here. The game reads these constants only.

// ─── TOKEN & TREASURY (the token you deploy later) ──────────────────────────
export const TOKEN = {
  symbol: 'PONS',
  name: 'Pons',
  decimals: 18,
  supply: 1_000_000_000,        // 1B, fixed-supply launchpad pattern
  contractAddress: '0x39dBED3a2bd333467115dE45665cC57F813C4571', // live on Robinhood Chain ✓
  // Where the CA link points. Kosongkan → otomatis ke explorer.
  launchpadUrl: 'https://www.ponsfamily.com/launchpad/0x39dBED3a2bd333467115dE45665cC57F813C4571',
  // Determined emission: the whole pool pays this per hour, split by GPU count.
  poolPerHour: 200,             // 200 PONS/hour divided among ALL GPU owners
};

// Payment token details — NOT deployed yet; game runs on play PAY for now.
export const PAY_TOKEN = {
  symbol: 'PAY',                // ← change to your deployed token symbol
  name: 'Payment Token',
  decimals: 18,
  contractAddress: null,        // ← fill after token deploy
};

// Treasury address — collects all GPU purchase payments
export const TREASURY = '0x0000000000000000000000000000000000000000'; // ← fill with treasury address

// ─── STOCK TICKERS (dividend pool — tokenized stock on RH) ────────────────
// Dashboard ticker tape. Live prices via Chainlink once P1 reads are wired.
export const STOCK_TICKERS = [
  { symbol: 'NVDA',  token: '0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec' },
  { symbol: 'COIN',  token: '0x6330d8c3178a418788df01a47479c0ce7ccf450b' },
  { symbol: 'MSFT',  token: '0xe93237c50d904957cf27e7b1133b510c669c2e74' },
  { symbol: 'GOOGL', token: '0x2e0847e8910a9732eb3fb1bb4b70a580adad4fe3' },
  { symbol: 'AAPL',  token: '0xaf3d76f1834a1d425780943c99ea8a608f8a93f9' },
  { symbol: 'SPCX',  token: '0x4a0e65a3eccec6dbe60ae065f2e7bb85fae35eea' },
];

// Dividend pool (P1). Fill poolContract after RewardDistributor deploys.
export const DIVIDEND_STATUS = {
  poolContract: null,        // ← fill with RewardDistributor address after deploy
  poolPons: 0,               // PONS in pool (read live from contract once deployed)
  poolStocks: [],            // [{symbol, amount}] stock in pool
};
export const TARGET_CHAIN_ID = 4663;         // Robinhood Chain
export const NETWORK_NAME = 'Robinhood Chain';
export const EXPLORER_URL = 'https://robinhoodchain.blockscout.com';

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
