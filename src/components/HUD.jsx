// ─── MINEBROKER · Top HUD — fuel, cash, shift clock, market ────────────────
import { useEffect, useState } from 'react';
import { SHIFTS, TICKERS, SHIFT_COST } from '../game/config.js';

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

  const market = TICKERS.map(t => ({
    ...t,
    move: ((Math.sin(now / 60000 + TICKERS.indexOf(t)) * 2.5) + (Math.cos(now / 90000 + TICKERS.indexOf(t)) * 1.5)).toFixed(2),
  }));

  return (
    <header className="hud">
      <div className="hud-brand">
        <img src="/assets/logo.svg" alt="MINEBROKER" className="hud-logo" />
        <div>
          <div className="hud-title">MINEBROKER</div>
          <div className="hud-tag">mining game · robinhood chain</div>
        </div>
      </div>

      <div className="hud-stats">
        <StatBox label="FUEL" value={state.fuel.toFixed(2)} accent="#ffd257" />
        <StatBox label="CASH" value={'$' + state.cash.toFixed(2)} accent="#7ee787" />
        <StatBox label="BAYS" value={`${state.machines.length}/${state.bays}`} />
        <StatBox label="SHIFT" value={currentShift.short} sub={`next in ${hoursUntil}h`} accent="#8fd3ff" />
      </div>

      <div className="hud-market">
        {market.map(m => (
          <div className="mkt-tick" key={m.symbol}>
            <span className="mkt-sym">{m.symbol}</span>
            <span className="mkt-price">${m.price.toFixed(2)}</span>
            <span className={m.move >= 0 ? 'mkt-up' : 'mkt-down'}>{m.move >= 0 ? '▲' : '▼'} {Math.abs(m.move)}%</span>
          </div>
        ))}
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
