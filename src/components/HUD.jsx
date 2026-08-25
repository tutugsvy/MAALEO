// ─── PONSMINER · Top HUD — PAY, PONS, wallet connect, pool rate ────────────
import { useEffect, useState } from 'react';
import { TOKEN, PAY_TOKEN, TREASURY } from '../game/config.js';
import { perGpuPerHour } from '../game/state.js';
import { getChainInfo, hasInjectedWallet } from '../game/wallet.js';
import logoUrl from '../assets/logo-v2.jpg';

export default function HUD({ state, onAction }) {
  const [now, setNow] = useState(Date.now());
  const [chain, setChain] = useState(() => getChainInfo());
  useEffect(() => {
    const iv = setInterval(() => { setNow(Date.now()); setChain(getChainInfo()); }, 2000);
    return () => clearInterval(iv);
  }, []);

  const rate = perGpuPerHour(state);
  const gpuCount = state.totalGpuCount || state.gpus.length;
  const injected = hasInjectedWallet();

  return (
    <header className="hud">
      <div className="hud-brand">
        <img src={logoUrl} alt="PONSMINER" className="hud-logo" />
        <div>
          <div className="hud-title">PONSMINER</div>
          <div className="hud-tag">gpu mining · robinhood chain</div>
        </div>
      </div>

      <div className="hud-stats">
        <StatBox label={PAY_TOKEN.symbol + ' BALANCE'} value={Math.floor(state.pay).toLocaleString()} accent="#ffd257" />
        <StatBox label="PONS MINED" value={state.pons.toFixed(4)} accent="#7ee787" />
        <StatBox label="MY GPU" value={state.gpus.length} />
        <StatBox label="FLOOR GPU" value={gpuCount} />
        <StatBox label="RATE / GPU" value={rate.toFixed(2) + ' P/h'} sub={`pool ${TOKEN.poolPerHour} P/h ÷ ${gpuCount}`} accent="#8fd3ff" />
      </div>

      <div className="hud-actions">
        {state.wallet ? (
          <button className="btn btn-gold" title="Klik untuk disconnect" onClick={() => onAction('disconnect')}>
            <span className="wallet-dot" /> {shortAddr(state.wallet)}
            {chain.chainId && <span className="chain-badge">{chain.name}</span>}
          </button>
        ) : (
          <button className="btn btn-gold" onClick={() => onAction('connect')} title={injected ? 'Konek ke injected wallet' : 'Belum ada injected wallet terdeteksi'}>
            ⚡ CONNECT WALLET
          </button>
        )}
        <button className="btn btn-ghost" onClick={() => onAction('open-shop')}>BUY GPU</button>
        <button className="btn btn-ghost" onClick={() => onAction('open-rules')}>?</button>
      </div>
    </header>
  );
}

function shortAddr(a) {
  if (!a) return '';
  return a.slice(0, 6) + '…' + a.slice(-4);
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
