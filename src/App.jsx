// ─── PONSMINER v2 · App — hold-to-earn fee-sharing dashboard ───────────────
// Hold PONSMINER → ponsfamily launchpad shares 100% creator fees to holders,
// pro-rata, automatically. Wallet connect shows YOUR real share of the pool.
import { useEffect, useState } from 'react';
import './dashboard.css';
import logoUrl from './assets/logo-v2.jpg';
import { TOKEN, TARGET_CHAIN_ID, NETWORK_NAME } from './game/config.js';
import { hasInjectedWallet, connectInjected, onAccountsChanged, onChainChanged } from './game/wallet.js';
import TickerTape from './components/TickerTape.jsx';
import FeeShare from './components/FeeShare.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import PoolVisual from './components/PoolVisual.jsx';

const SHORT = a => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : null);

export default function App() {
  const [account, setAccount] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const offAcc = onAccountsChanged(a => { setAccount(a); setErr(null); });
    const offChain = onChainChanged(() => { setErr(null); });
    return () => { offAcc(); offChain(); };
  }, []);

  const connect = async () => {
    setErr(null);
    if (!hasInjectedWallet()) { setErr('No injected wallet (MetaMask/Rabby).'); return; }
    setBusy(true);
    try {
      const addr = await connectInjected();
      setAccount(addr);
    } catch (e) {
      setErr((e && e.message) || 'Wallet request failed');
    } finally {
      setBusy(false);
    }
  };

  const caShort = TOKEN.contractAddress ? SHORT(TOKEN.contractAddress) : null;

  return (
    <div className="app">
      <TickerTape />

      {/* ── header ── */}
      <header className="hd">
        <div className="hd-brand">
          <img src={logoUrl} alt="PONSMINER" className="hd-logo" />
          <span className="hd-name">PONSMINER</span>
        </div>
        <div className="hd-right">
          <span className="hd-chain">
            <span className="hd-dot" /> {NETWORK_NAME} · {TARGET_CHAIN_ID}
          </span>
          {account ? (
            <button className="hd-wallet connected" onClick={() => setAccount(null)}>
              {SHORT(account)}
            </button>
          ) : (
            <button className="hd-wallet" onClick={connect} disabled={busy}>
              {busy ? 'CONNECTING…' : '⚡ CONNECT WALLET'}
            </button>
          )}
        </div>
      </header>

      {/* ── hero ── */}
      <main className="hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="hero-live">● HOLD TO EARN</span>
            <span>ROBINHOOD CHAIN · 4663</span>
          </div>
          <h1 className="hero-title">
            HOLD<span className="hero-dim">.</span> MINE<span className="hero-dim">.</span><br />
            <span className="hero-accent">EARN</span>
          </h1>
          <p className="hero-sub">
            Hold {TOKEN.symbol} and every trade pays you — <b>100% of creator fees
            shared to holders</b>, pro-rata, automatically. No claim needed.
          </p>
          <div className="hero-cta">
            <a className="hero-btn primary" href="#pool">VIEW FEE SHARING</a>
            <a className="hero-btn" href={TOKEN.launchpadUrl} target="_blank" rel="noopener noreferrer">
              TRADE {TOKEN.symbol} ↗
            </a>
          </div>
          <div className="hero-token">
            <span className="hero-token-pill"><span className="hero-token-dot" /> {TOKEN.symbol}</span>
            {caShort && (
              <a className="hero-token-ca" href={TOKEN.launchpadUrl} target="_blank" rel="noopener noreferrer">{caShort} ↗</a>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <PoolVisual />
          <div className="hero-viz-label">
            <span className="hero-viz-dot" /> SWAPS IN · HOLDERS EARN
          </div>
        </div>
      </main>

      {err && <div className="app-err">{err}</div>}

      {/* ── fee sharing ── */}
      <FeeShare account={account} />

      {/* ── how it works ── */}
      <HowItWorks />

      {/* ── footer ── */}
      <footer className="ft">
        <p className="ft-note">
          {TOKEN.symbol} launched on ponsfamily.
        </p>
        <p className="ft-brand">PONSMINER · HOLD TO EARN · ROBINHOOD CHAIN {TARGET_CHAIN_ID}</p>
      </footer>
    </div>
  );
}