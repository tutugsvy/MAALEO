// ─── PONSMINER · minimal RPC + ABI helpers (no ethers dep) ─────────────────
// Reads on-chain state from Robinhood Chain RPC. Fee sharing is native to the
// ponsfamily launchpad — the frontend only needs token reads (balance/supply).

const RPC = 'https://rpc.mainnet.chain.robinhood.com';

// 4-byte selectors (keccak first 4 bytes)
const SEL = {
  balanceOf: '0x70a08231',
  totalSupply: '0x18160ddd',
};

async function rpc(method, params) {
  const res = await fetch(RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const j = await res.json();
  if (j.error) throw new Error(j.error.message);
  return j.result;
}

const pad = (s, n = 64) => s.replace(/^0x/, '').padStart(n, '0');

// Token reads
export async function tokenBalance(token, addr) {
  const r = await rpc('eth_call', [{ to: token, data: SEL.balanceOf + pad(addr) }, 'latest']);
  return BigInt(r);
}

export async function tokenTotalSupply(token) {
  const r = await rpc('eth_call', [{ to: token, data: SEL.totalSupply }, 'latest']);
  return BigInt(r);
}

// Format BigInt with decimals → trimmed string
export function fmtBig(v, decimals = 18, maxFrac = 4) {
  const s = v.toString().padStart(decimals + 1, '0');
  const int = s.slice(0, -decimals) || '0';
  const frac = s.slice(-decimals).slice(0, maxFrac);
  return `${Number(int).toLocaleString('en-US')}.${frac}`;
}