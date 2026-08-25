// ─── PONSMINER · Side panel — selected machine detail + actions ────────────
import { SHIFTS, TIERS } from '../game/config.js';

export default function MachinePanel({ machine, state, onAction }) {
  if (!machine) {
    return (
      <aside className="panel machine-panel empty">
        <h2>MACHINE</h2>
        <p className="muted">Pick a rig on the floor to inspect it.</p>
        <div className="hint-box">
          <b>Bays:</b> {state.machines.length}/{state.bays}
        </div>
      </aside>
    );
  }
  const tier = TIERS[machine.tier];
  const ownedShifts = state.shiftState.filter(s => machine.shiftBought.has(s.id));

  return (
    <aside className="panel machine-panel">
      <div className="panel-title-row">
        <h2>MACHINE</h2>
        <span className={`tier-badge t${machine.tier}`}>{tier.name}</span>
      </div>

      <div className="machine-stats">
        <Stat label="HABIT" value={machine.habit.label} sub={machine.habit.desc} color={machine.habit.color} />
        <Stat label="APPETITE" value={machine.appetite.label} sub={machine.appetite.desc} color={machine.appetite.color} />
        <Stat label="SEAM" value={machine.seam.label} sub={machine.seam.desc} color={machine.seam.color} />
        <Stat label="ORE EARNED" value={Math.round(machine.ore).toLocaleString()} sub="all-time register" />
        <Stat label="MINES" value="PONS POOL" sub="fixed emission · split by ore share" color="#ffd257" />
      </div>

      <div className="shift-row">
        <label>SHIFTS BOUGHT</label>
        <div className="shift-chips">
          {SHIFTS.map(s => {
            const on = machine.shiftBought.has(s.id);
            return (
              <button
                key={s.id}
                className={`chip ${on ? 'on' : ''}`}
                title={s.desc}
                onClick={() => onAction('toggle-shift', machine.id, s.id)}
              >
                {s.short}
              </button>
            );
          })}
        </div>
        <p className="muted small">{ownedShifts.length} of 4 shifts · rig digs only bought shifts</p>
      </div>

      <div className="merge-row">
        <button className="btn btn-ghost" onClick={() => onAction('select-merge-target', machine.id)}>
          PICK AS MERGE PAIR
        </button>
      </div>

      <div className="hint-box">
        <b>Dig math:</b> tier × habit × appetite × seam vs the floor. Merge two of the same tier to climb. Tier is the one thing nothing rolls.
      </div>
    </aside>
  );
}

function Stat({ label, value, sub, color }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: color || 'inherit' }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
