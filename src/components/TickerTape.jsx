// ─── PONSMINER v2 · Stock ticker tape — tokenized stock on Robinhood Chain ─
import { useEffect, useRef, useState } from 'react';
import { STOCK_TICKERS } from '../game/config.js';

// Simulated live prices (placeholder mark — real Chainlink readout comes with P1)
const BASE = {
  NVDA: 207.28, COIN: 154.29, MSFT: 395.62,
  GOOGL: 332.92, AAPL: 229.8, SPCX: 89.4,
};

export default function TickerTape() {
  const [marks, setMarks] = useState(() =>
    STOCK_TICKERS.map(t => ({ symbol: t.symbol, price: BASE[t.symbol] ?? 100, up: true }))
  );
  useEffect(() => {
    const id = setInterval(() => {
      setMarks(prev => prev.map(m => {
        const drift = (Math.random() - 0.5) * 0.4;
        const price = Math.max(1, m.price + drift);
        return { ...m, price, up: drift >= 0 };
      }));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const strip = marks.map(m => (
    <span className="tt-item" key={m.symbol}>
      <span className="tt-sym">{m.symbol}</span>
      <span className={`tt-price ${m.up ? 'up' : 'down'}`}>
        ${m.price.toFixed(2)} {m.up ? '▲' : '▼'}
      </span>
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