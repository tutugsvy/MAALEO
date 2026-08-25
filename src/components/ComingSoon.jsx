// ─── PONSMINER · Coming Soon — 3D-modeled GPU landing ─────────────────────
// Dark navy scene, mining rigs with 3D-modeled GPU cards (beveled shroud,
// backplate, depth faces, 3D fans w/ hubs), LED glow, particles.
// No fake signup — honest teaser.
import logoUrl from '../assets/logo-v2.jpg';

// 9 curved blades — lighter leading edge, darker trailing → reads 3D
const BLADES = 9;
function bladeGradient() {
  const stops = [];
  const span = 360 / BLADES;
  for (let i = 0; i < BLADES; i++) {
    const a = i * span;
    stops.push(`rgba(140,162,198,0) ${a}deg`);
    stops.push(`rgba(172,194,228,0.72) ${a + 5}deg`);
    stops.push(`rgba(172,194,228,0.32) ${a + 20}deg`);
    stops.push(`rgba(140,162,198,0) ${a + span - 5}deg`);
  }
  return `conic-gradient(from -30deg, ${stops.join(',')})`;
}
const BLADE_BG = bladeGradient();

export default function ComingSoon() {
  return (
    <div className="landing">
      {/* atmosphere layers */}
      <div className="landing-sky" />
      <div className="landing-glow" />
      <div className="landing-stars" />
      <div className="landing-fog" />
      <div className="landing-particles" />

      {/* content */}
      <div className="landing-hero">
        <img src={logoUrl} alt="PONSMINER" className="landing-logo" />
        <div className="landing-open">
          <span className="landing-dot" /> OPEN SOON <span className="landing-dot" />
        </div>
        <h1 className="landing-title">PONSMINER</h1>
        <p className="landing-sub">
          GPU mining on Robinhood Chain.
          <br />
          <b>200 PONS / hour</b> — shared pool, split among every GPU owner.
        </p>
        <div className="landing-chain">
          <span className="chain-pill">ROBINHOOD CHAIN · 4663</span>
          <span className="chain-pill">PAY → TREASURY</span>
          <span className="chain-pill">FIXED EMISSION</span>
        </div>
      </div>

      {/* 3D-modeled mining rigs on the horizon */}
      <div className="landing-rigs">
        <Rig fans={3} tall l />
        <Rig fans={2} r />
        <Rig fans={3} tall />
        <Rig fans={2} l mid />
        <Rig fans={3} r />
        <Rig fans={2} tall />
        <Rig fans={3} l mid />
      </div>

      <footer className="landing-foot">
        PONSMINER · MINING GAME ON ROBINHOOD CHAIN
      </footer>
    </div>
  );
}

function Rig({ fans, tall, mid, l, r }) {
  return (
    <div className={`rig ${l ? 'rig-l' : ''} ${r ? 'rig-r' : ''} ${tall ? 'rig-tall' : ''} ${mid ? 'rig-mid' : ''}`}>
      <div className="rig-frame">
        {/* GPU cards stacked in the open aluminum rack */}
        {[0, 1, 2].map(row => (
          <div className="lg-card" key={row}>
            <span className="lg-led" />
            <div className="lg-fans">
              {Array.from({ length: fans }).map((_, i) => (
                <div className="lg-fan" key={i}>
                  <div className="lg-blades" style={{ background: BLADE_BG }} />
                  <div className="lg-hub" />
                </div>
              ))}
            </div>
            <span className="lg-bracket" />
          </div>
        ))}
        <div className="rig-psu" />
      </div>
      <div className="rig-feet" />
    </div>
  );
}
