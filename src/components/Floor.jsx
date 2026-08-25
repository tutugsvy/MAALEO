// ─── PONSMINER · Floor — GPU mining rigs, rendered as real DOM elements ────
// CSS 3D shroud + conic-gradient fans that genuinely spin + LED strip glow.
// Jauh lebih realistik daripada canvas path-drawing.
import { TOKEN } from '../game/config.js';
import { perGpuPerHour } from '../game/state.js';

const MODEL_FAN_COUNT = { RTX4080: 3, RTX4090: 3, A100: 2, H100: 2, B200: 3 };

export default function Floor({ state, selectedId, onSelect }) {
  const rate = perGpuPerHour(state);
  const gpus = state.gpus || [];

  return (
    <div className="floor">
      <div className="floor-head">
        <span className="floor-title">MINING FLOOR</span>
        <span className="floor-live"><i className="live-dot" /> LIVE · {state.totalGpuCount} GPU · {rate.toFixed(2)} P/h each</span>
      </div>

      {gpus.length === 0 ? (
        <div className="floor-empty">
          <div className="floor-empty-icon">⬡</div>
          <div className="floor-empty-text">
            <b>NO GPU YET</b>
            <span>connect wallet → buy a GPU</span>
          </div>
        </div>
      ) : (
        <div className="floor-rack">
          {gpus.map((g, i) => (
            <GpuCard
              key={g.id}
              gpu={g}
              index={i}
              rate={rate}
              selected={g.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      <div className="floor-foot">
        SHARED RATE — MORE BUYERS, MORE SPLIT · pool {TOKEN.poolPerHour} PONS/h
      </div>
    </div>
  );
}

function GpuCard({ gpu, index, rate, selected, onSelect }) {
  const m = gpu.model;
  const fans = m.fans || MODEL_FAN_COUNT[m.id] || 3;

  return (
    <div
      className={`gpu ${selected ? 'gpu-selected' : ''}`}
      style={{ '--accent': m.accent, '--accent-dim': m.accent + '55' }}
      onClick={() => onSelect(gpu.id)}
      title={`${m.label} · #${gpu.serial}`}
    >
      <div className="gpu-top">
        <span className="gpu-brand">PONSMINER</span>
        <span className="gpu-model">{m.label}</span>
      </div>

      {/* glowing LED strip — animated gradient + sweep */}
      <div className="gpu-led">
        <span className="gpu-led-text">{m.label}</span>
      </div>

      {/* spinning fans */}
      <div className="gpu-fans" style={{ '--fans': fans }}>
        {Array.from({ length: fans }).map((_, i) => (
          <div className="fan" key={i}>
            <div className="fan-blades" style={{ animationDuration: `${0.5 + (i % 3) * 0.06}s` }} />
            <div className="fan-hub" />
            <div className="fan-ring" />
          </div>
        ))}
      </div>

      <div className="gpu-bottom">
        <span className="gpu-serial">#{gpu.serial}</span>
        <span className="gpu-rate">{rate.toFixed(2)} P/h</span>
      </div>

      {selected && <div className="gpu-sel-badge">▲ SELECTED</div>}
    </div>
  );
}
