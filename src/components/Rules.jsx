// ─── PONSMINER · Rules modal — how the game works ──────────────────────────
import { TOKEN } from '../game/config.js';

export default function Rules({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal rules" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>HOW IT WORKS</h2>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>
        <ol className="rules-list">
          <li><b>You run a mine.</b> Machines on the floor dig ore, but only on shifts you bought for them.</li>
          <li><b>Four shifts a day</b>, fixed UTC: 00-06, 06-12, 12-18, 18-24. Buy one, or three ahead so the floor works while the tab is shut.</li>
          <li><b>Every two minutes</b> a shift settles. Everything dug on the floor goes into one pool, split by how much ore each rig pulled.</li>
          <li><b>PONSMINER pays a determined amount of $PONS</b> — {TOKEN.emissionPerSettle} PONS per settle, fixed and readable. No hidden supply, no games. Your cut = your ore share of the pool.</li>
          <li><b>The sprite is the token.</b> Chassis finish = habit, stacks = appetite, wear = seam. You can read a rig's character at a glance.</li>
          <li><b>Merge to climb.</b> Two of the same tier pressed together make the next tier — the child inherits traits, so which pair you press is the decision.</li>
          <li><b>Every upside carries a downside.</b> Greedy digs more but burns more. Off-seam digs 10% worse. Tier is the one thing nothing rolls.</li>
          <li><b>The floor improves too.</b> Stand still and you pay to dig. Merge to stay ahead of the baseline.</li>
        </ol>
        <div className="hint-box">
          <b>Prototype honesty:</b> play money only. No wallet, no live token, no chain. The concept is the whole of it — every number on screen you can check.
        </div>
      </div>
    </div>
  );
}
