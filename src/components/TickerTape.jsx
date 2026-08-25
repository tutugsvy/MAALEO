// ─── PONSMINER · Fee-share ticker tape — honest info strip ─────────────────
// Scrolling strip of fee-sharing facts. No fake stock prices, no fake data.
const ITEMS = [
  '100% CREATOR FEES → HOLDERS',
  'PRO-RATA · BALANCE ÷ SUPPLY',
  'AUTOMATIC · NO CLAIM NEEDED',
  'PERMANENT · CANNOT BE REVOKED',
  'PONSMINER + WETH',
  'ROBINHOOD CHAIN · 4663',
  'LAUNCHED ON PONSFAMILY',
];

export default function TickerTape() {
  const strip = ITEMS.map((t, i) => (
    <span className="tt-item" key={i}>
      <span className="tt-sym">{t}</span>
      <span className="tt-price up">▲</span>
    </span>
  ));

  return (
    <div className="tt-wrap" aria-hidden="true">
      <div className="tt-inner">
        {[0, 1].map(k => (
          <div className="tt-strip" key={k}>{strip}</div>
        ))}
      </div>
    </div>
  );
}