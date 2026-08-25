// ─── PONSMINER · Rules modal — how GPU mining works ────────────────────────
import { GPU_COST, PAY_TOKEN, TOKEN, TREASURY, MAX_GPU_PER_WALLET } from '../game/config.js';

export default function Rules({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal rules" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>HOW IT WORKS</h2>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>
        <ol className="rules-list">
          <li><b>Connect your wallet.</b> PONSMINER runs on Robinhood Chain — your wallet is your mine.</li>
          <li><b>Buy a GPU</b> for {GPU_COST.toLocaleString()} {PAY_TOKEN.symbol}. Payment goes to the treasury (<code>{TREASURY}</code>).</li>
          <li><b>The pool pays a determined amount:</b> {TOKEN.poolPerHour} PONS per hour, total.</li>
          <li><b>It's split equally.</b> Your rate = {TOKEN.poolPerHour} ÷ total GPUs on the floor. More buyers, more split — that's the deal, and it's readable.</li>
          <li><b>Your GPU mines continuously.</b> Accrual ticks every minute. Mine while you sleep.</li>
          <li><b>Max {MAX_GPU_PER_WALLET} GPUs per wallet.</b> The floor grows, the rate shrinks.</li>
          <li><b>The sprite is the card.</b> Fans spin, LEDs glow, heat shimmers — you can see your rig working.</li>
        </ol>
        <div className="hint-box">
          <b>Prototype honesty:</b> play {PAY_TOKEN.symbol} only. No live token yet — the {PAY_TOKEN.symbol} contract and treasury address get filled in when you deploy. The math on screen is the math that goes on chain.
        </div>
      </div>
    </div>
  );
}
