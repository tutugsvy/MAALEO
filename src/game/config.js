// ─── MINEBROKER · core config ──────────────────────────────────────────────
// Everything tunable lives here. The game reads these constants only.

export const SHIFTS = [
  { id: 'NIGHT',   label: '00-06', short: 'NIGHT',   utcStart: 0,  utcEnd: 6,  busyBoost: 0.15, desc: 'Quiet floor. Sleeper rigs own it.' },
  { id: 'MORNING', label: '06-12', short: 'MORNING', utcStart: 6,  utcEnd: 12, busyBoost: 0.05, desc: 'Floor wakes up. Steady seam.' },
  { id: 'AFTERNOON', label: '12-18', short: 'AFTERNOON', utcStart: 12, utcEnd: 18, busyBoost: 0.10, desc: 'Busiest shift. Social rigs shine.' },
  { id: 'EVENING', label: '18-24', short: 'EVENING', utcStart: 18, utcEnd: 24, busyBoost: -0.05, desc: 'Wind-down. Cheap shifts.' },
];

export const TIERS = {
  1: { name: 'I',   oreMult: 1.00, mergeCost: 0,       sprite: 'brass' },
  2: { name: 'II',  oreMult: 1.18, mergeCost: 0.05,     sprite: 'steel' },
  3: { name: 'III', oreMult: 1.42, mergeCost: 0.15,     sprite: 'chrome' },
  4: { name: 'IV',  oreMult: 1.75, mergeCost: 0.35,     sprite: 'gold' },
  5: { name: 'V',   oreMult: 2.20, mergeCost: 0.75,     sprite: 'plasma' },
};

// Traits — chassis finish = habit, stacks = appetite, wear = seam
export const HABITS = [
  { id: 'SOCIAL',  label: 'Social',  desc: 'Floor busy → +20% digs', mult: 1.20, color: '#ffb347' },
  { id: 'DRIFTER', label: 'Drifter', desc: 'Any seam works, flat rate', mult: 1.10, color: '#8fd3ff' },
  { id: 'LONER',   label: 'Loner',   desc: 'Quiet floor → +20% digs', mult: 1.20, color: '#c792ea' },
];

export const APPETITES = [
  { id: 'THRIFTY', label: 'Thrifty', desc: '-15% burn for same digs', burnMult: 0.85, color: '#7ee787' },
  { id: 'STABLE',  label: 'Stable',  desc: 'Balanced rig',            burnMult: 1.00, color: '#e6edf3' },
  { id: 'GREEDY',  label: 'Greedy',  desc: '+20% digs, +35% burn',   burnMult: 1.35, color: '#ff6b6b' },
];

export const SEAMS = [
  { id: 'SURFACE', label: 'Surface', desc: 'Best on SURFACE seam', mult: 1.20, color: '#9aa7b8' },
  { id: 'DEEP',    label: 'Deep',    desc: 'Best on DEEP seam',    mult: 1.20, color: '#a371f7' },
  { id: 'BROKEN',  label: 'Broken',  desc: 'Best on BROKEN seam',  mult: 1.20, color: '#ffa657' },
];

// Stock tickers the rigs bind to (tokenized stocks on RH)
export const TICKERS = [
  { symbol: 'NVDA', price: 183.75 },
  { symbol: 'AAPL', price: 240.66 },
  { symbol: 'MSFT', price: 464.60 },
  { symbol: 'TSLA', price: 333.79 },
];

export const FUEL_PLAY = 6.00;        // play-money fuel given on new save
export const MACHINE_PLAY = 1.00;     // play-money cost of a new rig
export const BAY_PLAY = 1.43;         // play-money cost of an extra bay
export const SHIFT_COST = 0.17;       // play-money cost per shift
export const LAUNCH_RATE = 6.00;      // $ back per $1 fuel at launch
export const MATURE_RATE = 1.30;      // $ back per $1 fuel when matured
export const SETTLE_SECONDS = 120;    // shift settles every 2 min
export const BASELINE_DIGS = 100;     // baseline ore a tier-I digs per shift
export const MAX_TICKERS = 4;

export const SAVE_KEY = 'minebroker_v1';

export const FLOOR_CAPACITY = 8;      // bays per floor (before dig-bay)
