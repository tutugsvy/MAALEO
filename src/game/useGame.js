// ─── PONSMINER · useGame hook — state, per-wallet saves, accrual loop ──────
import { useEffect, useReducer, useRef, useCallback } from 'react';
import { freshSave, tick } from './state.js';
import { SAVE_KEY, TICK_SECONDS } from './config.js';

// Each wallet has its own save key → own GPU inventory & PONS balance.
// No wallet = shared "guest" save.
function saveKeyFor(wallet) {
  return wallet ? `${SAVE_KEY}_${String(wallet).toLowerCase()}` : SAVE_KEY;
}

function load(wallet) {
  try {
    const raw = localStorage.getItem(saveKeyFor(wallet));
    if (!raw) return { ...freshSave(), wallet: wallet || null };
    const s = JSON.parse(raw);
    if (!s.gpus || !s.pay) return { ...freshSave(), wallet: wallet || null };
    return { ...s, wallet: wallet || null };
  } catch {
    return { ...freshSave(), wallet: wallet || null };
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD': return action.save;
    case 'TICK': return tick(state, Date.now());
    case 'RESET': return freshSave();
    default: return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => load(null));
  const stateRef = useRef(state);
  stateRef.current = state;

  // wallet change (connect / switch account / disconnect) → load that save
  const lastWalletRef = useRef(state.wallet);
  useEffect(() => {
    const w = state.wallet;
    if (w === lastWalletRef.current) return;
    lastWalletRef.current = w;
    dispatch({ type: 'LOAD', save: load(w) });
  }, [state.wallet]);

  // accrual loop — every 1s check; tick() gates on elapsed TICK_SECONDS
  useEffect(() => {
    const iv = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(iv);
  }, []);

  // autosave on every state change (debounced), into the current wallet's key
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(saveKeyFor(state.wallet), JSON.stringify(state)); } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [state]);

  const getState = useCallback(() => stateRef.current, []);

  return { state, dispatch, getState };
}
