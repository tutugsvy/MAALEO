// ─── MINEBROKER · useGame hook — state, autosave, settle loop ──────────────
import { useEffect, useReducer, useRef, useCallback } from 'react';
import { freshSave, settleAll } from './state.js';
import { SAVE_KEY, SETTLE_SECONDS } from './config.js';

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return freshSave();
    const s = JSON.parse(raw);
    if (!s.machines || !s.shiftState) return freshSave();
    // restore Sets from arrays
    s.machines.forEach(m => {
      if (!(m.shiftBought instanceof Set)) m.shiftBought = new Set(m.shiftBought || []);
    });
    return s;
  } catch {
    return freshSave();
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD': return action.save;
    case 'SETTLE': return settleAll(state, Date.now());
    case 'RESET': return freshSave();
    default: return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const stateRef = useRef(state);
  stateRef.current = state;

  // settle loop — every SETTLE_SECONDS, settle all bought shifts
  useEffect(() => {
    const iv = setInterval(() => dispatch({ type: 'SETTLE' }), SETTLE_SECONDS * 1000);
    return () => clearInterval(iv);
  }, []);

  // autosave on every state change (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [state]);

  const getState = useCallback(() => stateRef.current, []);

  return { state, dispatch, getState };
}
