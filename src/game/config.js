// ─── PONSMINER · core config ───────────────────────────────────────────────
// Everything tunable lives here. The game reads these constants only.

export const SHIFTS = [
  { id: 'NIGHT',   label: '00-06', short: 'NIGHT',   utcStart: 0,  utcEnd: 6,  busyBoost: 0.15, desc: 'Quiet floor. Sleeper rigs own it.' },
  { id: 'MORNING', label: '06-12', short: 'MORNING', utcStart: 6,  utcEnd: 12, busyBoost: 0.05, desc: 'Floor wakes up. Steady seam.' },
  { id: 'AFTERNOON', label: '12-18', short: 'AFTERNOON', utcStart: 12, utcEnd: 18, busyBoost: 0.10, desc: 'Busiest shift. Social rigs shine.' },
  { id: 'EVENING', label: '18-24', short: 'EVENING', utcStart: 18, utcEnd: 24, busyBoost: -0.05, desc: 'Wind-down. Cheap shifts.' },
];

export const TIERS = {
  1: { name: 'I',   oreMult: 1.00, mergeCost: 0,       sprite: 'brass' },
  2: { name: 'II',  oreMult: 1.18, mergeCost: 5,       sprite: 'steel' },
  3: { name: 'III', oreMult: 1.42, mergeCost: 15,      sprite: 'chrome' },
  4: { name: 'IV',  oreMult: 1.75, mergeCost: 35,      sprite: 'gold' },
  5: { name: 'V',   oreMult: 2.20, mergeCost: 75,      sprite: 'plasma' },
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

// ─── PONS tokenomics (deterministic emission) ───────────────────────────────
// PONSMINER pays a FIXED, determined amount of $PONS per settle — the whole
// emission schedule is readable, no hidden supply, no games.
export const TOKEN = {
  symbol: 'PONS',
  name: 'Pons',
  decimals: 18,
  supply: 1_000_000_000,      // 1B, same fixed-supply pattern as Pons launchpad
  // DETERMINED PAYOUT: fixed PONS per settle, split by ore share.
  // This is the "jumlah token yang ditentukan" — on-chain readable, tapers.
  emissionPerSettle: 50,       // 50 PONS paid out every settle (split by ore share)
  emissionStartRate: 6.0,      // $ back per $1 of fuel at launch
  emissionMatureRate: 1.3,     // $ back per $1 when matured
};

export const FUEL_PLAY = 1000;        // play-money PONS given on new save
export const MACHINE_PLAY = 100;      // play-money PONS cost of a new rig
export const BAY_PLAY = 143;          // play-money PONS cost of an extra bay
export const SHIFT_COST = 17;         // play-money PONS cost per shift
export const SETTLE_SECONDS = 120;    // shift settles every 2 min
export const BASELINE_DIGS = 100;     // baseline ore a tier-I digs per settle
export const FLOOR_CAPACITY = 8;      // bays per floor (before dig-bay)

export const SAVE_KEY = 'ponsminer_v1';
