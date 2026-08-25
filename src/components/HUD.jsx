// ─── PONSMINER · Top HUD — PONS, shifts, emission clock ────────────────────
import { useEffect, useState } from 'react';
import { SHIFTS, TOKEN } from '../game/config.js';

export default function HUD({ state, onAction }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const hour = new Date(now).getUTCHours();
  const currentShift = SHIFTS.find(s => hour >= s.utcStart && hour < s.utcEnd) || SHIFTS[3];
  const nextShift = SHIFTS[(SHIFTS.indexOf(currentShift) + 1) % SHIFTS.length];
  const nextStart = nextShift.utcStart;
  const hoursUntil = nextStart >= hour ? nextStart - hour : 24 - hour + nextStart;

  // countdown to next settle (2-min cycle)
  const settleCycle = 120;
  const secsInCycle = Math.floor((now / 1000) % settleCycle);
  const countdown = settleCycle - secsInCycle;

  return (
    <header className="hud">
      <div className="hud-brand">
        <img src="/assets/logo.svg" alt="PONSMINER" className="hud-logo" />
        <div>
          <div className="hud-title">PONSMINER</div>
          <div className="hud-tag">mining game · robinhood chain</div>
        </div>
      </div>

      <div className="hud-stats">
        <StatBox label="PONS" value={Math.floor(state.fuel).toLocaleString()} accent="#ffd257" />
        <StatBox label="MINED" value={state.pons.toFixed(2)} accent="#7ee787" />
        <StatBox label="BAYS" value={`${state.machines.length}/${state.bays}`} />
        <StatBox label="SHIFT" value={currentShift.short} sub={`next in ${hoursUntil}h`} accent="#8fd3ff" />
      </div>

      <div className="hud-market">
        <div className="mkt-tick">
          <span className="mkt-sym">EMISSION</span>
          <span className="mkt-price">{TOKEN.emissionPerSettle} PONS</span>
          <span className="mkt-up">per settle · fixed</span>
        </div>
        <div className="mkt-tick">
          <span className="mkt-sym">NEXT SETTLE</span>
          <span className="mkt-price">{countdown}s</span>
          <span className="mkt-up">every 2 min</span>
        </div>
      </div>

      <div className="hud-actions">
        <button className="btn btn-gold" onClick={() => onAction('open-shop')}>SHOP</button>
        <button className="btn btn-ghost" onClick={() => onAction('open-rules')}>?</button>
      </div>
    </header>
  );
}

function StatBox({ label, value, sub, accent }) {
  return (
    <div className="hud-stat">
      <div className="hud-stat-label">{label}</div>
      <div className="hud-stat-value" style={{ color: accent }}>{value}</div>
      {sub && <div className="hud-stat-sub">{sub}</div>}
    </div>
  );
}
