// ─── MINEBROKER · Rules modal — how the game works ─────────────────────────
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
          <li><b>The sprite is the token.</b> Chassis finish = habit, stacks = appetite, wear = seam. You can read a rig's character at a glance.</li>
          <li><b>Merge to climb.</b> Two of the same tier pressed together make the next tier — the child inherits traits, so which pair you press is the decision.</li>
          <li><b>Every upside carries a downside.</b> Greedy digs more but burns more. Off-seam digs 10% worse. Tier is the one thing nothing rolls.</li>
          <li><b>The bar keeps score.</b> A tier-I rig returns about $6 per $1 of fuel at launch, tapering toward $1.30 as the mine matures. The floor improves too — stand still and you pay to dig.</li>
          <li><b>Ore settles as real tokenized stock.</b> In the prototype it's play money. On chain, it's stock tokens you can hold or sell.</li>
        </ol>
        <div className="hint-box">
          <b>Prototype honesty:</b> play money only. No wallet, no token, no live stock. The concept is the whole of it — every number on screen you can check.
        </div>
      </div>
    </div>
  );
}
