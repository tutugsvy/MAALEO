// ─── PONSMINER · procedural animated GPU sprite renderer (v3) ──────────────
// Reference-inspired (dark card + glowing LED bar across the face + 3 big
// white fans below) but 100% original procedural canvas art. Fans visibly
// spin (idle slow, mining fast w/ motion blur), LED bar pulses & sweeps,
// card bobs & shimmers when mining. No image assets.

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbStr(c) { return `rgb(${c[0]},${c[1]},${c[2]})`; }
function lighten(hex, amt) { return rgbStr(hexToRgb(hex).map(v => Math.min(255, v + amt))); }
function darken(hex, amt) { return rgbStr(hexToRgb(hex).map(v => Math.max(0, v - amt))); }
function alpha(hex, a) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}
function ledColor(accent, p, pulse) {
  const base = hexToRgb(accent);
  const glow = Math.max(0, 0.75 + 0.25 * pulse);
  const r = Math.min(255, base[0] * (0.45 + 0.55 * p) * glow);
  const g = Math.min(255, base[1] * (0.45 + 0.55 * p) * glow);
  const b = Math.min(255, base[2] * (0.45 + 0.55 * p) * glow);
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

// Draw one GPU. x,y = center. s = scale. t = time (s). opts: {selected,mining,hashRate}
export function drawGPU(ctx, gpu, x, y, s = 1, t = 0, opts = {}) {
  const m = gpu.model;
  const W = 124 * s, H = 56 * s;
  const mining = !!opts.mining;

  // breathing bob — GPU "lives"; stronger when mining
  const bob = mining ? Math.sin(t * 2.4) * 2 * s : Math.sin(t * 0.9) * 0.6 * s;
  const breathe = 0.5 + 0.5 * Math.sin(t * (mining ? 7 : 2));

  ctx.save();
  ctx.translate(x, y + bob);

  // ── ground glow (mining = hot) ──
  const glowR = W * (0.55 + 0.05 * breathe);
  const glow = ctx.createRadialGradient(0, H * 0.55, 2, 0, H * 0.55, glowR);
  glow.addColorStop(0, alpha(m.accent, mining ? 0.38 : 0.14));
  glow.addColorStop(1, alpha(m.accent, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(0, H * 0.55, glowR, H * 0.17, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── shadow ──
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, H * 0.62, W * 0.57, H * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const bodyY = -H * 0.56;          // top of card
  const bodyH = H * 0.9;            // card face height
  const bodyBottom = bodyY + bodyH;

  // ══ CARD FACE ══
  // base plate (darker) peeking out bottom
  ctx.fillStyle = darken(m.color, 26);
  rr(ctx, -W / 2 + 3 * s, bodyY + 4 * s, W - 6 * s, bodyH, 9 * s);
  ctx.fill();
  // main shroud (metallic dark gradient, like the reference card)
  const sh = ctx.createLinearGradient(0, bodyY, 0, bodyBottom);
  sh.addColorStop(0, lighten(m.color, 14));
  sh.addColorStop(0.5, m.color);
  sh.addColorStop(1, darken(m.color, 34));
  ctx.fillStyle = sh;
  rr(ctx, -W / 2, bodyY, W, bodyH, 9 * s);
  ctx.fill();
  // edge highlight (top light rim)
  ctx.strokeStyle = alpha('#ffffff', 0.16);
  ctx.lineWidth = 1.2 * s;
  rr(ctx, -W / 2 + 1.5 * s, bodyY + 1.5 * s, W - 3 * s, bodyH - 3 * s, 8 * s);
  ctx.stroke();
  // brushed-metal lines on upper area
  ctx.strokeStyle = alpha('#ffffff', 0.05);
  ctx.lineWidth = 1 * s;
  for (let i = 0; i < 6; i++) {
    const ly = bodyY + 7 * s + i * 4 * s;
    ctx.beginPath();
    ctx.moveTo(-W / 2 + 8 * s, ly);
    ctx.lineTo(W / 2 - 8 * s, ly);
    ctx.stroke();
  }

  // ── brand text on top of the card (like reference has text) ──
  ctx.fillStyle = alpha('#ffffff', 0.5);
  ctx.font = `bold ${Math.round(5 * s)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('PONSMINER', -W / 2 + 8 * s, bodyY + 9 * s);

  // ══ GLOWING LED BAR (across the middle of the face — the signature look) ══
  const barY = bodyY + 19 * s;
  const barH = 8 * s;
  const barW = W - 18 * s;
  const barX = -W / 2 + 9 * s;
  const sweep = mining ? (t * 1.1) % 1 : (t * 0.22) % 1;
  const pulse = mining ? 0.5 + 0.5 * Math.sin(t * 6) : 0.2;
  // outer glow bleed
  ctx.save();
  ctx.shadowColor = m.accent;
  ctx.shadowBlur = (mining ? 16 : 6) * s;
  ctx.fillStyle = alpha(m.accent, mining ? 0.9 : 0.55);
  rr(ctx, barX, barY, barW, barH, 3.5 * s);
  ctx.fill();
  ctx.restore();
  // animated gradient across the bar (sweep travels)
  const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  barGrad.addColorStop(0, ledColor(m.accent, 0.22, pulse));
  barGrad.addColorStop(Math.max(0, sweep - 0.04), ledColor(m.accent, 0.35, pulse));
  barGrad.addColorStop(sweep, ledColor(m.accent, 1, pulse));
  barGrad.addColorStop(Math.min(1, sweep + 0.08), ledColor(m.accent, 0.4, pulse));
  barGrad.addColorStop(1, ledColor(m.accent, 0.25, pulse));
  ctx.fillStyle = barGrad;
  rr(ctx, barX, barY, barW, barH, 3.5 * s);
  ctx.fill();
  // etched model text on the LED bar (dark letters, like reference)
  ctx.fillStyle = m.led;
  ctx.font = `bold ${Math.round(5.5 * s)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(m.label, 0, barY + barH / 2 + 0.5 * s);

  // ══ THREE BIG FANS below the LED bar ══
  const fanCount = m.fans || 3;
  const fanY = bodyY + 35 * s;
  const fanR = 13.5 * s;
  const gap = 2.5 * s;
  const fanTotal = fanCount * (fanR * 2 + gap * 2) - gap * 2;
  const fanStart = -fanTotal / 2 + fanR + gap;

  for (let i = 0; i < fanCount; i++) {
    const fx = fanStart + i * (fanR * 2 + gap * 2);
    // direction alternates for realism
    const dir = i % 2 ? 1 : -1;
    // spin: fast when mining (visible sweep + blur), slow idle
    const speed = mining ? 14 : 1.7;
    const spin = t * speed;

    // RGB ring around fan (pulses when mining)
    ctx.save();
    ctx.shadowColor = m.accent;
    ctx.shadowBlur = (mining ? 10 : 3) * s;
    ctx.strokeStyle = alpha(m.accent, 0.5 + 0.5 * breathe);
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.arc(fx, fanY, fanR + 2 * s, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // fan shroud (dark ring — makes white blades pop)
    ctx.fillStyle = '#0b0d11';
    ctx.beginPath();
    ctx.arc(fx, fanY, fanR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = alpha('#ffffff', 0.1);
    ctx.lineWidth = 1 * s;
    ctx.stroke();

    // spinning blades — high-contrast white so motion is obvious
    ctx.save();
    ctx.translate(fx, fanY);
    ctx.rotate(spin * dir);
    const bladeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, fanR);
    bladeGrad.addColorStop(0, alpha('#ffffff', 0.65));
    bladeGrad.addColorStop(1, alpha('#c9d4e4', 0.9));
    ctx.fillStyle = bladeGrad;
    const BLADES = 9;
    for (let b = 0; b < BLADES; b++) {
      ctx.rotate((Math.PI * 2) / BLADES);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(fanR * 0.42, -fanR * 0.42, fanR * 0.97, -fanR * 0.14);
      ctx.quadraticCurveTo(fanR * 0.5, 0.06, 0, 0);
      ctx.closePath();
      ctx.fill();
    }
    // translucent blur disc when spinning fast (mining)
    if (mining) {
      ctx.fillStyle = alpha('#dfe7f2', 0.16);
      ctx.beginPath();
      ctx.arc(0, 0, fanR * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
    // metallic hub with accent ring
    const hub = ctx.createRadialGradient(-fanR * 0.25, -fanR * 0.25, 0, 0, 0, fanR * 0.36);
    hub.addColorStop(0, '#4c586b');
    hub.addColorStop(1, '#181d24');
    ctx.fillStyle = hub;
    ctx.beginPath();
    ctx.arc(0, 0, fanR * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = alpha(m.accent, 0.9);
    ctx.lineWidth = 1.4 * s;
    ctx.beginPath();
    ctx.arc(0, 0, fanR * 0.34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // ── serial + status readout (bottom-left) ──
  ctx.fillStyle = alpha('#ffffff', 0.4);
  ctx.font = `${Math.round(5.5 * s)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`#${gpu.serial}`, -W / 2 + 8 * s, bodyBottom + 8 * s);

  // hash rate readout (bottom-right)
  if (opts.hashRate != null) {
    ctx.fillStyle = mining ? '#7ee787' : '#6b7280';
    ctx.font = `bold ${Math.round(6.5 * s)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(`${opts.hashRate} P/h`, W / 2 - 8 * s, bodyBottom + 8 * s);
  }

  // ── heat shimmer above the card when mining ──
  if (mining) {
    for (let i = 0; i < 6; i++) {
      const progress = ((t * 16 + i * 15) % 32) / 32;
      const hx = -W / 2 + 10 * s + i * 20 * s + Math.sin(t * 6 + i * 1.6) * 4 * s;
      const hy = bodyY - 5 * s - progress * 18 * s;
      ctx.globalAlpha = 0.4 * (1 - progress);
      ctx.fillStyle = m.accent;
      ctx.beginPath();
      ctx.arc(hx, hy, 1.7 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ── PONS pool badge ──
  ctx.fillStyle = '#0c0e12';
  rr(ctx, W / 2 - 38 * s, bodyBottom + 3 * s, 38 * s, 12 * s, 3 * s);
  ctx.fill();
  ctx.strokeStyle = m.accent;
  ctx.lineWidth = 1 * s;
  rr(ctx, W / 2 - 38 * s, bodyBottom + 3 * s, 38 * s, 12 * s, 3 * s);
  ctx.stroke();
  ctx.fillStyle = lighten(m.accent, 60);
  ctx.font = `bold ${Math.round(6.5 * s)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('PONS', W / 2 - 19 * s, bodyBottom + 9 * s);

  // ── selection ring ──
  if (opts.selected) {
    ctx.strokeStyle = '#ffd257';
    ctx.lineWidth = 2 * s;
    ctx.setLineDash([6 * s, 4 * s]);
    ctx.lineDashOffset = -t * 24;
    rr(ctx, -W / 2 - 10 * s, bodyY - 8 * s, W + 20 * s, bodyH + 10 * s, 13 * s);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,210,87,0.85)';
    ctx.font = `bold ${Math.round(7 * s)}px 'JetBrains Mono', monospace`;
    ctx.fillText('▲ SELECTED', 0, bodyY - 10 * s);
  }

  ctx.restore();
}
