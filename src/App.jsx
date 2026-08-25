// ─── PONSMINER · App — main layout, GPU mining orchestrator ────────────────
import { useState, useCallback, useEffect } from 'react';
import { GPU_COST, MAX_GPU_PER_WALLET, PAY_TOKEN, TOKEN, TREASURY } from './game/config.js';
import { buyGPU, connectWallet, disconnectWallet, freshSave } from './game/state.js';
import { connectInjected, onAccountsChanged, connectErrorMessage } from './game/wallet.js';
import { useGame } from './game/useGame.js';
import HUD from './components/HUD.jsx';
import Floor from './components/Floor.jsx';
import GPUPanel from './components/GPUPanel.jsx';
import Shop from './components/Shop.jsx';
import Rules from './components/Rules.jsx';

export default function App() {
  const { state, dispatch, getState } = useGame();
  const [selectedId, setSelectedId] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // live sync: user switches account / disconnects inside their wallet.
  // Re-subscribe whenever an injected provider appears (wallets can be
  // installed/loaded after the page opened).
  const [hasEth, setHasEth] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => setHasEth(!!window.ethereum), 1200);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    if (!hasEth) return;
    const off = onAccountsChanged((account) => {
      const s = getState();
      if (account === s.wallet) return; // no-op
      const ns = account ? connectWallet(s, account) : disconnectWallet(s);
      dispatch({ type: 'LOAD', save: ns });
      showToast(account ? `Akun diganti: ${account.slice(0, 6)}…${account.slice(-4)}` : 'Wallet di-disconnect dari provider');
    });
    return off;
  }, [hasEth, getState, dispatch, showToast]);

  const selected = state.gpus.find(g => g.id === selectedId) || null;

  const handleAction = useCallback(async (type, ...args) => {
    let s = getState();
    switch (type) {
      case 'connect': {
        // REAL injected wallet (MetaMask / Rabby / Brave …)
        try {
          const addr = await connectInjected();
          if (!addr) { showToast('Wallet tidak mengembalikan address.'); return; }
          const ns = connectWallet(s, addr);
          dispatch({ type: 'LOAD', save: ns });
          showToast(`Terkoneksi: ${addr.slice(0, 6)}…${addr.slice(-4)}`);
        } catch (e) {
          showToast(connectErrorMessage(e));
        }
        break;
      }
      case 'disconnect': {
        const ns = disconnectWallet(s);
        dispatch({ type: 'LOAD', save: ns });
        showToast('Disconnected (session lokal dibersihkan)');
        break;
      }
      case 'buy-gpu': {
        if (!s.wallet) { showToast('Konek wallet dulu sebelum beli GPU'); return; }
        const ns = buyGPU(s, Date.now());
        if (ns === s) { showToast('Token kurang atau max GPU (10)'); return; }
        dispatch({ type: 'LOAD', save: ns });
        showToast(`GPU terbeli! Pool: ${TOKEN.poolPerHour} PONS/h ÷ ${ns.totalGpuCount} GPU`);
        break;
      }
      case 'open-shop': setShowShop(true); break;
      case 'open-rules': setShowRules(true); break;
      case 'reset': {
        if (window.confirm('Wipe save dan mulai lagi?')) {
          dispatch({ type: 'RESET' });
          setSelectedId(null);
          showToast('Save dihapus');
        }
        break;
      }
      default: break;
    }
  }, [getState, dispatch, showToast]);

  return (
    <div className="app">
      <div className="bg-layer" />
      <div className="bg-particles" />

      <HUD state={state} onAction={handleAction} />

      <main className="main">
        <div className="main-left">
          <Floor
            state={state}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="main-right">
          <GPUPanel
            gpu={selected}
            state={state}
            onAction={handleAction}
          />
        </div>
      </main>

      {showShop && <Shop state={state} onAction={handleAction} onClose={() => setShowShop(false)} />}
      {showRules && <Rules onClose={() => setShowRules(false)} />}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
