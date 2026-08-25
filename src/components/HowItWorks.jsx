// ─── PONSMINER v2 · How it works — hold-to-earn, honest copy ───────────────
import { TOKEN } from '../game/config.js';

const STEPS = [
  {
    n: '01',
    t: 'HOLD',
    d: `Buy & hold ${TOKEN.symbol}. Your share of the pool is your balance ÷ total supply — nothing to stake, nothing to lock.`,
  },
  {
    n: '02',
    t: 'POOL FILLS',
    d: 'Every swap of the token pays a fee. Most of it funds the dividend pool — from traders, not from the next holder in.',
  },
  {
    n: '03',
    t: 'CLAIM',
    d: `Claim any time: PONS + tokenized stock (NVDA, COIN, MSFT…), pro-rata. No bots, no lockups — just your balance.`,
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