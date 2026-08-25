// ─── PONSMINER · Side panel — selected GPU detail + actions ────────────────
import { GPU_COST, MAX_GPU_PER_WALLET, TOKEN, PAY_TOKEN, TREASURY } from '../game/config.js';
import { perGpuPerHour } from '../game/state.js';

export default function GPUPanel({ gpu, state, onAction }) {
  const rate = perGpuPerHour(state);
  const canBuy = state.pay >= GPU_COST && state.gpus.length < MAX_GPU_PER_WALLET;

  return (
    <aside className="panel machine-panel">
      <div className="panel-title-row">
        <h2>YOUR FLOOR</h2>
        <span className="tier-badge">{state.gpus.length} GPU</span>
      </div>

      <div className="machine-stats">
        <Stat label="GPU COUNT" value={state.gpus.length} sub={`max ${MAX_GPU_PER_WALLET} per wallet`} />
        <Stat label="FLOOR GPU" value={state.totalGpuCount} sub="all buyers combined" />
        <Stat label="POOL RATE" value={`${TOKEN.poolPerHour} PONS/h`} sub="total, shared" color="#ffd257" />
        <Stat label="YOUR RATE" value={`${rate.toFixed(2)} P/h`} sub={`pool ÷ ${state.totalGpuCount || 1} GPU`} color="#7ee787" />
        <Stat label="PONS MINED" value={state.pons.toFixed(4)} sub="accrued every minute" color="#7ee787" />
        <Stat label="TREASURY" value={shortAddr(TREASURY)} sub={`pays ${PAY_TOKEN.symbol} → treasury`} color="#8fd3ff" />
      </div>

      <div className="bind-row">
        <button className="btn btn-gold" disabled={!canBuy} onClick={() => onAction('buy-gpu')}>
          BUY GPU · {GPU_COST.toLocaleString()} {PAY_TOKEN.symbol}
        </button>
        {!canBuy && state.pay < GPU_COST && (
          <p className="muted small" style={{ marginTop: 6 }}>Not enough {PAY_TOKEN.symbol} balance</p>
        )}
      </div>

      <div className="hint-box">
        <b>How it works:</b> buy a GPU with {PAY_TOKEN.symbol}. The pool pays <b>{TOKEN.poolPerHour} PONS per hour</b>, split equally among all GPU owners. More buyers → your rate drops. That's the deal — it's readable, not hidden.
      </div>

      {gpu && (
        <div className="gpu-detail">
          <h3>SELECTED GPU</h3>
          <div className="machine-stats">
            <Stat label="MODEL" value={gpu.model.label} sub={`#${gpu.serial}`} color={gpu.model.edge} />
            <Stat label="FANS" value={gpu.model.fans} sub="spinning" />
            <Stat label="PONS MINED" value={gpu.ponsMined.toFixed(6)} sub="this card" />
          </div>
        </div>
      )}
    </aside>
  );
}

function shortAddr(a) {
  if (!a || a === '0x0000000000000000000000000000000000000000') return 'set in config';
  return a.slice(0, 6) + '…' + a.slice(-4);
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
