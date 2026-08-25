// ─── PONSMINER v2 · Dividend pool — hold PONS, earn PONS + stock ───────────
// Opsi A: RewardDistributor. Status jujur: contract P1 belum deploy → angka
// pool ditampilkan sebagai "P1 SOON" sampai poolContract terisi di config.
import { useState } from 'react';
import { TOKEN, DIVIDEND_STATUS } from '../game/config.js';

const LIVE = !!DIVIDEND_STATUS.poolContract;

export default function DividendPool({ account }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const short = a => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : null);

  const handleClaim = async () => {
    if (!LIVE || !account) return;
    setBusy(true);
    try {
      // TODO(P1): ethers call → RewardDistributor.claim()
      await new Promise(r => setTimeout(r, 1200));
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="pool" id="pool">
      <div className="pool-head">
        <h2 className="pool-title"><span className="pool-mark">◆</span> THE POOL</h2>
        <span className={`pool-status ${LIVE ? 'live' : 'soon'}`}>
          {LIVE ? '● LIVE' : '● P1 SOON'}
        </span>
      </div>

      <div className="pool-grid">
        <div className="pool-card pool-card--pons">
          <span className="pool-label">PONS IN POOL</span>
          <span className="pool-value">{LIVE ? '—' : '0.0'}</span>
          <span className="pool-note">every swap of {TOKEN.symbol} pays in</span>
        </div>
        <div className="pool-card pool-card--stock">
          <span className="pool-label">STOCK IN POOL</span>
          <span className="pool-value">{LIVE ? '—' : '0.0000'}</span>
          <span className="pool-note">tokenized NVDA · COIN · MSFT…</span>
        </div>
        <div className="pool-card pool-card--share">
          <span className="pool-label">YOUR SHARE</span>
          <span className="pool-value">{account ? '—' : '0.00%'}</span>
          <span className="pool-note">{account ? short(account) : 'connect wallet to see'}</span>
        </div>
      </div>

      <div className="pool-cta">
        <button
          className={`pool-claim ${LIVE && account ? '' : 'disabled'}`}
          disabled={!LIVE || !account || busy}
          onClick={handleClaim}
        >
          {busy ? 'CLAIMING…' : done ? '✓ CLAIMED' : LIVE ? 'CLAIM DIVIDENDS' : 'CLAIM — P1 SOON'}
        </button>
        <p className="pool-hint">
          {LIVE
            ? 'Share = your PONS balance ÷ total supply × pool. Claimed as PONS + stock.'
            : 'RewardDistributor belum deploy. Begitu contract P1 live, tombol ini aktif & angka pool real.'}
        </p>
      </div>
    </section>
  );
}