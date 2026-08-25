// ─── PONSMINER · game state ────────────────────────────────────────────────
// Pure state transitions. No React in here — easy to test, easy to serialize.

import { SHIFTS, TIERS, HABITS, APPETITES, SEAMS, TOKEN,
         FUEL_PLAY, MACHINE_PLAY, BAY_PLAY, SHIFT_COST, SETTLE_SECONDS,
         BASELINE_DIGS, FLOOR_CAPACITY } from './config.js';
import { mulberry32, pick, randInt, weightedPick, uid, clamp } from './rng.js';

// ── machine factory ─────────────────────────────────────────────────────────
export function makeMachine(seed = Date.now()) {
  const rng = mulberry32(seed ^ 0x9e3779b9);
  return {
    id: uid() + seed.toString(36),
    tier: 1,
    habit: pick(rng, HABITS),
    appetite: pick(rng, APPETITES),
    seam: pick(rng, SEAMS),
    ore: 0,               // ore earned this run (register, never resets)
    shiftBought: new Set(), // shift ids bought ahead
    born: Date.now(),
    lastSettled: null,
  };
}

// ── fresh save ──────────────────────────────────────────────────────────────
export function freshSave() {
  const rng = mulberry32(Date.now());
  return {
    version: 2,
    fuel: FUEL_PLAY,
    machines: [makeMachine(rng() * 1e9), makeMachine(rng() * 1e9)],
    bays: 2,                     // 2 machines fit by default
    owned: [],                   // machines without a bay wait in store
    pons: 0,                     // mined $PONS (settled, spendable)
    register: [],                // combos actually worked (tier × habit × seam)
    shiftState: SHIFTS.map(s => ({
      id: s.id,
      bought: false,
      boughtAt: 0,
      lastSettle: Date.now(),
      poolOre: 0,                // ore accumulated in this shift pool
    })),
    createdAt: Date.now(),
    totalShiftsBought: 0,
  };
}

// ── helpers ─────────────────────────────────────────────────────────────────
function tierOf(m) { return TIERS[m.tier] || TIERS[1]; }

// How much ore a machine digs per settle, given shift busy-ness + floor factor.
// Same math runs client-side; the real game would mirror it in a contract.
export function digRate(machine, shift, floorBusy, seam) {
  const t = tierOf(machine);
  let mult = t.oreMult;
  // habit: social likes busy, loner likes quiet
  if (machine.habit.id === 'SOCIAL' && floorBusy > 0.6) mult *= 1.20;
  if (machine.habit.id === 'LONER'  && floorBusy < 0.4) mult *= 1.20;
  if (machine.habit.id === 'DRIFTER') mult *= 1.10;
  // appetite
  if (machine.appetite.id === 'GREEDY') mult *= 1.20;
  if (machine.appetite.id === 'THRIFTY') mult *= 1.00; // burns less, same digs
  // seam: on its own seam digs better, off it worse
  mult *= (seam === machine.seam.id) ? 1.20 : 0.90;
  // floor busy noise
  const noise = 0.85 + floorBusy * 0.30;
  return Math.round(BASELINE_DIGS * mult * noise * (0.9 + Math.random() * 0.2));
}

// Burn cost (fuel) per settle for a machine
export function burnCost(machine, baseBurn = 2) {
  const t = tierOf(machine);
  let burn = baseBurn * t.oreMult;
  if (machine.appetite.id === 'GREEDY')  burn *= 1.35;
  if (machine.appetite.id === 'THRIFTY') burn *= 0.85;
  return burn;
}

// The pool is split by ore share; a machine's cut is its ore share.
export function poolShare(machine, totalOre) {
  if (totalOre <= 0) return 0;
  return machine.ore / totalOre;
}

// ── settle one shift ────────────────────────────────────────────────────────
// PONSMINER pays a DETERMINED amount of $PONS per settle (TOKEN.emissionPerSettle),
// split by ore share. This is the core loop: dig ore → earn fixed PONS.
export function settleShift(state, shiftId, now = Date.now()) {
  const shift = state.shiftState.find(s => s.id === shiftId);
  if (!shift || !shift.bought) return state;
  const cfg = SHIFTS.find(s => s.id === shiftId);
  if (now - shift.lastSettle < SETTLE_SECONDS * 1000) return state;

  // everyone on the floor works this shift
  const workers = state.machines.filter(m => m.shiftBought.has(shiftId));
  if (workers.length === 0) {
    shift.lastSettle = now;
    return { ...state, shiftState: [...state.shiftState] };
  }

  const floorBusy = cfg.busyBoost + 0.5 + Math.random() * 0.3; // 0.5–0.95
  const seam = pick(mulberry32(now), SEAMS).id; // seam drifts per settle

  // each worker digs ore
  let totalOre = 0;
  const digs = workers.map(m => {
    const ore = digRate(m, cfg, floorBusy, seam);
    m.ore += ore;
    totalOre += ore;
    const combo = `${m.tier}-${m.habit.id}-${m.seam.id}`;
    if (!state.register.includes(combo)) state.register.push(combo);
    return { m, ore };
  });

  // DETERMINED PAYOUT: fixed PONS split by ore share
  // emissionPerSettle = the "jumlah token yang ditentukan" (fixed, readable)
  const emission = TOKEN.emissionPerSettle;
  const shares = digs.map(({ m, ore }) => ({
    m,
    pons: (ore / totalOre) * emission,
  }));

  let pons = state.pons;
  for (const { m, pons: cut } of shares) {
    pons = pons + cut;
  }

  shift.poolOre = totalOre;
  shift.lastSettle = now;

  return {
    ...state,
    machines: [...state.machines],
    pons: +pons.toFixed(4),
    register: [...state.register],
    shiftState: [...state.shiftState],
  };
}

// ── actions ─────────────────────────────────────────────────────────────────
export function buyShift(state, shiftId) {
  const cfg = SHIFTS.find(s => s.id === shiftId);
  const shift = state.shiftState.find(s => s.id === shiftId);
  if (shift.bought) return state;
  if (state.fuel < SHIFT_COST) return state;
  return {
    ...state,
    fuel: +(state.fuel - SHIFT_COST).toFixed(4),
    totalShiftsBought: state.totalShiftsBought + 1,
    shiftState: state.shiftState.map(s =>
      s.id === shiftId ? { ...s, bought: true, boughtAt: Date.now(), lastSettle: Date.now() } : s
    ),
  };
}

export function buyMachine(state) {
  if (state.fuel < MACHINE_PLAY) return state;
  const m = makeMachine();
  if (state.owned.length >= 12) return state;
  return {
    ...state,
    fuel: +(state.fuel - MACHINE_PLAY).toFixed(4),
    owned: [...state.owned, m],
  };
}

export function placeMachine(state, machineId) {
  if (state.machines.length >= state.bays) return state;
  const idx = state.owned.findIndex(m => m.id === machineId);
  if (idx === -1) return state;
  const m = state.owned[idx];
  return {
    ...state,
    machines: [...state.machines, m],
    owned: state.owned.filter((_, i) => i !== idx),
  };
}

export function digBay(state) {
  if (state.fuel < BAY_PLAY) return state;
  return {
    ...state,
    fuel: +(state.fuel - BAY_PLAY).toFixed(4),
    bays: state.bays + 1,
  };
}

export function mergeMachines(state, aId, bId) {
  const a = state.machines.find(m => m.id === aId);
  const b = state.machines.find(m => m.id === bId);
  if (!a || !b || a.id === b.id) return state;
  if (a.tier !== b.tier || a.tier >= 5) return state;
  const t = TIERS[a.tier];
  if (state.fuel < t.mergeCost) return state;

  const rng = mulberry32(Date.now() ^ 0x51ab);
  const child = {
    id: uid(),
    tier: a.tier + 1,
    // child inherits: pick habit/appetite/seam from parents (dominant: higher ore)
    habit: (a.ore >= b.ore ? a : b).habit,
    appetite: (a.ore >= b.ore ? a : b).appetite,
    seam: rng() < 0.5 ? a.seam : b.seam,
    ore: a.ore + b.ore,
    shiftBought: new Set([...a.shiftBought, ...b.shiftBought]),
    born: Date.now(),
    lastSettled: null,
  };

  return {
    ...state,
    fuel: +(state.fuel - t.mergeCost).toFixed(4),
    machines: [...state.machines.filter(m => m.id !== aId && m.id !== bId), child],
    bays: state.bays + 1, // merging gives a bay back
    register: [...state.register],
  };
}

export function sellPons(state) {
  // In the real game, mined PONS could be swapped/sold. In the prototype,
  // we just track it — no fake exchange rate.
  return state;
}

export function settleAll(state, now = Date.now()) {
  let s = state;
  for (const sh of SHIFTS) {
    s = settleShift(s, sh.id, now);
  }
  return s;
}
