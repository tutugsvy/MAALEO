// ─── PONSMINER · Shop modal — buy machines, dig bays, manage store ─────────
import { MACHINE_PLAY, BAY_PLAY, FLOOR_CAPACITY } from '../game/config.js';

export default function Shop({ state, onAction, onClose }) {
  const canBuy = state.fuel >= MACHINE_PLAY;
  const canDig = state.fuel >= BAY_PLAY && state.bays < 12;
  const storeMachines = state.owned;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal shop" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>THE STORE</h2>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="shop-grid">
          <div className="shop-card">
            <div className="shop-card-title">BUY A MACHINE</div>
            <p className="muted small">Fresh tier-I rig. Traits roll at purchase. Sprite shows its character.</p>
            <button className="btn btn-gold" disabled={!canBuy} onClick={() => onAction('buy-machine')}>
              BUY · {MACHINE_PLAY} PONS
            </button>
          </div>

          <div className="shop-card">
            <div className="shop-card-title">DIG ANOTHER BAY</div>
            <p className="muted small">Machines never shrink to fit — the floor grows instead. {state.bays}/{FLOOR_CAPACITY} bays.</p>
            <button className="btn btn-gold" disabled={!canDig} onClick={() => onAction('dig-bay')}>
              DIG BAY · {BAY_PLAY} PONS
            </button>
          </div>
        </div>

        {storeMachines.length > 0 && (
          <div className="store-list">
            <div className="store-list-title">IN STORE · NO BAY YET</div>
            {storeMachines.map(m => (
              <div className="store-row" key={m.id}>
                <span className="tier-badge t{m.tier}">T{m.tier}</span>
                <span>{m.habit.label} · {m.appetite.label} · {m.seam.label}</span>
                <button
                  className="btn btn-sm"
                  disabled={state.machines.length >= state.bays}
                  onClick={() => onAction('place-machine', m.id)}
                >
                  {state.machines.length >= state.bays ? 'NO BAY' : 'PLACE'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="hint-box">
          <b>Prototype:</b> everything here is play money. The real game pays a fixed, determined amount of $PONS per settle — and needs live game contracts.
        </div>
      </div>
    </div>
  );
}
