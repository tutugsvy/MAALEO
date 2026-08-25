// ─── PONSMINER v2 · Dividend pool — multi-reward ───────────────────────────
// Hold PONSMINER → pool pays PONS + tokenized stock (NVDA, COIN, MSFT…) pro-rata.
// Reads real on-chain state: your share, pool balance per reward token, pending.
import { useEffect, useState } from 'react';
import { TOKEN, DIVIDEND_STATUS, EXPLORER_URL } from '../game/config.js';
import { tokenBalance, tokenTotalSupply, pendingReward, poolBalance, fmtBig, sendClaim } from '../game/rpc.js';

const POOL = DIVIDEND_STATUS.poolContract;
const STAKED = TOKEN.contractAddress; // PONSMINER CA (sama dengan stakedToken di contract)
const REWARDS = DIVIDEND_STATUS.rewardTokens;

export default function DividendPool({ account, provider }) {
  const [share, setShare] = useState(null);          // {balance, supply, pct}
  const [pools, setPools] = useState(null);           // [{symbol, amount}]
  const [pending, setPending] = useState(null);       // [{symbol, amount}]
  const [busy, setBusy] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const short = a => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : null);

  // live share = real PONSMINER balance / real totalSupply
  useEffect(() => {
    let alive = true;
    if (!account || !STAKED) { setShare(null); return; }
    (async () => {
      try {
        const [bal, sup] = await Promise.all([
          tokenBalance(STAKED, account),
          tokenTotalSupply(STAKED),
        ]);
        if (!alive) return;
        const pct = sup > 0n ? (Number(bal) / Number(sup)) * 100 : 0;
        setShare({ balance: bal, supply: sup, pct });
      } catch { setShare(null); }
    })();
    return () => { alive = false; };
  }, [account]);

  // live pool balances per reward token
  useEffect(() => {
    let alive = true;
    if (!POOL) { setPools(null); return; }
    (async () => {
      try {
        const results = await Promise.all(
          REWARDS.map(r => poolBalance(POOL, r.token)
            .then(v => ({ symbol: r.symbol, amount: v }))
            .catch(() => ({ symbol: r.symbol, amount: 0n })))
        );
        if (alive) setPools(results);
      } catch { setPools(null); }
    })();
    return () => { alive = false; };
  }, [account]);

  // live pending per reward token
  useEffect(() => {
    let alive = true;
    if (!POOL || !account) { setPending(null); return; }
    (async () => {
      try {
        const results = await Promise.all(
          REWARDS.map(r => pendingReward(POOL, account, r.token)
            .then(v => ({ symbol: r.symbol, amount: v }))
            .catch(() => ({ symbol: r.symbol, amount: 0n })))
        );
        if (alive) setPending(results);
      } catch { setPending(null); }
    })();
    return () => { alive = false; };
  }, [account]);

  const handleClaim = async () => {
    if (!POOL || !provider) { setTxHash('Claim unavailable — pool contract not deployed yet.'); return; }
    setBusy(true); setTxHash(null);
    try {
      const tx = await sendClaim(provider, POOL);
      setTxHash(`${EXPLORER_URL}/tx/${tx}`);
    } catch (e) {
      setTxHash((e && e.message) || 'Claim failed');
    } finally {
      setBusy(false);
    }
  };

  const pctText = share ? share.pct.toFixed(4) + '%' : (account ? '—' : '0.00%');
  const balanceText = share ? fmtBig(share.balance) : (account ? '—' : '0.0000');

  return (
    <section className="pool" id="pool">
      <div className="pool-head">
        <h2 className="pool-title"><span className="pool-mark">◆</span> THE POOL</h2>
        <span className="pool-status live">● LIVE</span>
      </div>

      <div className="pool-grid">
        {REWARDS.map(r => (
          <div className="pool-card pool-card--reward" key={r.symbol}>
            <span className="pool-label">{r.symbol} IN POOL</span>
            <span className="pool-value">
              {pools ? pools.find(p => p.symbol === r.symbol)?.amount !== undefined
                ? fmtBig(pools.find(p => p.symbol === r.symbol).amount, 18, 4 + (r.symbol === 'PONS' ? 0 : 4))
                : '—'
               : '0.0000'}
            </span>
            <span className="pool-note">
              {pending
                ? pending.find(p => p.symbol === r.symbol)?.amount > 0n
                  ? `you have ${fmtBig(pending.find(p => p.symbol === r.symbol).amount)} pending`
                  : 'no pending rewards'
                : account ? '—' : 'connect wallet'}
            </span>
          </div>
        ))}
        <div className="pool-card pool-card--share">
          <span className="pool-label">YOUR SHARE</span>
          <span className="pool-value">{pctText}</span>
          <span className="pool-note">
            {account
              ? `${balanceText} PONSMINER · ${short(account)}`
              : 'connect wallet to see your share'}
          </span>
        </div>
      </div>

      <div className="pool-cta">
        <button className="pool-claim" disabled={busy} onClick={handleClaim}>
          {busy ? 'CLAIMING…' : 'CLAIM DIVIDENDS'}
        </button>
        <p className="pool-hint">
          Your share = your PONSMINER balance ÷ total supply × pool. Claimed as PONS + tokenized stock.
        </p>
        {txHash && (
          <p className={`pool-result ${txHash.startsWith('http') ? 'ok' : 'err'}`}>
            {txHash.startsWith('http')
              ? <a href={txHash} target="_blank" rel="noopener noreferrer">View transaction ↗</a>
              : txHash}
          </p>
        )}
      </div>
    </section>
  );
}