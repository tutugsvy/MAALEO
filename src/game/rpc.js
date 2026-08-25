// ─── PONSMINER · minimal RPC read helper (no ethers dep) ───────────────────
// Reads on-chain state straight from the Robinhood Chain RPC so the
// dashboard shows real numbers, not placeholders.

const RPC = 'https://rpc.mainnet.chain.robinhood.com';

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

// keccak4 selectors
const SEL = {
  balanceOf: '0x70a08231',
  totalSupply: '0x18160ddd',
  claim: '0x4e71d92d',
};

export async function tokenBalance(token, addr) {
  const r = await rpc('eth_call', [{ to: token, data: SEL.balanceOf + pad(addr) }, 'latest']);
  return BigInt(r);
}

export async function tokenTotalSupply(token) {
  const r = await rpc('eth_call', [{ to: token, data: SEL.totalSupply }, 'latest']);
  return BigInt(r);
}

// format BigInt with decimals → trimmed string
export function fmtBig(v, decimals = 18, maxFrac = 4) {
  const s = v.toString().padStart(decimals + 1, '0');
  const int = s.slice(0, -decimals) || '0';
  const frac = s.slice(-decimals).slice(0, maxFrac);
  return `${Number(int).toLocaleString('en-US')}.${frac}`;
}

// send claim() through the injected wallet — real transaction
export async function sendClaim(provider, poolContract) {
  if (!provider || !provider.request) throw new Error('No wallet');
  return provider.request({
    method: 'eth_sendTransaction',
    params: [{ to: poolContract, data: SEL.claim }],
  });
}