// ─── PONSMINER · Fee-share visual — swaps in, holders earn ─────────────────
// Concentric rings: fees flow in from every swap, split pro-rata to holders.
// No GPU, no claim — automatic by the launchpad distributor.
export default function PoolVisual() {
  return (
    <div className="pv">
      {/* outer glow */}
      <div className="pv-glow" />
      {/* pool rings */}
      <div className="pv-rings">
        <div className="pv-ring pv-ring--out" />
        <div className="pv-ring pv-ring--mid" />
        <div className="pv-ring pv-ring--in" />
        <div className="pv-core">
          <span className="pv-core-t">FEE SHARE</span>
          <span className="pv-core-s">PONSMINER + WETH</span>
        </div>
      </div>
      {/* inflows: every swap pays fees */}
      <span className="pv-chip pv-chip--in1">SWAPS ▲</span>
      <span className="pv-chip pv-chip--in2">TRADERS ▲</span>
      {/* outflows: fees pushed to holders */}
      <span className="pv-chip pv-chip--out1">HOLDERS ▼</span>
      <span className="pv-chip pv-chip--out2">PRO-RATA ▼</span>
      <span className="pv-chip pv-chip--out3">AUTO ▼</span>
    </div>
  );
}