// ─── PONSMINER · How it works — fee sharing, honest copy ───────────────────
import { TOKEN, FEE_SHARE } from '../game/config.js';

const STEPS = [
  {
    n: '01',
    t: 'HOLD',
    d: `Buy & hold ${TOKEN.symbol}. Your share of the fees is your balance ÷ total supply — nothing to stake, nothing to lock.`,
  },
  {
    n: '02',
    t: 'TRADES PAY FEES',
    d: 'Every buy/sell of the token pays a fee. The creator portion is earmarked for holders — from traders, not from the next holder in.',
  },
  {
    n: '03',
    t: 'EARN AUTOMATICALLY',
    d: `${FEE_SHARE.creatorCut} of creator fees are pushed to your wallet as ${FEE_SHARE.rewards}, pro-rata. No claim, no keeper — permanent by launchpad.`,
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <h2 className="how-title"><span className="pool-mark">◆</span> HOW IT WORKS</h2>
      <p className="how-sub">The whole deal, readable. No hidden schedules.</p>
      <div className="how-grid">
        {STEPS.map(s => (
          <div className="how-card" key={s.n}>
            <span className="how-n">{s.n}</span>
            <h3 className="how-t">{s.t}</h3>
            <p className="how-d">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}