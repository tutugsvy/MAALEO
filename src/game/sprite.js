// ─── PONSMINER · procedural animated GPU sprite renderer (v2) ──────────────
// Reference-inspired (dark card + glowing LED strip + white fans) but 100%
// original procedural canvas art. Each GPU: fans spin, LED strip cycles,
// card bobs & shimmers when mining. No image assets, fully deterministic.

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
function lighten(hex, amt) {
  const c = hexToRgb(hex).map(v => Math.min(255, v + amt));
  return rgbStr(c);
}
function darken(hex, amt) {
  const c = hexToRgb(hex).map(v => Math.max(0, v - amt));
  return rgbStr(c);
}
function alpha(hex, a) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}
// color at position p (0..1) of a 3-stop gradient: dark → accent → light
function ledColor(accent, p, pulse) {
  const base = hexToRgb(accent);
  const glow = Math.max(0, 0.7 + 0.3 * pulse);
  const r = Math.min(255, base[0] * (0.45 + 0.55 * p) * glow);
  const g = Math.min(255, base[1] * (0.45 + 0.55 * p) * glow);
  const b = Math.min(255, base[2] * (0.45 + 0.55 * p) * glow);
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

// Draw one GPU. x,y = center. s = scale. t = time (s). opts: {selected,mining,hashRate}
export function drawGPU(ctx, gpu, x, y, s = 1, t = 0, opts = {}) {
  const m = gpu.model;
  const W = 116 * s, H = 50 * s;
  const mining = !!opts.mining;

  // mining animation: gentle bob so the card "lives"
  const bob = mining ? Math.sin(t * 2.2) * 1.6 * s : Math.sin(t * 0.8) * 0.5 * s;
  const breathe = 0.5 + 0.5 * Math.sin(t * (mining ? 7 : 2));

  ctx.save();
  ctx.translate(x, y + bob);

  // ── ground glow (mining = hot) ──
  const glowR = W * (0.52 + 0.04 * breathe);
  const glow = ctx.createRadialGradient(0, H * 0.52, 2, 0, H * 0.52, glowR);
  glow.addColorStop(0, alpha(m.accent, mining ? 0.34 : 0.12));
  glow.addColorStop(1, alpha(m.accent, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(0, H * 0.52, glowR, H * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── shadow ──
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, H * 0.6, W * 0.55, H * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ══ CARD BODY ══
  const bodyY = -H * 0.56;
  // base plate (darker)
  ctx.fillStyle = darken(m.color, 20);
  rr(ctx, -W / 2 + 3 * s, bodyY + 3 * s, W - 6 * s, H, 8 * s);
  ctx.fill();
  // top shroud (metallic gradient, inspired by dark GPU shroud)
  const sh = ctx.createLinearGradient(0, bodyY, 0, bodyY + H * 0.62);
  sh.addColorStop(0, lighten(m.color, 12));
  sh.addColorStop(0.55, m.color);
  sh.addColorStop(1, darken(m.color, 30));
  ctx.fillStyle = sh;
  rr(ctx, -W / 2, bodyY, W, H * 0.62, 8 * s);
  ctx.fill();
  // edge highlight
  ctx.strokeStyle = alpha('#ffffff', 0.12);
  ctx.lineWidth = 1 * s;
  rr(ctx, -W / 2 + 1.5 * s, bodyY + 1.5 * s, W - 3 * s, H * 0.62 - 3 * s, 7 * s);
  ctx.stroke();
  // faint brushed-metal lines on shroud
  ctx.strokeStyle = alpha('#ffffff', 0.045);
  ctx.lineWidth = 1 * s;
  for (let i = 0; i < 7; i++) {
    const ly = bodyY + 5 * s + i * 4.2 * s;
    ctx.beginPath();
    ctx.moveTo(-W / 2 + 7 * s, ly);
    ctx.lineTo(W / 2 - 7 * s, ly);
    ctx.stroke();
  }

  // ── heat-sink fins across the top ──
  ctx.fillStyle = alpha('#ffffff', 0.07);
  for (let i = 0; i < 14; i++) {
    ctx.fillRect(-W / 2 + 5 * s + i * 8 * s, bodyY + 2 * s, 4 * s, 4 * s);
  }

  // ══ GLOWING LED STRIP (across the card, the signature look) ══
  const stripY = bodyY + 10 * s;
  const stripH = 7 * s;
  const stripW = W - 16 * s;
  const stripX = -W / 2 + 8 * s;
  // sweep position travels along the strip
  const sweep = mining ? (t * 0.9) % 1 : (t * 0.18) % 1;
  const stripGrad = ctx.createLinearGradient(stripX, 0, stripX + stripW, 0);
  const pulse = mining ? 0.5 + 0.5 * Math.sin(t * 6) : 0.2;
  stripGrad.addColorStop(0, ledColor(m.accent, 0.25, pulse));
  stripGrad.addColorStop(sweep, ledColor(m.accent, 1, pulse));
  stripGrad.addColorStop(1, ledColor(m.accent, 0.4, pulse));
  ctx.fillStyle = stripGrad;
  rr(ctx, stripX, stripY, stripW, stripH, 3 * s);
  ctx.fill();
  // LED glow bleed
  ctx.save();
  ctx.shadowColor = m.accent;
  ctx.shadowBlur = (mining ? 14 : 5) * s;
  ctx.fillStyle = alpha(m.accent, mining ? 0.85 : 0.5);
  rr(ctx, stripX, stripY, stripW, stripH, 3 * s);
  ctx.fill();
  ctx.restore();
  // etched model text on the LED strip (dark letters like the reference)
  ctx.fillStyle = m.led;
  ctx.font = `bold ${Math.round(5.5 * s)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(m.label, stripX + 6 * s, stripY + stripH / 2 + 0.5 * s);

  // ── fans (big, white, spinning) ──
  const fanCount = m.fans || 3;
  const fanY = bodyY + 24 * s;
  const fanR = 12.5 * s;
  const fanGap = 2 * s;
  // total width occupied by fans
  const fanTotal = fanCount * (fanR * 2 + fanGap * 2) - fanGap * 2;
  const fanStart = -fanTotal / 2 + fanR + fanGap;

  for (let i = 0; i < fanCount; i++) {
    const fx = fanStart + i * (fanR * 2 + fanGap * 2);
    const spin = mining ? t * 26 : t * 1.6;
    const dir = i % 2 ? 1 : -1;

    // RGB ring (pulses when mining)
    ctx.save();
    ctx.shadowColor = m.accent;
    ctx.shadowBlur = (mining ? 9 : 2) * s;
    ctx.strokeStyle = alpha(m.accent, 0.5 + 0.5 * breathe);
    ctx.lineWidth = 1.8 * s;
    ctx.beginPath();
    ctx.arc(fx, fanY, fanR + 1.8 * s, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // fan shroud (dark ring)
    ctx.fillStyle = '#11131a';
    ctx.beginPath();
    ctx.arc(fx, fanY, fanR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = alpha('#ffffff', 0.08);
    ctx.lineWidth = 1 * s;
    ctx.stroke();

    // spinning blades (7 translucent white blades)
    ctx.save();
    ctx.translate(fx, fanY);
    ctx.rotate(spin * dir);
    const bladeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, fanR);
    bladeGrad.addColorStop(0, alpha('#eef2f8', 0.55));
    bladeGrad.addColorStop(1, alpha('#cdd6e4', 0.85));
    ctx.fillStyle = bladeGrad;
    for (let b = 0; b < 7; b++) {
      ctx.rotate((Math.PI * 2) / 7);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(fanR * 0.42, -fanR * 0.38, fanR * 0.94, -fanR * 0.12);
      ctx.quadraticCurveTo(fanR * 0.5, 0.04, 0, 0);
      ctx.closePath();
      ctx.fill();
    }
    // motion blur disc when mining fast
    if (mining) {
      ctx.fillStyle = alpha('#c8d2e0', 0.12);
      ctx.beginPath();
      ctx.arc(0, 0, fanR * 0.86, 0, Math.PI * 2);
      ctx.fill();
    }
    // metallic hub
    const hub = ctx.createRadialGradient(-fanR * 0.25, -fanR * 0.25, 0, 0, 0, fanR * 0.34);
    hub.addColorStop(0, '#4a5568');
    hub.addColorStop(1, '#1b2027');
    ctx.fillStyle = hub;
    ctx.beginPath();
    ctx.arc(0, 0, fanR * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = alpha(m.accent, 0.8);
    ctx.lineWidth = 1.2 * s;
    ctx.beginPath();
    ctx.arc(0, 0, fanR * 0.32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // ── right bracket with screw ──
  ctx.fillStyle = '#1a1e24';
  ctx.fillRect(W / 2 - 4 * s, bodyY, 4 * s, H * 0.62);
  ctx.fillStyle = '#3a414c';
  ctx.beginPath();
  ctx.arc(W / 2 - 2 * s, bodyY + 4 * s, 1.4 * s, 0, Math.PI * 2);
  ctx.fill();

  // ── serial + status readout (top-left, under LED) ──
  ctx.fillStyle = alpha('#ffffff', 0.4);
  ctx.font = `${Math.round(5.5 * s)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(`#${gpu.serial}`, -W / 2 + 8 * s, bodyY + H * 0.4);

  // hash rate readout (top-right)
  if (opts.hashRate != null) {
    ctx.fillStyle = mining ? '#7ee787' : '#6b7280';
    ctx.font = `bold ${Math.round(6 * s)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(`${opts.hashRate} P/h`, W / 2 - 8 * s, bodyY + H * 0.4);
  }

  // ── heat shimmer (above card when mining) ──
  if (mining) {
    for (let i = 0; i < 5; i++) {
      const progress = ((t * 14 + i * 17) % 30) / 30;
      const hx = -W / 2 + 12 * s + i * 22 * s + Math.sin(t * 6 + i * 1.7) * 4 * s;
      const hy = bodyY - 4 * s - progress * 16 * s;
      ctx.globalAlpha = 0.35 * (1 - progress);
      ctx.fillStyle = m.accent;
      ctx.beginPath();
      ctx.arc(hx, hy, 1.5 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ── PONS pool badge ──
  ctx.fillStyle = '#0c0e12';
  rr(ctx, W / 2 - 36 * s, H * 0.24, 36 * s, 11 * s, 3 * s);
  ctx.fill();
  ctx.strokeStyle = m.accent;
  ctx.lineWidth = 1 * s;
  rr(ctx, W / 2 - 36 * s, H * 0.24, 36 * s, 11 * s, 3 * s);
  ctx.stroke();
  ctx.fillStyle = lighten(m.accent, 60);
  ctx.font = `bold ${Math.round(6.5 * s)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PONS', W / 2 - 18 * s, H * 0.3);

  // ── selection ring ──
  if (opts.selected) {
    ctx.strokeStyle = '#ffd257';
    ctx.lineWidth = 2 * s;
    ctx.setLineDash([6 * s, 4 * s]);
    ctx.lineDashOffset = -t * 24;
    rr(ctx, -W / 2 - 9 * s, bodyY - 7 * s, W + 18 * s, H * 0.74, 12 * s);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,210,87,0.85)';
    ctx.font = `bold ${Math.round(7 * s)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('▲ SELECTED', 0, bodyY - 9 * s);
  }

  ctx.restore();
}
