// ─── PONSMINER · App — main layout, state orchestrator ─────────────────────
import { useState, useCallback } from 'react';
import { SHIFTS, SHIFT_COST } from './game/config.js';
import { buyShift, buyMachine, placeMachine, digBay, mergeMachines, freshSave } from './game/state.js';
import { useGame } from './game/useGame.js';
import HUD from './components/HUD.jsx';
import Floor from './components/Floor.jsx';
import MachinePanel from './components/MachinePanel.jsx';
import ShiftBar from './components/ShiftBar.jsx';
import Shop from './components/Shop.jsx';
import Rules from './components/Rules.jsx';

export default function App() {
  const { state, dispatch, getState } = useGame();
  const [selectedId, setSelectedId] = useState(null);
  const [mergeTarget, setMergeTarget] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const selected = state.machines.find(m => m.id === selectedId) || null;

  const floorBusy = (() => {
    const hour = new Date().getUTCHours();
    const cur = SHIFTS.find(s => hour >= s.utcStart && hour < s.utcEnd) || SHIFTS[3];
    return cur ? cur.busyBoost + 0.5 + Math.sin(Date.now() / 60000) * 0.15 : 0.5;
  })();

  // ── action dispatcher ─────────────────────────────────────────────────────
  const handleAction = useCallback((type, ...args) => {
    let s = getState();
    switch (type) {
      case 'buy-shift': {
        const id = args[0];
        const ns = buyShift(s, id);
        if (ns === s) { showToast('Not enough PONS'); return; }
        dispatch({ type: 'LOAD', save: ns });
        showToast(`Bought ${SHIFTS.find(x => x.id === id).short}`);
        break;
      }
      case 'buy-machine': {
        const ns = buyMachine(s);
        if (ns === s) { showToast('Not enough PONS'); return; }
        dispatch({ type: 'LOAD', save: ns });
        showToast('New rig in store');
        break;
      }
      case 'place-machine': {
        const ns = placeMachine(s, args[0]);
        if (ns === s) { showToast('No empty bay'); return; }
        dispatch({ type: 'LOAD', save: ns });
        break;
      }
      case 'dig-bay': {
        const ns = digBay(s);
        if (ns === s) { showToast('Not enough PONS'); return; }
        dispatch({ type: 'LOAD', save: ns });
        showToast('New bay dug');
        break;
      }
      case 'toggle-shift': {
        const [mid, sid] = args;
        const m = s.machines.find(x => x.id === mid);
        if (!m) return;
        if (m.shiftBought.has(sid)) {
          m.shiftBought.delete(sid);
          dispatch({ type: 'LOAD', save: { ...s, machines: [...s.machines] } });
        } else {
          if (s.fuel < SHIFT_COST) { showToast('Not enough PONS'); return; }
          m.shiftBought.add(sid);
          const ns = { ...s, fuel: +(s.fuel - SHIFT_COST).toFixed(4), machines: [...s.machines] };
          dispatch({ type: 'LOAD', save: ns });
          showToast(`Shift ${SHIFTS.find(x => x.id === sid).short} assigned`);
        }
        break;
      }
      case 'select-merge-target': {
        const mid = args[0];
        if (!mergeTarget) {
          setMergeTarget(mid);
          showToast('Pick a second machine of same tier');
        } else if (mergeTarget === mid) {
          setMergeTarget(null);
        } else {
          const a = s.machines.find(x => x.id === mergeTarget);
          const b = s.machines.find(x => x.id === mid);
          if (!a || !b) { setMergeTarget(null); return; }
          if (a.tier !== b.tier) { showToast('Must be same tier'); setMergeTarget(null); return; }
          const ns = mergeMachines(s, mergeTarget, mid);
          if (ns === s) { showToast('Not enough PONS or max tier'); setMergeTarget(null); return; }
          dispatch({ type: 'LOAD', save: ns });
          setMergeTarget(null);
          setSelectedId(ns.machines[ns.machines.length - 1]?.id);
          showToast(`Merged to tier ${a.tier + 1}!`);
        }
        break;
      }
      case 'open-shop': setShowShop(true); break;
      case 'open-rules': setShowRules(true); break;
      case 'reset': {
        if (window.confirm('Wipe save and start fresh?')) {
          dispatch({ type: 'RESET' });
          setSelectedId(null);
          setMergeTarget(null);
          showToast('Save wiped');
        }
        break;
      }
      default: break;
    }
  }, [getState, dispatch, mergeTarget, showToast]);

  return (
    <div className="app">
      {/* background layers */}
      <div className="bg-layer" />
      <div className="bg-particles" />

      {/* HUD */}
      <HUD state={state} onAction={handleAction} />

      {/* main content */}
      <main className="main">
        <div className="main-left">
          <Floor
            state={state}
            selectedId={selectedId}
            onSelect={setSelectedId}
            floorBusy={floorBusy}
          />
          <ShiftBar state={state} onAction={handleAction} />
        </div>
        <div className="main-right">
          <MachinePanel
            machine={selected}
            state={state}
            onAction={handleAction}
          />
          {/* mined PONS */}
          {state.pons > 0 && (
            <div className="panel holdings-panel">
              <h2>MINED PONS</h2>
              <div className="holding-row">
                <span className="holding-sym">PONS</span>
                <span className="holding-units">{state.pons.toFixed(4)}</span>
                <span className="muted small">fixed emission · no fake rate</span>
              </div>
            </div>
          )}
          {/* merge status */}
          {mergeTarget && (
            <div className="panel merge-hint">
              <h2>MERGE IN PROGRESS</h2>
              <p>Click another machine of the <b>same tier</b> to complete the merge. The child inherits the higher-ore parent's traits.</p>
              <button className="btn btn-ghost" onClick={() => setMergeTarget(null)}>Cancel</button>
            </div>
          )}
          {/* register */}
          {state.register.length > 0 && (
            <div className="panel register-panel">
              <h2>THE REGISTER</h2>
              <p className="muted small">{state.register.length} combos worked · {state.machines.length} rigs · {state.totalShiftsBought} shifts bought</p>
            </div>
          )}
        </div>
      </main>

      {/* modals */}
      {showShop && <Shop state={state} onAction={handleAction} onClose={() => setShowShop(false)} />}
      {showRules && <Rules onClose={() => setShowRules(false)} />}

      {/* toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}