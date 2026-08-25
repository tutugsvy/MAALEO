// ─── PONSMINER · Fee share — ponsfamily native distributor ─────────────────
// The launchpad distributes 100% of creator fees to holders, pro-rata, pushed
// straight to their wallets. No claim needed. With wallet connected, shows
// YOUR real share (balance ÷ total supply) read on-chain. Honest.
import { useEffect, useState } from 'react';
import { TOKEN, FEE_SHARE, NETWORK_NAME, EXPLORER_URL } from '../game/config.js';
import { tokenBalance, tokenTotalSupply, fmtBig } from '../game/rpc.js';

const STAKED = TOKEN.contractAddress; // PONSMINER CA

export default function FeeShare({ account }) {
  const [supply, setSupply] = useState(null);   // total supply (always)
  const [share, setShare] = useState(null);     // {balance, pct} when connected

  const short = a => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : null);

  // live total supply (read-only)
  useEffect(() => {
    let alive = true;
    if (!STAKED) return;
    (async () => {
      try {
        const s = await tokenTotalSupply(STAKED);
        if (alive) setSupply(s);
      } catch { /* leave null */ }
    })();
    return () => { alive = false; };
  }, []);

  // live share = real PONSMINER balance / real totalSupply
  useEffect(() => {
    let alive = true;
    if (!account || !STAKED) { setShare(null); return; }
    (async () => {
      try {
        const [bal, sup] = await Promise.all([
          tokenBalance(STAKED, account),
          supply ? Promise.resolve(supply) : tokenTotalSupply(STAKED),
        ]);
        if (!alive) return;
        const pct = sup > 0n ? (Number(bal) / Number(sup)) * 100 : 0;
        setShare({ balance: bal, pct });
      } catch { setShare(null); }
    })();
    return () => { alive = false; };
  }, [account, supply]);

  const supplyText = supply ? fmtBig(supply, TOKEN.decimals, 0) : '—';
  const pctText = share ? share.pct.toFixed(4) + '%' : (account ? '—' : '0.00%');
  const balanceText = share ? fmtBig(share.balance) : (account ? '—' : '0.0000');

  return (
    <section className="pool" id="pool">
      <div className="pool-head">
        <h2 className="pool-title"><span className="pool-mark">◆</span> FEE SHARING</h2>
        <span className="pool-status live">● LIVE</span>
      </div>

      <div className="pool-grid">
        <div className="pool-card pool-card--pons">
          <span className="pool-label">CREATOR FEE → HOLDERS</span>
          <span className="pool-value">{FEE_SHARE.creatorCut}</span>
          <span className="pool-note">of every creator fee is distributed pro-rata</span>
        </div>
        <div className="pool-card pool-card--stock">
          <span className="pool-label">REWARD TOKENS</span>
          <span className="pool-value" style={{ fontSize: 'clamp(20px, 3vw, 30px)' }}>
            {FEE_SHARE.rewards}
          </span>
          <span className="pool-note">paid from both sides of every swap</span>
        </div>
        <div className="pool-card pool-card--share">
          <span className="pool-label">YOUR SHARE</span>
          <span className="pool-value">{pctText}</span>
          <span className="pool-note">
            {account
              ? `${balanceText} ${TOKEN.symbol} · ${short(account)}`
              : 'connect wallet to see your share'}
          </span>
        </div>
      </div>

      <div className="pool-cta">
        <p className="pool-hint" style={{ maxWidth: 'none' }}>
          Your share = your {TOKEN.symbol} balance ÷ total supply ({supplyText}). Fees are pushed
          to your wallet automatically by the launchpad — <b>no claim needed</b>, {FEE_SHARE.distribution}, {FEE_SHARE.permanence}.
        </p>
        <p className="pool-hint" style={{ maxWidth: 'none' }}>
          <b>Mechanics:</b> every buy/sell on ponsfamily pays a fee. The creator portion
          ({FEE_SHARE.creatorCut} of it) flows to holders on {NETWORK_NAME} as {FEE_SHARE.rewards},
          split by balance ÷ supply.
        </p>
        {STAKED && (
          <p className="pool-hint" style={{ maxWidth: 'none' }}>
            <b>Contract:</b>{' '}
            <a className="hero-token-ca" href={`${EXPLORER_URL}/token/${STAKED}`} target="_blank" rel="noopener noreferrer">
              {STAKED} ↗
            </a>
          </p>
        )}
      </div>
    </section>
  );
}