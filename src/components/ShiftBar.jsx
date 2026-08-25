// ─── MINEBROKER · Shift bar — buy shifts for the floor ─────────────────────
import { SHIFTS, SHIFT_COST } from '../game/config.js';

export default function ShiftBar({ state, onAction }) {
  const now = Date.now();
  const hour = new Date(now).getUTCHours();
  const current = SHIFTS.find(s => hour >= s.utcStart && hour < s.utcEnd) || SHIFTS[3];

  return (
    <section className="shift-bar">
      <div className="shift-bar-title">
        <h2>SHIFTS · 4 A DAY</h2>
        <span className="muted">fix UTC blocks · rig digs only bought shifts</span>
      </div>
      <div className="shift-list">
        {SHIFTS.map(s => {
          const st = state.shiftState.find(x => x.id === s.id);
          const isCurrent = s.id === current.id;
          const busy = Math.round((s.busyBoost + 0.5) * 100);
          return (
            <div className={`shift-card ${isCurrent ? 'current' : ''}`} key={s.id}>
              <div className="shift-top">
                <span className={`shift-dot ${st?.bought ? 'on' : ''}`} />
                <span className="shift-time">{s.label}</span>
                {isCurrent && <span className="shift-now">NOW</span>}
              </div>
              <div className="shift-busy">busy {busy}%</div>
              <div className="shift-desc">{s.desc}</div>
              {st?.bought ? (
                <div className="shift-owned">
                  <span className="ok">✓ BOUGHT</span>
                  <span className="muted small">pays ore every 2 min</span>
                </div>
              ) : (
                <button className="btn btn-sm" onClick={() => onAction('buy-shift', s.id)}>
                  BUY ${SHIFT_COST.toFixed(2)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
