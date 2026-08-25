// ─── MINEBROKER · Floor — the mine floor where rigs dig ─────────────────────
import { useEffect, useRef, useState } from 'react';
import { drawMachine } from '../game/sprite.js';
import { SHIFTS } from '../game/config.js';

export default function Floor({ state, selectedId, onSelect, floorBusy }) {
  const canvasRef = useRef(null);
  const [hoverId, setHoverId] = useState(null);
  const animRef = useRef(null);

  // main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const start = performance.now();

    const draw = () => {
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, W, H);

      // ── background: dark rock + ore glow ──
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0a0c10');
      bg.addColorStop(1, '#141008');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ore veins (static, subtle)
      ctx.strokeStyle = 'rgba(255,170,60,0.18)';
      ctx.lineWidth = 2;
      for (let v = 0; v < 8; v++) {
        ctx.beginPath();
        let vx = ((v * 211) % W), vy = 30 + ((v * 97) % (H - 60));
        ctx.moveTo(vx, vy);
        for (let i = 0; i < 6; i++) {
          vx += 22 + ((v * 13 + i * 7) % 30);
          vy += ((v + i) % 2 ? 18 : -14);
          ctx.lineTo(vx, vy);
        }
        ctx.stroke();
      }

      // floor line
      ctx.strokeStyle = 'rgba(255,190,80,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.72);
      ctx.lineTo(W, H * 0.72);
      ctx.stroke();

      // floor busy indicator
      const busyPct = Math.round((floorBusy || 0.5) * 100);
      ctx.fillStyle = '#8b95a5';
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`FLOOR BUSY · ${busyPct}%`, 14, H - 26);

      // ── machines ──
      const spacing = W / (state.bays + 1);
      state.machines.forEach((m, i) => {
        const x = spacing * (i + 1);
        const y = H * 0.62;
        const sel = m.id === selectedId || m.id === hoverId;
        const digging = m.shiftBought.size > 0;
        drawMachine(ctx, m, x, y, 1.15, t, { selected: sel, digging });
      });

      // empty bay slot hint
      if (state.machines.length < state.bays) {
        const x = spacing * (state.machines.length + 1);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(139,149,165,0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.rect(x - 52, H * 0.62 - 32, 104, 58);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(139,149,165,0.6)';
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.textAlign = 'center';
        ctx.fillText('EMPTY BAY', x, H * 0.62 + 44);
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [state.machines, state.bays, selectedId, hoverId, floorBusy]);

  // click → nearest machine
  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const scale = rect.width / canvasRef.current.width;
    const canvasX = px / scale;
    const spacing = canvasRef.current.width / (state.bays + 1);
    let best = null, bestDist = 90;
    state.machines.forEach((m, i) => {
      const mx = spacing * (i + 1);
      const d = Math.abs(canvasX - mx);
      if (d < bestDist) { bestDist = d; best = m.id; }
    });
    if (best) onSelect(best);
  }

  return (
    <div className="floor-wrap">
      <canvas
        ref={canvasRef}
        width={960}
        height={340}
        className="floor-canvas"
        onClick={handleClick}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = e.clientX - rect.left;
          const scale = rect.width / canvasRef.current.width;
          const canvasX = px / scale;
          const spacing = canvasRef.current.width / (state.bays + 1);
          let best = null, bestDist = 90;
          state.machines.forEach((m, i) => {
            const d = Math.abs(canvasX - spacing * (i + 1));
            if (d < bestDist) { bestDist = d; best = m.id; }
          });
          setHoverId(best);
        }}
      />
    </div>
  );
}
