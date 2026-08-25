// ─── MINEBROKER · procedural machine sprite renderer ───────────────────────
// Every rig is drawn from its traits — no image assets, fully deterministic.
// chassis finish = habit · stacks = appetite · wear = seam · tier badge = tier

const TIER_COLORS = {
  1: { body: '#8f5a1e', edge: '#c98a3a', name: 'BRASS' },
  2: { body: '#5b6772', edge: '#9aa7b8', name: 'STEEL' },
  3: { body: '#2b3542', edge: '#cfe3ff', name: 'CHROME' },
  4: { body: '#6b4a12', edge: '#ffd257', name: 'GOLD' },
  5: { body: '#3b1f52', edge: '#b06cff', name: 'PLASMA' },
};

const HABIT_STYLE = {
  SOCIAL:  { lamp: '#ffb347', decal: '#ffd9a0' },
  DRIFTER: { lamp: '#8fd3ff', decal: '#cfe9ff' },
  LONER:   { lamp: '#c792ea', decal: '#e4ccff' },
};

const APPETITE_STACKS = { THRIFTY: 1, STABLE: 2, GREEDY: 3 };

// Rounded rect helper
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ── main draw ───────────────────────────────────────────────────────────────
// machine: { tier, habit, appetite, seam, bound }
// x,y = center of the machine body · s = scale (1 = 96px wide)
// t = time (s) for animation · opts.selected / opts.digging
export function drawMachine(ctx, machine, x, y, s = 1, t = 0, opts = {}) {
  const col = TIER_COLORS[machine.tier] || TIER_COLORS[1];
  const hab = HABIT_STYLE[machine.habit.id] || HABIT_STYLE.DRIFTER;
  const stacks = APPETITE_STACKS[machine.appetite.id] || 2;

  const W = 96 * s, H = 64 * s;
  const cx = x, cy = y;
  const bob = opts.digging ? Math.sin(t * 6) * 2 * s : Math.sin(t * 1.2) * 0.8 * s;

  ctx.save();
  ctx.translate(cx, cy + bob);

  // shadow
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, H * 0.52, W * 0.5, H * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // tracks (tread)
  ctx.fillStyle = '#15181d';
  rr(ctx, -W / 2 - 2, H * 0.24, W + 4, H * 0.26, 5 * s);
  ctx.fill();
  for (let i = -4; i < 4; i++) {
    ctx.fillStyle = '#2b3139';
    ctx.fillRect(-W / 2 + i * (W / 8) + 2, H * 0.26, W / 12, H * 0.22);
  }

  // body
  const grad = ctx.createLinearGradient(0, -H * 0.3, 0, H * 0.3);
  grad.addColorStop(0, lighten(col.body, 30));
  grad.addColorStop(0.5, col.body);
  grad.addColorStop(1, darken(col.body, 25));
  ctx.fillStyle = grad;
  rr(ctx, -W / 2, -H * 0.34, W, H * 0.62, 8 * s);
  ctx.fill();
  ctx.strokeStyle = col.edge;
  ctx.lineWidth = 2 * s;
  ctx.globalAlpha = 0.85;
  rr(ctx, -W / 2, -H * 0.34, W, H * 0.62, 8 * s);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // vents
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(-W / 2 + 10 * s + i * 14 * s, H * 0.14, 8 * s, 3 * s);
  }

  // stacks (appetite) — animated smoke when digging
  for (let i = 0; i < stacks; i++) {
    const sx = -W / 2 + (W / (stacks + 1)) * (i + 1);
    ctx.fillStyle = darken(col.body, 10);
    ctx.fillRect(sx - 4 * s, -H * 0.34 - 10 * s, 8 * s, 12 * s);
    ctx.fillStyle = col.edge;
    ctx.fillRect(sx - 5 * s, -H * 0.34 - 13 * s, 10 * s, 3 * s);
    if (opts.digging) {
      const puff = (t * 0.8 + i * 0.6) % 1;
      ctx.globalAlpha = (1 - puff) * 0.4;
      ctx.fillStyle = '#c9c2b5';
      ctx.beginPath();
      ctx.arc(sx, -H * 0.34 - 16 * s - puff * 14 * s, (2 + puff * 4) * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // headlamp (habit color) — pulses when active
  const lampGlow = opts.digging ? 0.7 + 0.3 * Math.sin(t * 10) : 0.35;
  ctx.fillStyle = hab.lamp;
  ctx.shadowColor = hab.lamp;
  ctx.shadowBlur = 14 * s * lampGlow;
  ctx.beginPath();
  ctx.arc(W / 2 - 8 * s, -H * 0.05, 5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // decal stripe (habit accent)
  ctx.fillStyle = hab.decal;
  ctx.globalAlpha = 0.7;
  ctx.fillRect(-W / 2 + 6 * s, -H * 0.28, W - 12 * s, 3 * s);
  ctx.globalAlpha = 1;

  // seam wear (scratches on the body)
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 1.2 * s;
  const seamSeed = machine.seam.id === 'BROKEN' ? 3 : machine.seam.id === 'DEEP' ? 2 : 1;
  for (let i = 0; i < seamSeed * 3; i++) {
    const wx = -W / 2 + 8 * s + ((i * 37) % (W - 20 * s));
    const wy = -H * 0.18 + ((i * 53) % (int(H * 0.3)));
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.lineTo(wx + 7 * s, wy + 3 * s);
    ctx.stroke();
  }

  // tier badge
  const badgeR = 9 * s;
  ctx.fillStyle = '#0c0e12';
  ctx.beginPath();
  ctx.arc(-W / 2 + 12 * s, -H * 0.3, badgeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = col.edge;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
  ctx.fillStyle = col.edge;
  ctx.font = `bold ${Math.round(9 * s)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('I'.repeat(machine.tier), -W / 2 + 12 * s, -H * 0.3 + 0.5 * s);

  // bound ticker label
  if (machine.bound) {
    ctx.fillStyle = '#0c0e12';
    rr(ctx, W / 2 - 30 * s, H * 0.02, 30 * s, 12 * s, 3 * s);
    ctx.fill();
    ctx.strokeStyle = col.edge;
    ctx.lineWidth = 1 * s;
    rr(ctx, W / 2 - 30 * s, H * 0.02, 30 * s, 12 * s, 3 * s);
    ctx.stroke();
    ctx.fillStyle = col.edge;
    ctx.font = `bold ${Math.round(7 * s)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(machine.bound, W / 2 - 15 * s, H * 0.08);
  }

  // selection ring
  if (opts.selected) {
    ctx.strokeStyle = '#ffd257';
    ctx.lineWidth = 2.5 * s;
    ctx.setLineDash([6 * s, 4 * s]);
    ctx.lineDashOffset = -t * 20;
    rr(ctx, -W / 2 - 6 * s, -H * 0.4, W + 12 * s, H * 0.8, 10 * s);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

function lighten(hex, amt) {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${clamp255(r + amt)}, ${clamp255(g + amt)}, ${clamp255(b + amt)})`;
}
function darken(hex, amt) {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${clamp255(r - amt)}, ${clamp255(g - amt)}, ${clamp255(b - amt)})`;
}
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function clamp255(n) { return Math.max(0, Math.min(255, n)); }
function int(n) { return Math.round(n); }
