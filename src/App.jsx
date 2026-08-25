// ─── PONSMINER · App — main layout, GPU mining orchestrator ────────────────
import { useState, useCallback } from 'react';
import { GPU_COST, MAX_GPU_PER_WALLET, PAY_TOKEN, TOKEN, TREASURY } from './game/config.js';
import { buyGPU, connectWallet, freshSave } from './game/state.js';
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
    setTimeout(() => setToast(null), 2500);
  }, []);

  const selected = state.gpus.find(g => g.id === selectedId) || null;

  const handleAction = useCallback((type, ...args) => {
    let s = getState();
    switch (type) {
      case 'connect': {
        // play-prototype: simulate wallet connect (injected address)
        const addr = '0x' + Array(40).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
        const ns = connectWallet(s, addr);
        dispatch({ type: 'LOAD', save: ns });
        showToast('Wallet connected (prototype)');
        break;
      }
      case 'disconnect': {
        const ns = { ...s, wallet: null };
        dispatch({ type: 'LOAD', save: ns });
        showToast('Disconnected');
        break;
      }
      case 'buy-gpu': {
        const ns = buyGPU(s, Date.now());
        if (ns === s) { showToast('Not enough tokens or max GPU'); return; }
        dispatch({ type: 'LOAD', save: ns });
        showToast(`GPU bought! Pool rate: ${TOKEN.poolPerHour} PONS/h ÷ ${ns.totalGpuCount}`);
        break;
      }
      case 'open-shop': setShowShop(true); break;
      case 'open-rules': setShowRules(true); break;
      case 'reset': {
        if (window.confirm('Wipe save and start fresh?')) {
          dispatch({ type: 'RESET' });
          setSelectedId(null);
          showToast('Save wiped');
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