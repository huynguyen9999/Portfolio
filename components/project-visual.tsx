import { Tuner } from "./tuner";
import { IGauchoBackRoadmap } from "./igauchoback-roadmap";
import type { Project } from "@/lib/content";
import { useId } from "react";

function Unwrap() {
  return (
    <div className="diagram diagram-unwrap">
      <div className="visual-topline">
        <span>Unwrap / Review intelligence</span>
        <span>Find the signal in the feedback</span>
      </div>
      <svg
        viewBox="0 0 480 230"
        role="img"
        aria-label="Conceptual semantic map of app clusters connected to review topics. Illustrative layout, not measured review data."
      >
        <g fill="none" stroke="#c4c9bf" strokeDasharray="4 5">
          <path d="M106 88 235 63 352 113 247 172 106 88M235 63 247 172" />
        </g>
        <g strokeWidth="1">
          <ellipse cx="106" cy="88" rx="66" ry="48" fill="#e8eee4" stroke="#9bae90" />
          <ellipse cx="235" cy="63" rx="51" ry="37" fill="#efe9dc" stroke="#b5a47e" />
          <ellipse cx="352" cy="113" rx="67" ry="51" fill="#e5ebf0" stroke="#91a8ba" />
          <ellipse cx="247" cy="172" rx="58" ry="35" fill="#eee5e8" stroke="#b99aa6" />
        </g>
        <g fill="none" stroke="#87917e" opacity=".6">
          <path d="m81 75 35 24 15-32M81 75l50-8M216 54l32 20 6-30M329 102l35 29 20-37M329 102l55-8M227 169l33 14 8-24" />
        </g>
        <g stroke="#fafbf7" strokeWidth="3">
          <g fill="#6e8b5f">
            <circle cx="81" cy="75" r="13" />
            <circle cx="116" cy="99" r="18" />
            <circle cx="131" cy="67" r="10" />
          </g>
          <g fill="#ac925b">
            <circle cx="216" cy="54" r="12" />
            <circle cx="248" cy="74" r="16" />
            <circle cx="254" cy="44" r="8" />
          </g>
          <g fill="#6489a4">
            <circle cx="329" cy="102" r="15" />
            <circle cx="364" cy="131" r="19" />
            <circle cx="384" cy="94" r="11" />
          </g>
          <g fill="#a5788c">
            <circle cx="227" cy="169" r="12" />
            <circle cx="260" cy="183" r="14" />
            <circle cx="268" cy="159" r="9" />
          </g>
        </g>
        <g fill="#485447" fontFamily="monospace" fontSize="10" textAnchor="middle">
          <text x="106" y="25">Social &amp; Community</text>
          <text x="235" y="12">Shopping &amp; Rewards</text>
          <text x="356" y="181">Finance &amp; Banking</text>
          <text x="247" y="225">Photo &amp; Video</text>
        </g>
      </svg>
      <p className="visual-caption">Concept map · illustrative app clusters</p>
    </div>
  );
}

function Lidar() {
  const fillId = useId();
  return (
    <div className="diagram diagram-lidar">
      <div className="visual-topline">
        <span>LiDAR / 180°</span>
        <span>Sense. Filter. Detect.</span>
      </div>
      <svg
        viewBox="0 0 480 230"
        role="img"
        aria-label="Illustrative 180-degree LiDAR scan with concentric distance arcs and sample detected points, not recorded sensor data."
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6d9699" stopOpacity=".04" />
            <stop offset="1" stopColor="#6d9699" stopOpacity=".23" />
          </linearGradient>
        </defs>
        <path d="M62 193a178 178 0 0 1 356 0Z" fill={`url(#${fillId})`} />
        <g fill="none" stroke="#9cb3b2" strokeWidth="1">
          <path d="M62 193a178 178 0 0 1 356 0M102 193a138 138 0 0 1 276 0M145 193a95 95 0 0 1 190 0M187 193a53 53 0 0 1 106 0M62 193h356" />
          <path
            d="M240 193V15m0 178L114 67m126 126L366 67"
            strokeDasharray="3 5"
          />
        </g>
        <path d="M240 193 331 40" stroke="#416e72" strokeWidth="2" />
        <g fill="#416e72">
          <circle cx="310" cy="76" r="5" />
          <circle cx="168" cy="108" r="4" />
          <circle cx="363" cy="145" r="4" />
          <circle cx="204" cy="149" r="3" />
          <circle cx="240" cy="193" r="7" />
        </g>
        <circle
          cx="310"
          cy="76"
          r="11"
          fill="none"
          stroke="#416e72"
          opacity=".5"
        />
        <g fill="#4b676a" fontFamily="monospace" fontSize="10">
          <text x="234" y="9">
            90°
          </text>
          <text x="422" y="199">
            0°
          </text>
          <text x="30" y="199">
            180°
          </text>
          <text x="319" y="70">
            sample return
          </text>
        </g>
      </svg>
      <p className="visual-caption">
        Concept diagram · illustrative sensor returns
      </p>
    </div>
  );
}

function Orbit() {
  const fillId = useId();
  const clipId = useId();
  return (
    <div className="diagram diagram-orbit">
      <div className="visual-topline">
        <span>Orbit AFE</span>
        <span>A little closer, everywhere</span>
      </div>
      <svg
        viewBox="0 0 480 230"
        role="img"
        aria-label="Conceptual globe with linked locations, illustrating opt-in intern discovery. Locations are illustrative."
      >
        <defs>
          <radialGradient id={fillId}>
            <stop stopColor="#fcfbf7" />
            <stop offset="1" stopColor="#e5e6df" />
          </radialGradient>
          <clipPath id={clipId}>
            <circle cx="240" cy="115" r="97" />
          </clipPath>
        </defs>
        <circle
          cx="240"
          cy="115"
          r="97"
          fill={`url(#${fillId})`}
          stroke="#c1c5ba"
        />
        <g
          stroke="#c1c5ba"
          strokeWidth=".9"
          fill="none"
          clipPath={`url(#${clipId})`}
        >
          <ellipse cx="240" cy="115" rx="36" ry="97" />
          <ellipse cx="240" cy="115" rx="74" ry="97" />
          <ellipse cx="240" cy="115" rx="97" ry="35" />
          <ellipse cx="240" cy="115" rx="97" ry="73" />
          <path d="M143 115h194M240 18v194" />
        </g>
        <g fill="none" stroke="#5c777e" strokeWidth="1.5">
          <path
            d="M188 84q48-37 104 42M188 84q-9 64 58 72M246 156q51 3 46-30"
            strokeDasharray="4 5"
          />
        </g>
        <g fill="#426b7b" stroke="#f4f4ef" strokeWidth="4">
          <circle cx="188" cy="84" r="7" />
          <circle cx="292" cy="126" r="7" />
          <circle cx="246" cy="156" r="7" />
        </g>
        <g fill="#4a6269" fontFamily="monospace" fontSize="10">
          <rect
            x="40"
            y="63"
            width="111"
            height="31"
            rx="15"
            fill="#fafbf7"
            stroke="#ccd1c9"
          />
          <text x="61" y="83">
            25+ NA hubs
          </text>
          <rect
            x="321"
            y="152"
            width="119"
            height="31"
            rx="15"
            fill="#fafbf7"
            stroke="#ccd1c9"
          />
          <text x="339" y="172">
            Opt-in presence
          </text>
        </g>
      </svg>
      <p className="visual-caption">
        Concept diagram · connections across locations
      </p>
    </div>
  );
}

export function ProjectVisual({ kind }: { kind: Project["visual"] }) {
  switch (kind) {
    case "unwrap":
      return <Unwrap />;
    case "tuner":
      return <Tuner />;
    case "roadmap":
      return <IGauchoBackRoadmap />;
    case "lidar":
      return <Lidar />;
    case "orbit":
      return <Orbit />;
    default:
      return null;
  }
}
