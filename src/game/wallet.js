// ─── PONSMINER · wallet.js — real EIP-1193 injected wallet helpers ──────────
// Connects to whatever injected provider the user has (MetaMask, Rabby, Brave,
// WalletConnect bridge, etc.) via eth_requestAccounts. No demo, no fake address.

export function hasInjectedWallet() {
  return typeof window !== 'undefined' && !!window.ethereum;
}

export function injectedProvider() {
  return typeof window !== 'undefined' ? window.ethereum : null;
}

// Returns the connected account (checksummed as returned by provider) or null.
export async function connectInjected() {
  const eth = injectedProvider();
  if (!eth) throw { code: 'NO_INJECTED', message: 'No injected wallet found' };
  if (!eth.request) throw { code: 'NO_PROVIDER_API', message: 'Provider has no request() API' };
  const accounts = await eth.request({ method: 'eth_requestAccounts' });
  return accounts && accounts.length ? accounts[0] : null;
}

// Snapshot of chainId + network name for the badge.
export function getChainInfo() {
  const eth = injectedProvider();
  if (!eth || !eth.chainId) return { chainId: null, name: 'unknown network' };
  const chainId = typeof eth.chainId === 'string' ? parseInt(eth.chainId, 16) : eth.chainId;
  return { chainId, name: chainName(chainId) };
}

export function chainName(id) {
  const map = {
    4663: 'Robinhood Chain',
    1: 'Ethereum',
    8453: 'Base',
    42161: 'Arbitrum',
    137: 'Polygon',
    56: 'BNB Chain',
  };
  return map[id] || `Chain ${id}`;
}

// Subscribe to account changes (e.g. user switches account in wallet).
// Returns an unsubscribe function.
export function onAccountsChanged(cb) {
  const eth = injectedProvider();
  if (!eth || !eth.on) return () => {};
  const handler = (accounts) => cb(accounts && accounts.length ? accounts[0] : null);
  eth.on('accountsChanged', handler);
  return () => { try { eth.removeListener('accountsChanged', handler); } catch {} };
}

// Subscribe to chain changes.
export function onChainChanged(cb) {
  const eth = injectedProvider();
  if (!eth || !eth.on) return () => {};
  const handler = (chainIdHex) => cb(chainIdHex);
  eth.on('chainChanged', handler);
  return () => { try { eth.removeListener('chainChanged', handler); } catch {} };
}

// Human message for common connect failures.
export function connectErrorMessage(e) {
  if (!e) return 'Connect gagal';
  if (e.code === 4001 || e.code === -32002) {
    return e.code === 4001
      ? 'Koneksi ditolak di wallet kamu'
      : 'Ada request pending di wallet — buka wallet kamu dan approve.';
  }
  if (e.code === 'NO_INJECTED') return 'Tidak ada injected wallet. Install MetaMask/Rabby dulu, lalu refresh.';
  if (e.code === 'NO_PROVIDER_API') return 'Wallet kamu tidak support eth_requestAccounts.';
  return `Connect gagal: ${e.message || e.code || 'unknown'}`;
}
