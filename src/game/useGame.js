// ─── PONSMINER · useGame hook — state, autosave, accrual loop ──────────────
import { useEffect, useReducer, useRef, useCallback } from 'react';
import { freshSave, tick } from './state.js';
import { SAVE_KEY, TICK_SECONDS } from './config.js';

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return freshSave();
    const s = JSON.parse(raw);
    if (!s.gpus || !s.pay) return freshSave();
    return s;
  } catch {
    return freshSave();
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
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const stateRef = useRef(state);
  stateRef.current = state;

  // accrual loop — every TICK_SECONDS, accrue pool share
  useEffect(() => {
    const iv = setInterval(() => dispatch({ type: 'TICK' }), 1000); // check every 1s, tick() gates on elapsed
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
