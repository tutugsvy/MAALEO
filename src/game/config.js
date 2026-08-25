// ─── PONSMINER · core config ───────────────────────────────────────────────
// Everything tunable lives here. The game reads these constants only.

// ─── PONSMINER TOKEN (yang di-hold — launch di ponsfamily) ─────────────────
export const TOKEN = {
  symbol: 'PONSMINER',
  name: 'PONSMINER',
  decimals: 18,
  supply: 1_000_000_000,        // 1B, fixed-supply launchpad pattern
  contractAddress: '0xBDc8cF326abE70C6020d2D2E81D8619198224E1b',
  // Launchpad page for this exact token.
  launchpadUrl: 'https://www.ponsfamily.com/launchpad/0xBDc8cF326abE70C6020d2D2E81D8619198224E1b',
};

// ─── FEE SHARING (ponsfamily native — no custom contract) ──────────────────
// ponsfamily launchpad has "Share fees with holders" enabled for PONSMINER:
// 100% of the creator fee is distributed to holders pro-rata and pushed
// straight to their wallets. Permanent — the distributor cannot hand the role
// back. No claim needed, no keeper, no custom contract.
export const FEE_SHARE = {
  enabled: true,
  mode: 'native',               // ponsfamily launchpad distributor
  creatorCut: '100%',           // of the creator fee → holders
  rewards: 'PONSMINER + WETH',  // fee tokens (paid in both sides of the swap)
  distribution: 'automatic',    // pushed to wallets, no claim needed
  permanence: 'permanent',      // cannot be revoked
};

export const TARGET_CHAIN_ID = 4663;         // Robinhood Chain
export const NETWORK_NAME = 'Robinhood Chain';
export const EXPLORER_URL = 'https://robinhoodchain.blockscout.com';

// ─── STOCK TICKERS (dashboard ticker tape — display only) ──────────────────
// Kept for the market-tape aesthetic. Fees are shared as PONSMINER + WETH,
// these tickers are NOT the reward tokens anymore.
export const STOCK_TICKERS = [
  { symbol: 'NVDA',  token: '0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec' },
  { symbol: 'COIN',  token: '0x6330d8c3178a418788df01a47479c0ce7ccf450b' },
  { symbol: 'MSFT',  token: '0xe93237c50d904957cf27e7b1133b510c669c2e74' },
  { symbol: 'GOOGL', token: '0x2e0847e8910a9732eb3fb1bb4b70a580adad4fe3' },
  { symbol: 'AAPL',  token: '0xaf3d76f1834a1d425780943c99ea8a608f8a93f9' },
  { symbol: 'SPCX',  token: '0x4a0e65a3eccec6dbe60ae065f2e7bb85fae35eea' },
];
