import { Tuner } from "./tuner";

function Roadmap() {
  return <div className="diagram diagram-roadmap"><div className="visual-topline"><span>iGauchoBack</span><span>From courses to clarity</span></div>
    <svg viewBox="0 0 480 230" role="img" aria-label="Illustrative prerequisite graph: foundations connect to two intermediate courses, then a capstone.">
      <defs><pattern id="roadmap-grid" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#adc0d0" /></pattern></defs>
      <rect width="480" height="230" fill="url(#roadmap-grid)" />
      <g fill="none" stroke="#8daac3" strokeWidth="1.5"><path d="M110 115h32q14 0 14-14V67q0-14 14-14h24M110 115h32q14 0 14 14v34q0 14 14 14h24M286 53h22q16 0 16 16v31q0 15 15 15h28M286 177h22q16 0 16-16v-31q0-15 15-15h28" /></g>
      <g fontFamily="Arial, sans-serif" textAnchor="middle"><rect x="14" y="89" width="105" height="52" rx="7" fill="#f9fcfe" stroke="#afc1d0" /><text x="66" y="111" fontSize="9" fill="#5c748b">START HERE</text><text x="66" y="128" fontSize="12" fill="#284a68">Foundations</text>
      <rect x="188" y="29" width="108" height="49" rx="7" fill="#f9fcfe" stroke="#afc1d0"/><text x="242" y="59" fontSize="12" fill="#284a68">Course A</text>
      <rect x="188" y="152" width="108" height="49" rx="7" fill="#f9fcfe" stroke="#afc1d0"/><text x="242" y="182" fontSize="12" fill="#284a68">Course B</text>
      <rect x="361" y="90" width="108" height="51" rx="7" fill="#426d90"/><text x="415" y="120" fontSize="12" fill="white">Capstone</text></g>
      <g fill="#426d90"><circle cx="118" cy="115" r="3"/><circle cx="360" cy="115" r="3"/></g>
    </svg><p className="visual-caption">Concept diagram · prerequisite relationships</p></div>;
}

function Lidar() {
  return <div className="diagram diagram-lidar"><div className="visual-topline"><span>LiDAR / 180°</span><span>Sense. Filter. Detect.</span></div>
    <svg viewBox="0 0 480 230" role="img" aria-label="Illustrative 180-degree LiDAR scan with concentric distance arcs and sample detected points, not recorded sensor data.">
      <defs><linearGradient id="scan-fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6d9699" stopOpacity=".04"/><stop offset="1" stopColor="#6d9699" stopOpacity=".23"/></linearGradient></defs>
      <path d="M62 193a178 178 0 0 1 356 0Z" fill="url(#scan-fill)"/>
      <g fill="none" stroke="#9cb3b2" strokeWidth="1"><path d="M62 193a178 178 0 0 1 356 0M102 193a138 138 0 0 1 276 0M145 193a95 95 0 0 1 190 0M187 193a53 53 0 0 1 106 0M62 193h356"/><path d="M240 193V15m0 178L114 67m126 126L366 67" strokeDasharray="3 5"/></g>
      <path d="M240 193 331 40" stroke="#416e72" strokeWidth="2"/>
      <g fill="#416e72"><circle cx="310" cy="76" r="5"/><circle cx="168" cy="108" r="4"/><circle cx="363" cy="145" r="4"/><circle cx="204" cy="149" r="3"/><circle cx="240" cy="193" r="7"/></g>
      <circle cx="310" cy="76" r="11" fill="none" stroke="#416e72" opacity=".5"/>
      <g fill="#4b676a" fontFamily="monospace" fontSize="10"><text x="234" y="9">90°</text><text x="422" y="199">0°</text><text x="30" y="199">180°</text><text x="319" y="70">sample return</text></g>
    </svg><p className="visual-caption">Concept diagram · illustrative sensor returns</p></div>;
}

function Orbit() {
  return <div className="diagram diagram-orbit"><div className="visual-topline"><span>Orbit AFE</span><span>A little closer, everywhere</span></div>
    <svg viewBox="0 0 480 230" role="img" aria-label="Conceptual globe with linked locations, illustrating opt-in intern discovery. Locations are illustrative.">
      <defs><radialGradient id="globe-fill"><stop stopColor="#fcfbf7"/><stop offset="1" stopColor="#e5e6df"/></radialGradient><clipPath id="globe-clip"><circle cx="240" cy="115" r="97"/></clipPath></defs>
      <circle cx="240" cy="115" r="97" fill="url(#globe-fill)" stroke="#c1c5ba" />
      <g stroke="#c1c5ba" strokeWidth=".9" fill="none" clipPath="url(#globe-clip)"><ellipse cx="240" cy="115" rx="36" ry="97"/><ellipse cx="240" cy="115" rx="74" ry="97"/><ellipse cx="240" cy="115" rx="97" ry="35"/><ellipse cx="240" cy="115" rx="97" ry="73"/><path d="M143 115h194M240 18v194"/></g>
      <g fill="none" stroke="#5c777e" strokeWidth="1.5"><path d="M188 84q48-37 104 42M188 84q-9 64 58 72M246 156q51 3 46-30" strokeDasharray="4 5"/></g>
      <g fill="#426b7b" stroke="#f4f4ef" strokeWidth="4"><circle cx="188" cy="84" r="7"/><circle cx="292" cy="126" r="7"/><circle cx="246" cy="156" r="7"/></g>
      <g fill="#4a6269" fontFamily="monospace" fontSize="10"><rect x="40" y="63" width="111" height="31" rx="15" fill="#fafbf7" stroke="#ccd1c9"/><text x="61" y="83">25+ NA hubs</text><rect x="321" y="152" width="119" height="31" rx="15" fill="#fafbf7" stroke="#ccd1c9"/><text x="339" y="172">Opt-in presence</text></g>
    </svg><p className="visual-caption">Concept diagram · connections across locations</p></div>;
}

export function ProjectVisual({ slug }: { slug: string }) {
  if (slug === "guitar-tuner") return <Tuner />;
  if (slug === "igauchoback") return <Roadmap />;
  if (slug === "lidar") return <Lidar />;
  return <Orbit />;
}
