// ─── PONSMINER v2 · Hero GPU rig — 3D fan spinning, LED sweep, glow ────────
import { useEffect, useRef } from 'react';

// 9 curved blades conic-gradient
const BLADES = 9;
const SPAN = 360 / BLADES;
const BLADE_STOPS = [];
for (let i = 0; i < BLADES; i++) {
  const a = i * SPAN;
  BLADE_STOPS.push(`rgba(140,162,198,0) ${a}deg`);
  BLADE_STOPS.push(`rgba(172,194,228,0.72) ${a + 5}deg`);
  BLADE_STOPS.push(`rgba(172,194,228,0.32) ${a + 20}deg`);
  BLADE_STOPS.push(`rgba(140,162,198,0) ${a + SPAN - 5}deg`);
}
const BLADE_BG = `conic-gradient(from 0deg, ${BLADE_STOPS.join(',')})`;

export default function HeroRig() {
  const glowRef = useRef(null);
  useEffect(() => {
    let frame;
    const el = glowRef.current;
    if (!el) return;
    let t = 0;
    const loop = () => {
      t += 0.02;
      const x = 50 + Math.sin(t) * 15;
      el.style.setProperty('--sweep-x', `${x}%`);
      el.style.setProperty('--sweep-opacity', `${0.3 + Math.sin(t * 1.7) * 0.15}`);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="hr-rig">
      {/* background glow */}
      <div className="hr-glow" ref={glowRef} style={{ '--sweep-x': '50%', '--sweep-opacity': '0.3' }} />
      {/* particle layer */}
      <div className="hr-particles" />
      {/* rig rack */}
      <div className="hr-racks">
        <Rig fans={3} x={-2} />
        <Rig fans={2} x={0} />
        <Rig fans={3} x={2} />
      </div>
      {/* front glass glare */}
      <div className="hr-glass" />
    </div>
  );
}

function Rig({ fans, x }) {
  return (
    <div className="hr-rack" style={{ '--x': `${x}em` }}>
      <div className="hr-frame">
        {[0, 1, 2].map(row => (
          <div className="hr-card" key={row}>
            <div className="hr-led" style={{ '--hue': `${row * 40 + 30}` }} />
            <div className="hr-fan-row">
              {Array.from({ length: fans }).map((_, i) => (
                <div className="hr-fan" key={i}>
                  <div className="hr-blades" style={{ background: BLADE_BG }} />
                  <div className="hr-hub" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="hr-psu" />
    </div>
  );
}