// ─── PONSMINER · procedural animated GPU sprite renderer ───────────────────
// Each GPU is drawn from its model: fans spin, LED glow pulses, heat shimmers.
// No image assets — fully deterministic canvas art.

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function lighten(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + amt);
  const g = Math.min(255, ((n >> 8) & 255) + amt);
  const b = Math.min(255, (n & 255) + amt);
  return `rgb(${r},${g},${b})`;
}
function darken(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) - amt);
  const g = Math.max(0, ((n >> 8) & 255) - amt);
  const b = Math.max(0, (n & 255) - amt);
  return `rgb(${r},${g},${b})`;
}

// Draw one GPU. x,y = center. s = scale. t = time (s) for animation.
// opts: { selected, mining, hashRate }
export function drawGPU(ctx, gpu, x, y, s = 1, t = 0, opts = {}) {
  const m = gpu.model;
  const W = 110 * s, H = 46 * s;

  ctx.save();
  ctx.translate(x, y);

  // ── shadow ──
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, H * 0.62, W * 0.55, H * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ── PCB board ──
  const boardGrad = ctx.createLinearGradient(0, -H / 2, 0, H / 2);
  boardGrad.addColorStop(0, darken(m.color, 15));
  boardGrad.addColorStop(1, darken(m.color, 45));
  ctx.fillStyle = boardGrad;
  rr(ctx, -W / 2, -H * 0.52, W, H, 6 * s);
  ctx.fill();
  ctx.strokeStyle = m.edge;
  ctx.lineWidth = 2 * s;
  ctx.globalAlpha = 0.8;
  rr(ctx, -W / 2, -H * 0.52, W, H, 6 * s);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // ── top edge strip (heat sink) ──
  ctx.fillStyle = '#11131a';
  for (let i = 0; i < 12; i++) {
    ctx.fillRect(-W / 2 + 6 * s + i * 8.5 * s, -H * 0.5, 5 * s, 6 * s);
  }

  // ── fans (spinning!) ──
  const fanCount = m.fans || 3;
  for (let i = 0; i < fanCount; i++) {
    const fx = -W / 2 + (W / (fanCount + 1)) * (i + 1);
    const fy = H * 0.02;
    const r = 13 * s;
    const spin = opts.mining ? t * 14 : t * 2; // fast when mining
    const wobble = 0.8 + 0.2 * Math.sin(t * 3 + i * 2);

    // fan shroud
    ctx.fillStyle = '#0c0e12';
    ctx.beginPath();
    ctx.arc(fx, fy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = m.edge;
    ctx.lineWidth = 1.5 * s;
    ctx.stroke();

    // blades (3 curved lines rotating)
    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(spin * (i % 2 ? 1 : -1));
    for (let b = 0; b < 3; b++) {
      ctx.rotate((Math.PI * 2) / 3);
      ctx.strokeStyle = opts.mining ? lighten(m.edge, 40) : m.edge;
      ctx.lineWidth = 2.2 * s;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(r * 0.45, -r * 0.3, r * 0.92, -r * 0.05);
      ctx.stroke();
    }
    // center hub
    ctx.fillStyle = '#2a3040';
    ctx.beginPath();
    ctx.arc(0, 0, 3 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // LED ring around fan when mining
    if (opts.mining) {
      ctx.strokeStyle = m.edge;
      ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 8 + i);
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.arc(fx, fy, r + 2 * s, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  // ── model label on card ──
  ctx.fillStyle = m.edge;
  ctx.font = `bold ${Math.round(8 * s)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(m.label, -W / 2 + 8 * s, -H * 0.28);

  // serial number
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = `${Math.round(6 * s)}px 'JetBrains Mono', monospace`;
  ctx.fillText(`#${gpu.serial}`, -W / 2 + 8 * s, -H * 0.15);

  // ── hash rate / mining readout ──
  if (opts.hashRate != null) {
    ctx.fillStyle = opts.mining ? '#7ee787' : '#6b7280';
    ctx.font = `bold ${Math.round(7 * s)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(`${opts.hashRate} P/h`, W / 2 - 8 * s, -H * 0.28);
  }

  // ── PONS pool badge ──
  ctx.fillStyle = '#0c0e12';
  rr(ctx, W / 2 - 34 * s, H * 0.2, 34 * s, 12 * s, 3 * s);
  ctx.fill();
  ctx.strokeStyle = m.edge;
  ctx.lineWidth = 1 * s;
  rr(ctx, W / 2 - 34 * s, H * 0.2, 34 * s, 12 * s, 3 * s);
  ctx.stroke();
  ctx.fillStyle = m.edge;
  ctx.font = `bold ${Math.round(7 * s)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PONS', W / 2 - 17 * s, H * 0.26);

  // ── heat shimmer (above the card when mining) ──
  if (opts.mining) {
    for (let i = 0; i < 3; i++) {
      const hx = -W / 2 + 15 * s + i * 30 * s + Math.sin(t * 5 + i) * 4 * s;
      const hy = -H * 0.55 - ((t * 12 + i * 14) % 22) * s;
      ctx.globalAlpha = 0.25 * (1 - (((t * 12 + i * 14) % 22) / 22));
      ctx.fillStyle = '#ffd257';
      ctx.beginPath();
      ctx.arc(hx, hy, 1.8 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ── selection ring ──
  if (opts.selected) {
    ctx.strokeStyle = '#ffd257';
    ctx.lineWidth = 2.5 * s;
    ctx.setLineDash([6 * s, 4 * s]);
    ctx.lineDashOffset = -t * 20;
    rr(ctx, -W / 2 - 8 * s, -H * 0.62, W + 16 * s, H * 0.95, 10 * s);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}
