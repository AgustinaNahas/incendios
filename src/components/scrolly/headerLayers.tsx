import { withBasePath } from "@/lib/paths";

/** Mockup de capas del header (ilustración final pendiente). */

function starPath(cx: number, cy: number, r: number, spikes = 16, inner = 0.36) {
  const parts: string[] = [];
  for (let i = 0; i < spikes; i += 1) {
    const a0 = (i / spikes) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 0.5) / spikes) * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + Math.cos(a0) * r * inner;
    const y0 = cy + Math.sin(a0) * r * inner;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    parts.push(`${i === 0 ? "M" : "L"}${x0.toFixed(1)} ${y0.toFixed(1)}`);
    parts.push(`L${x1.toFixed(1)} ${y1.toFixed(1)}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

function Araucaria({
  x,
  y,
  r,
  fill,
  trunk = "#4a3728",
}: {
  x: number;
  y: number;
  r: number;
  fill: string;
  trunk?: string;
}) {
  return (
    <g>
      <rect x={x - r * 0.06} y={y} width={r * 0.12} height={r * 0.85} fill={trunk} />
      <path d={starPath(x, y - r * 0.15, r * 0.72, 18, 0.42)} fill={fill} />
      <path d={starPath(x, y - r * 0.42, r * 0.5, 14, 0.4)} fill={fill} opacity="0.92" />
      <path d={starPath(x, y - r * 0.62, r * 0.28, 12, 0.38)} fill={fill} />
    </g>
  );
}

function Pine({
  x,
  y,
  h,
  fill,
}: {
  x: number;
  y: number;
  h: number;
  fill: string;
}) {
  const w = h * 0.52;
  return (
    <g>
      <rect x={x - 3.5} y={y - h * 0.22} width="7" height={h * 0.22} fill="#4a3728" />
      <polygon
        points={`${x},${y - h} ${x + w * 0.38},${y - h * 0.58} ${x - w * 0.38},${y - h * 0.58}`}
        fill={fill}
      />
      <polygon
        points={`${x},${y - h * 0.78} ${x + w * 0.48},${y - h * 0.34} ${x - w * 0.48},${y - h * 0.34}`}
        fill={fill}
      />
      <polygon
        points={`${x},${y - h * 0.52} ${x + w * 0.58},${y - h * 0.08} ${x - w * 0.58},${y - h * 0.08}`}
        fill={fill}
      />
    </g>
  );
}

function Frond({
  x,
  y,
  s,
  fill,
  flip = false,
}: {
  x: number;
  y: number;
  s: number;
  fill: string;
  flip?: boolean;
}) {
  const dir = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
      <path
        d={`M0 0 C${40 * s} ${-80 * s}, ${90 * s} ${-40 * s}, ${130 * s} ${-10 * s} C${90 * s} ${10 * s}, ${40 * s} ${30 * s}, 0 8 Z`}
        fill={fill}
      />
      <path
        d={`M8 ${-6 * s} C${50 * s} ${-100 * s}, ${110 * s} ${-70 * s}, ${150 * s} ${-30 * s}`}
        fill="none"
        stroke={fill}
        strokeWidth={3 * s}
        opacity="0.55"
      />
    </g>
  );
}

export function SkyLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="sky-glow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#e8eef0" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#c5d0d4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#b7c4c8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#sky-glow)" />
    </svg>
  );
}

export function FarMountainsLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path d="M-40 900 L80 520 L210 640 L360 430 L520 610 L680 380 L860 560 L1020 410 L1180 580 L1320 470 L1500 620 V900 Z" fill="#9aa79a" />
      <path d="M360 430 L430 510 L390 505 L480 600 L440 590 L520 610 L470 540 L420 560 Z" fill="#e8e9e6" />
      <path d="M680 380 L760 470 L720 465 L820 560 L860 560 L790 470 L750 490 Z" fill="#ececea" />
      <path d="M1020 410 L1100 500 L1060 492 L1180 580 L1120 520 L1080 545 Z" fill="#e4e5e2" />
    </svg>
  );
}

export function MidMountainsLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path d="M-80 900 L40 560 L220 700 L380 420 L620 680 L780 390 L1040 710 L1200 500 L1480 640 V900 Z" fill="#5d7a52" />
      <path d="M40 560 L180 720 L120 700 L280 790 L220 770 L380 420 Z" fill="#6f8d62" />
      <path d="M780 390 L900 560 L840 545 L1020 700 L960 680 L1040 710 L880 520 L830 555 Z" fill="#4a6642" />
      <path d="M380 420 L470 560 L430 548 L560 680 L500 660 L620 680 L510 540 L460 575 Z" fill="#3f5838" />
    </svg>
  );
}

export function NearMountainsLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path d="M-120 900 L-20 480 L180 640 L320 220 L560 700 L720 360 L980 760 L1180 300 L1520 640 V900 Z" fill="#3d5c38" />
      <path d="M320 220 L410 380 L360 370 L500 540 L440 520 L560 700 L430 420 L390 470 Z" fill="#2f4a32" />
      <path d="M1180 300 L1280 430 L1230 418 L1380 560 L1320 540 L1520 640 L1340 470 L1290 510 Z" fill="#c9cac6" />
      <path d="M1180 300 L1240 390 L1210 382 L1300 470 L1265 458 L1380 560 L1288 430 L1255 455 Z" fill="#e6e7e4" />
      <rect x="1298" y="410" width="18" height="42" fill="#d8d9d6" />
      <rect x="1293" y="400" width="28" height="12" rx="6" fill="#ececea" />
      <path d="M-120 900 L80 760 L240 820 L420 700 L640 830 L860 720 L1100 840 L1440 760 V900 Z" fill="#2a4630" />
    </svg>
  );
}

export function LakeLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="lake-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c5e4ec" />
          <stop offset="45%" stopColor="#7eb8c9" />
          <stop offset="100%" stopColor="#4e8ea3" />
        </linearGradient>
      </defs>
      <path d="M-40 640 C220 600, 480 720, 760 680 C1040 640, 1280 700, 1500 660 L1500 980 L-40 980 Z" fill="url(#lake-fill)" />
      <rect x="180" y="690" width="220" height="18" rx="4" fill="#eef7fa" opacity="0.55" />
      <rect x="520" y="730" width="280" height="16" rx="4" fill="#eef7fa" opacity="0.4" />
      <rect x="980" y="705" width="160" height="14" rx="4" fill="#eef7fa" opacity="0.35" />
    </svg>
  );
}

export function TreesFarLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <Pine x={80} y={820} h={90} fill="#2f4a32" />
      <Pine x={150} y={835} h={70} fill="#3d5c38" />
      <Pine x={240} y={810} h={110} fill="#243c28" />
      <Pine x={1180} y={800} h={120} fill="#2f4a32" />
      <Pine x={1280} y={830} h={80} fill="#3d5c38" />
      <Pine x={1380} y={815} h={100} fill="#243c28" />
      <Araucaria x={420} y={780} r={70} fill="#35563a" />
      <Araucaria x={980} y={790} r={58} fill="#2f4a32" />
    </svg>
  );
}

export function ForestMidLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <Pine x={200} y={900} h={260} fill="#1e3a28" />
      <Pine x={310} y={910} h={210} fill="#2a4630" />
      <Pine x={520} y={900} h={280} fill="#163024" />
      <Pine x={640} y={920} h={190} fill="#2f4a32" />
      <Pine x={860} y={900} h={250} fill="#1e3a28" />
      <Pine x={1040} y={915} h={220} fill="#243c28" />
      <Araucaria x={80} y={780} r={160} fill="#3d5a40" />
      <Araucaria x={430} y={820} r={110} fill="#2c4a32" />
      <Araucaria x={1180} y={760} r={150} fill="#35563a" />
      <Frond x={1320} y={420} s={1.6} fill="#2a4630" />
    </svg>
  );
}

export function ForestNearLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <Araucaria x={-20} y={620} r={280} fill="#1c3322" />
      <Araucaria x={220} y={700} r={190} fill="#2c4a32" />
      <Pine x={480} y={980} h={420} fill="#163024" />
      <Pine x={620} y={990} h={340} fill="#1e3a28" />
      <Pine x={790} y={985} h={390} fill="#12261c" />
      <Pine x={960} y={995} h={300} fill="#1e3a28" />
      <Frond x={1480} y={280} s={2.4} fill="#1c3322" flip />
      <Frond x={1400} y={520} s={1.8} fill="#2a4630" flip />
      <Araucaria x={1280} y={640} r={220} fill="#243c28" />
    </svg>
  );
}

export function TrunksLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="trunk-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d5c38" />
          <stop offset="38%" stopColor="#8a5a28" />
          <stop offset="100%" stopColor="#c4783a" />
        </linearGradient>
      </defs>
      {[
        [40, 70],
        [180, 92],
        [340, 78],
        [500, 100],
        [680, 84],
        [860, 96],
        [1040, 76],
        [1200, 90],
        [1360, 82],
      ].map(([x, w], i) => (
        <rect key={x} x={x} y={-20} width={w} height="960" fill="url(#trunk-grad)" opacity={0.72 + (i % 3) * 0.08} />
      ))}
    </svg>
  );
}

export function CampfireLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="pit-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#f46b15" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#7a3a12" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3a1c12" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="720" cy="640" rx="420" ry="160" fill="url(#pit-glow)" />
      <path d="M220 760 C420 560, 1020 560, 1220 760 L1280 980 L180 980 Z" fill="#3a2a1c" />
      <ellipse cx="720" cy="700" rx="260" ry="90" fill="#5a4030" />
      <ellipse cx="720" cy="700" rx="170" ry="58" fill="#2a1c12" />
      {[
        [560, 690],
        [610, 720],
        [680, 735],
        [760, 735],
        [830, 720],
        [880, 690],
        [600, 660],
        [840, 660],
      ].map(([x, y], i) => (
        <ellipse key={`${x}-${i}`} cx={x} cy={y} rx={28} ry={18} fill={i % 2 ? "#8a7a6a" : "#6a5a4a"} />
      ))}
      <rect x="650" y="640" width="90" height="16" rx="4" transform="rotate(-28 695 648)" fill="#6b4423" />
      <rect x="700" y="635" width="95" height="15" rx="4" transform="rotate(24 748 642)" fill="#5a3820" />
      <rect x="675" y="650" width="80" height="14" rx="4" transform="rotate(-8 715 657)" fill="#7a5030" />
      <path d="M720 520 C760 560, 780 600, 740 650 C800 630, 810 680, 730 710 C710 690, 700 660, 720 520 Z" fill="#f46b15" />
      <path d="M720 560 C745 585, 752 615, 728 650 C752 640, 755 670, 722 690 C710 670, 708 640, 720 560 Z" fill="#ffc800" />
      <path d="M200 820 C280 790, 360 850, 280 880 Z" fill="#2a4630" opacity="0.7" />
      <path d="M1100 800 C1220 760, 1320 840, 1240 880 Z" fill="#1c3322" />
    </svg>
  );
}

export function GroundLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="1440" height="900" fill="#3a2e22" />
      {Array.from({ length: 28 }, (_, i) => {
        const x = (i % 7) * 210 - 40 + (i % 2) * 40;
        const y = Math.floor(i / 7) * 230 - 30;
        const rot = (i * 37) % 80 - 40;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <ellipse cx="70" cy="40" rx="90" ry="28" fill={i % 3 ? "#5a4a32" : "#6a5538"} opacity="0.85" />
            <ellipse cx="40" cy="20" rx="50" ry="16" fill="#2f4a32" opacity="0.45" />
            <path d="M10 40 C40 10, 90 10, 130 44" fill="none" stroke="#2a2018" strokeWidth="3" opacity="0.35" />
          </g>
        );
      })}
      <rect x="780" y="560" width="220" height="18" rx="9" transform="rotate(-18 890 569)" fill="#d8c8b0" />
      <circle cx="760" cy="575" r="8" fill="#f46b15" />
      <circle cx="760" cy="575" r="3" fill="#ffc800" />
    </svg>
  );
}

export function SmokeLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g className="header-smoke-puff">
        <ellipse cx="860" cy="520" rx="90" ry="120" fill="#8a8078" opacity="0.45" />
        <ellipse cx="920" cy="400" rx="110" ry="140" fill="#6e6860" opacity="0.35" />
        <ellipse cx="980" cy="260" rx="80" ry="110" fill="#9a948c" opacity="0.28" />
      </g>
      <g className="header-smoke-puff header-smoke-puff-delay">
        <ellipse cx="780" cy="480" rx="70" ry="100" fill="#7a746c" opacity="0.3" />
        <ellipse cx="840" cy="330" rx="95" ry="130" fill="#5c5852" opacity="0.25" />
      </g>
    </svg>
  );
}

export function WildfireLayer() {
  return (
    <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="fire-mtn" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#f46b15" />
          <stop offset="45%" stopColor="#c45c2a" />
          <stop offset="100%" stopColor="#6a3a28" />
        </linearGradient>
      </defs>
      <path d="M180 820 L360 420 L520 620 L700 280 L900 580 L1080 320 L1320 700 L1440 560 V900 H0 Z" fill="#5a5048" opacity="0.7" />
      <path d="M360 420 L430 560 L700 280 L760 430 L900 580 L1080 320 L980 500 L860 430 Z" fill="url(#fire-mtn)" />
      <path d="M520 620 L610 500 L700 280 L640 480 Z" fill="#ffc800" opacity="0.55" />
      <path d="M980 500 L1080 320 L1180 480 L1100 560 Z" fill="#f46b15" opacity="0.8" />
      <path d="M640 200 C700 80, 780 40, 820 160 C900 20, 980 80, 940 220 C1040 120, 1120 180, 1060 320" fill="#6e6860" opacity="0.45" />
      <path d="M860 160 C940 20, 1060 -20, 1120 140 C1220 0, 1320 80, 1260 260" fill="#8a8078" opacity="0.35" />
    </svg>
  );
}

export function FirefighterLayer() {
  return (
    <img
      src={withBasePath("/header/firefighter.png")}
      alt=""
      className="h-full w-full object-cover object-[center_58%]"
    />
  );
}
