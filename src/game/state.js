// ─── PONSMINER · game state (GPU mining, shared pool) ──────────────────────
// Pure state transitions. No React here.
// Core loop: buy GPU (500k PAY → treasury) → GPU mines PONS.
// The whole pool pays POOL_PER_HOUR PONS/hour, split equally among ALL GPU owners.

import { GPU_MODELS, GPU_COST, POOL_PER_HOUR, PAY_TOKEN, TREASURY,
         FUEL_PLAY, TICK_SECONDS, MAX_GPU_PER_WALLET } from './config.js';
import { mulberry32, pick, uid } from './rng.js';

export function makeGPU(seed = Date.now()) {
  const rng = mulberry32(seed ^ 0x5f356495);
  const model = pick(rng, GPU_MODELS);
  return {
    id: uid() + seed.toString(36),
    model,                    // cosmetic
    serial: Math.floor(rng() * 90000) + 10000,
    born: Date.now(),
    ponsMined: 0,             // PONS this GPU has mined (its share)
  };
}

// ── fresh save ──────────────────────────────────────────────────────────────
export function freshSave() {
  return {
    version: 3,
    pay: FUEL_PLAY,           // play PAY tokens to spend
    pons: 0,                  // mined PONS (settled)
    gpus: [],                 // owned GPUs (start empty — buy your first)
    // protocol-level facts (deterministic, readable)
    totalGpuCount: 0,         // how many GPUs exist on the whole floor (incl others)
    poolPerHour: POOL_PER_HOUR,
    createdAt: Date.now(),
    lastTick: Date.now(),
    wallet: null,             // connected wallet address (play/local in prototype)
  };
}

// ── shared-pool math ────────────────────────────────────────────────────────
// Each GPU owner earns: poolPerHour / totalGpuCount per hour.
// In the real game, totalGpuCount is read on-chain; here it's simulated.
export function perGpuPerHour(state) {
  const n = Math.max(state.totalGpuCount, 1);
  return POOL_PER_HOUR / n;
}

// ── buy a GPU ───────────────────────────────────────────────────────────────
export function buyGPU(state, now = Date.now()) {
  if (state.gpus.length >= MAX_GPU_PER_WALLET) return state;
  if (state.pay < GPU_COST) return state;
  // Payment goes to treasury (in the real game: approve + transferFrom to TREASURY)
  const gpu = makeGPU(now);
  return {
    ...state,
    pay: +(state.pay - GPU_COST).toFixed(4),
    gpus: [...state.gpus, gpu],
    totalGpuCount: state.totalGpuCount + 1,
  };
}

// ── accrual tick (every TICK_SECONDS) ───────────────────────────────────────
// Everyone with a GPU earns their share of the pool for the elapsed time.
export function tick(state, now = Date.now()) {
  if (state.gpus.length === 0) return { ...state, lastTick: now };
  const elapsedMs = now - state.lastTick;
  if (elapsedMs < TICK_SECONDS * 1000) return state;
  const hours = elapsedMs / 3600000;
  const rate = perGpuPerHour(state);
  const earned = rate * hours; // per GPU

  const gpus = state.gpus.map(g => ({ ...g, ponsMined: +(g.ponsMined + earned).toFixed(6) }));
  const totalEarned = earned * state.gpus.length;

  return {
    ...state,
    gpus,
    pons: +(state.pons + totalEarned).toFixed(6),
    lastTick: now,
  };
}

// ── connect / disconnect wallet (real injected address from wallet.js) ─────
export function connectWallet(state, address) {
  return { ...state, wallet: address };
}

export function disconnectWallet(state) {
  return { ...state, wallet: null };
}

export function sellPons(state) {
  // Real game: swap mined PONS. Prototype: tracked only.
  return state;
}
