// ─── PONSMINER v2 · Dividend pool — hold PONS, earn PONS + stock ───────────
// Reads real on-chain state: your share = PONS balance ÷ total supply.
// Pool amounts read from the RewardDistributor when deployed (config).
import { useEffect, useState } from 'react';
import { TOKEN, DIVIDEND_STATUS, EXPLORER_URL } from '../game/config.js';
import { tokenBalance, tokenTotalSupply, fmtBig, sendClaim } from '../game/rpc.js';

const POOL = DIVIDEND_STATUS.poolContract;

export default function DividendPool({ account, provider }) {
  const [share, setShare] = useState(null);      // {balance, supply, pct}
  const [poolState, setPoolState] = useState(null); // {pons, stocks} on-chain
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);        // tx hash or error string

  const short = a => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : null);

  // live share = real balance / real supply
  useEffect(() => {
    let alive = true;
    if (!account || !TOKEN.contractAddress) { setShare(null); return; }
    (async () => {
      try {
        const [bal, sup] = await Promise.all([
          tokenBalance(TOKEN.contractAddress, account),
          tokenTotalSupply(TOKEN.contractAddress),
        ]);
        if (!alive) return;
        const pct = sup > 0n ? (Number(bal) / Number(sup)) * 100 : 0;
        setShare({ balance: bal, supply: sup, pct });
      } catch { if (alive) setShare(null); }
    })();
    return () => { alive = false; };
  }, [account]);

  // live pool read (once contract is deployed)
  useEffect(() => {
    let alive = true;
    if (!POOL) { setPoolState(null); return; }
    (async () => {
      try {
        // TODO(P1): read poolPons()/poolStocks() from RewardDistributor ABI
        setPoolState({ pons: 0n, stocks: 0n });
      } catch { if (alive) setPoolState(null); }
    })();
    return () => { alive = false; };
  }, [account]);

  const handleClaim = async () => {
    if (!POOL || !provider) { setDone('Pool contract not deployed yet — claim opens when it goes live.'); return; }
    setBusy(true); setDone(null);
    try {
      const tx = await sendClaim(provider, POOL);
      setDone(`Claim submitted — ${EXPLORER_URL}/tx/${tx}`);
    } catch (e) {
      setDone((e && e.message) || 'Claim failed');
    } finally {
      setBusy(false);
    }
  };

  const pctText = share ? share.pct.toFixed(4) + '%' : (account ? '—' : '0.00%');
  const balanceText = share ? fmtBig(share.balance) : (account ? '—' : '0.0000');
  const supplyText = share ? fmtBig(share.supply, 18, 0) : (account ? '—' : '1,000,000,000');

  return (
    <section className="pool" id="pool">
      <div className="pool-head">
        <h2 className="pool-title"><span className="pool-mark">◆</span> THE POOL</h2>
        <span className="pool-status live">● LIVE</span>
      </div>

      <div className="pool-grid">
        <div className="pool-card pool-card--pons">
          <span className="pool-label">PONS IN POOL</span>
          <span className="pool-value">{poolState ? fmtBig(poolState.pons) : '0.0000'}</span>
          <span className="pool-note">every swap of {TOKEN.symbol} pays in</span>
        </div>
        <div className="pool-card pool-card--stock">
          <span className="pool-label">STOCK IN POOL</span>
          <span className="pool-value">{poolState && poolState.stocks ? fmtBig(poolState.stocks) : '0.0000'}</span>
          <span className="pool-note">tokenized NVDA · COIN · MSFT…</span>
        </div>
        <div className="pool-card pool-card--share">
          <span className="pool-label">YOUR SHARE</span>
          <span className="pool-value">{pctText}</span>
          <span className="pool-note">
            {account
              ? `${balanceText} ${TOKEN.symbol} of ${supplyText} · ${short(account)}`
              : 'connect wallet to see your share'}
          </span>
        </div>
      </div>

      <div className="pool-cta">
        <button
          className="pool-claim"
          disabled={busy}
          onClick={handleClaim}
        >
          {busy ? 'CLAIMING…' : 'CLAIM DIVIDENDS'}
        </button>
        <p className="pool-hint">
          Share = your {TOKEN.symbol} balance ÷ total supply × pool. Claimed as {TOKEN.symbol} + tokenized stock.
        </p>
        {done && (
          <p className={`pool-result ${done.startsWith('Claim submitted') ? 'ok' : 'err'}`}>
            {done.startsWith('Claim submitted')
              ? <a href={done.split(' — ')[1]} target="_blank" rel="noopener noreferrer">{done.split(' — ')[0]} — view tx ↗</a>
              : done}
          </p>
        )}
      </div>
    </section>
  );
}