// ─── PONSMINER · minimal RPC + ABI helpers (no ethers dep) ─────────────────
// Reads on-chain state from Robinhood Chain RPC. Signed transactions via
// the injected wallet provider (EIP-1193).

const RPC = 'https://rpc.mainnet.chain.robinhood.com';

// 4-byte selectors (keccak first 4 bytes)
const SEL = {
  balanceOf: '0x70a08231',
  totalSupply: '0x18160ddd',
  claim: '0x4e71d92d',
  pendingReward: '0x9ced7e76',   // pendingReward(address,address)
  poolBalance: '0x68abb5e0',     // poolBalance(address)
  rewardTokensLength: '0xbf199e62',
  rewardTokens: '0x7bb7bed1',    // rewardTokens(uint256)
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

// Pending reward for a user for a specific reward token
export async function pendingReward(poolContract, user, rewardToken) {
  const data = SEL.pendingReward + pad(user) + pad(rewardToken);
  const r = await rpc('eth_call', [{ to: poolContract, data }, 'latest']);
  return BigInt(r);
}

// Pool balance of a specific reward token
export async function poolBalance(poolContract, rewardToken) {
  const data = SEL.poolBalance + pad(rewardToken);
  const r = await rpc('eth_call', [{ to: poolContract, data }, 'latest']);
  return BigInt(r);
}

// Format BigInt with decimals → trimmed string
export function fmtBig(v, decimals = 18, maxFrac = 4) {
  const s = v.toString().padStart(decimals + 1, '0');
  const int = s.slice(0, -decimals) || '0';
  const frac = s.slice(-decimals).slice(0, maxFrac);
  return `${Number(int).toLocaleString('en-US')}.${frac}`;
}

// Send claim() through the injected wallet — real transaction
export async function sendClaim(provider, poolContract) {
  if (!provider || !provider.request) throw new Error('No wallet');
  return provider.request({
    method: 'eth_sendTransaction',
    params: [{ to: poolContract, data: SEL.claim }],
  });
}