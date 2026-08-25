// ─── PONSMINER · Coming Soon — silhouette landing ─────────────────────────
// Dark navy scene, GPU mining rigs as glowing silhouettes on the horizon,
// particles, "OPEN SOON" hero. No fake signup — honest teaser.
import logoUrl from '../assets/logo-v2.jpg';

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

      {/* silhouette mining rigs on the horizon */}
      <div className="landing-rigs">
        <Rig fans={3} tall />
        <Rig fans={2} />
        <Rig fans={3} tall />
        <Rig fans={2} mid />
        <Rig fans={3} />
        <Rig fans={2} tall />
        <Rig fans={3} mid />
      </div>

      <footer className="landing-foot">
        PONSMINER · MINING GAME ON ROBINHOOD CHAIN
      </footer>
    </div>
  );
}

function Rig({ fans, tall, mid }) {
  return (
    <div className={`rig ${tall ? 'rig-tall' : ''} ${mid ? 'rig-mid' : ''}`}>
      <div className="rig-stand">
        {/* GPU cards stacked in the rack — silhouette w/ glowing LED */}
        {[0, 1, 2].map(row => (
          <div className="rig-shelf" key={row}>
            <div className="rig-card">
              <span className="rig-led" />
              <div className="rig-fans">
                {Array.from({ length: fans }).map((_, i) => (
                  <div className="rig-fan" key={i}>
                    <div className="rig-fan-blades" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="rig-pedestal" />
      </div>
    </div>
  );
}
