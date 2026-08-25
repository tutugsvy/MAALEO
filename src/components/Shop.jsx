// ─── PONSMINER · Shop modal — buy GPUs, treasury info ──────────────────────
import { GPU_COST, MAX_GPU_PER_WALLET, PAY_TOKEN, TOKEN, TREASURY } from '../game/config.js';

export default function Shop({ state, onAction, onClose }) {
  const canBuy = state.pay >= GPU_COST && state.gpus.length < MAX_GPU_PER_WALLET;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal shop" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>BUY A GPU</h2>
          <button className="btn btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="shop-grid">
          <div className="shop-card">
            <div className="shop-card-title">1× GPU MINER</div>
            <p className="muted small">
              {GPU_COST.toLocaleString()} {PAY_TOKEN.symbol} per GPU. Payment goes straight to the treasury.
            </p>
            <div className="shop-price">
              <span className="muted small">Treasury:</span>
              <code className="treasury-addr">{TREASURY}</code>
            </div>
            <button className="btn btn-gold" disabled={!canBuy} onClick={() => onAction('buy-gpu')}>
              BUY · {GPU_COST.toLocaleString()} {PAY_TOKEN.symbol}
            </button>
            {!canBuy && state.pay < GPU_COST && (
              <p className="muted small" style={{ marginTop: 6 }}>Not enough {PAY_TOKEN.symbol}</p>
            )}
            {!canBuy && state.gpus.length >= MAX_GPU_PER_WALLET && (
              <p className="muted small" style={{ marginTop: 6 }}>Max {MAX_GPU_PER_WALLET} GPU per wallet</p>
            )}
          </div>

          <div className="shop-card">
            <div className="shop-card-title">POOL RATE</div>
            <p className="muted small">
              The pool pays <b className="text-bright">{TOKEN.poolPerHour} PONS/hour</b> total.
            </p>
            <div className="shop-price">
              <span className="muted small">Your cut:</span>
              <span className="text-bright">{(TOKEN.poolPerHour / Math.max(state.totalGpuCount, 1)).toFixed(2)} P/h ÷ {state.totalGpuCount || 0} GPU</span>
            </div>
            <p className="muted small" style={{ marginTop: 6 }}>Divided equally among every GPU owner. More buyers = more split.</p>
          </div>
        </div>

        <div className="hint-box">
          <b>Prototype:</b> play {PAY_TOKEN.symbol} only. The real game: wallet pays {PAY_TOKEN.symbol} → treasury (<code>{shortAddr(TREASURY)}</code>), then your GPU accrues its share of {TOKEN.poolPerHour} PONS/hour.
        </div>
      </div>
    </div>
  );
}

function shortAddr(a) {
  if (!a || a === '0x0000000000000000000000000000000000000000') return 'set in config';
  return a.slice(0, 6) + '…' + a.slice(-4);
}
