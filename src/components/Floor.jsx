// ─── PONSMINER · Floor — GPU mining rigs on the floor (animated) ───────────
import { useEffect, useRef, useState } from 'react';
import { drawGPU } from '../game/sprite.js';
import { perGpuPerHour } from '../game/state.js';

export default function Floor({ state, selectedId, onSelect }) {
  const canvasRef = useRef(null);
  const [hoverId, setHoverId] = useState(null);
  const animRef = useRef(null);
  const rate = perGpuPerHour(state);

  // main render loop (always animating — fans spin)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const start = performance.now();

    const draw = () => {
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, W, H);

      // ── background: dark mine with racks ──
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0a0c10');
      bg.addColorStop(1, '#120f08');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // vertical rack beams
      ctx.strokeStyle = 'rgba(43,48,64,0.5)';
      ctx.lineWidth = 4;
      for (let i = 1; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo((W / 8) * i, 0);
        ctx.lineTo((W / 8) * i, H);
        ctx.stroke();
      }

      // floor line
      ctx.strokeStyle = 'rgba(255,190,80,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.7);
      ctx.lineTo(W, H * 0.7);
      ctx.stroke();

      // pool status
      ctx.fillStyle = '#8b95a5';
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`POOL · ${state.totalGpuCount} GPU · ${rate.toFixed(2)} P/h each`, 14, H - 26);
      ctx.fillStyle = 'rgba(139,149,165,0.5)';
      ctx.fillText('SHARED RATE — MORE BUYERS, MORE SPLIT', 14, H - 12);

      // ── GPUs (big, animated) ──
      const spacing = W / (Math.max(state.gpus.length, 1) + 1);
      state.gpus.forEach((g, i) => {
        const x = spacing * (i + 1);
        const y = H * 0.58;
        const sel = g.id === selectedId || g.id === hoverId;
        drawGPU(ctx, g, x, y, 1.5, t, {
          selected: sel,
          mining: true,
          hashRate: rate,
        });
      });

      // empty slot hint
      if (state.gpus.length === 0) {
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = 'rgba(255,210,87,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(W / 2 - 130, H * 0.58 - 70, 260, 118);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(255,210,87,0.85)';
        ctx.font = "bold 16px 'JetBrains Mono', monospace";
        ctx.textAlign = 'center';
        ctx.fillText('NO GPU YET', W / 2, H * 0.58 + 66);
        ctx.fillStyle = 'rgba(255,210,87,0.5)';
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText('connect wallet → buy a GPU', W / 2, H * 0.58 + 86);
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [state.gpus, state.totalGpuCount, selectedId, hoverId, rate]);

  // click → nearest GPU
  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const scale = rect.width / canvasRef.current.width;
    const canvasX = px / scale;
    const spacing = canvasRef.current.width / (Math.max(state.gpus.length, 1) + 1);
    let best = null, bestDist = 90;
    state.gpus.forEach((g, i) => {
      const d = Math.abs(canvasX - spacing * (i + 1));
      if (d < bestDist) { bestDist = d; best = g.id; }
    });
    if (best) onSelect(best);
  }

  return (
    <div className="floor-wrap">
      <canvas
        ref={canvasRef}
        width={960}
        height={400}
        className="floor-canvas"
        onClick={handleClick}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = e.clientX - rect.left;
          const scale = rect.width / canvasRef.current.width;
          const canvasX = px / scale;
          const spacing = canvasRef.current.width / (Math.max(state.gpus.length, 1) + 1);
          let best = null, bestDist = 90;
          state.gpus.forEach((g, i) => {
            const d = Math.abs(canvasX - spacing * (i + 1));
            if (d < bestDist) { bestDist = d; best = g.id; }
          });
          setHoverId(best);
        }}
      />
    </div>
  );
}
