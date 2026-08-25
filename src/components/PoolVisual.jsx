// ─── PONSMINER · Dividend pool visual — tokens flowing into the pool ───────
// Replace the old GPU rig: this is a hold-to-earn dividend pool, not a GPU
// mining game. Concentric pool rings, PONSMINER flowing in, PONS + stock out.
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
          <span className="pv-core-t">POOL</span>
          <span className="pv-core-s">PONS + STOCK</span>
        </div>
      </div>
      {/* inflows */}
      <span className="pv-chip pv-chip--in1">PONSMINER ▲</span>
      <span className="pv-chip pv-chip--in2">WETH ▲</span>
      {/* outflows (rewards) */}
      <span className="pv-chip pv-chip--out1">PONS ▼</span>
      <span className="pv-chip pv-chip--out2">NVDA ▼</span>
      <span className="pv-chip pv-chip--out3">COIN ▼</span>
    </div>
  );
}