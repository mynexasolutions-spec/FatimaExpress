const shade = (hex, amount) => {
  const value = hex.replace("#", "");
  const num = parseInt(value.length === 3 ? value.replace(/./g, "$&$&") : value, 16);
  const clamp = (n) => Math.min(255, Math.max(0, n));
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

function Shape({ kind, color, label, gradient, highlight }) {
  const knot = (x, y) => (
    <path d={`M${x - 6} ${y} l6 -7 l6 7 l-6 5 Z`} fill={shade(color, -50)} opacity="0.85" />
  );

  switch (kind) {
    case "heart":
      return (
        <>
          <path
            d="M100 172c-38-26-62-48-62-79 0-22 17-37 36-37 12 0 21 6 26 15 5-9 14-15 26-15 19 0 36 15 36 37 0 31-24 53-62 79Z"
            fill={gradient}
          />
          <path
            d="M62 72c6-9 16-13 24-11 5 1 4 7-2 10-9 4-15 11-16 19-1 6-9 5-9-2 0-6 1-11 3-16Z"
            fill={highlight}
            opacity="0.6"
          />
          {knot(100, 170)}
        </>
      );
    case "star":
      return (
        <>
          <path
            d="M100 22 122 78 182 84 138 122 151 180 100 150 49 180 62 122 18 84 78 78Z"
            fill={gradient}
            strokeLinejoin="round"
            strokeWidth="14"
            stroke={gradient}
          />
          <path d="M78 66c8-12 16-20 22-22 4-1 5 6 1 11-7 8-12 15-14 22-2 6-13 3-9-4Z" fill={highlight} opacity="0.6" />
          {knot(100, 176)}
        </>
      );
    case "number":
      return (
        <>
          <rect x="34" y="26" width="132" height="146" rx="34" fill={gradient} />
          <rect x="46" y="38" width="40" height="60" rx="20" fill={highlight} opacity="0.45" />
          <text
            x="100"
            y="128"
            textAnchor="middle"
            fontSize="92"
            fontWeight="800"
            fill={shade(color, -70)}
            opacity="0.55"
            fontFamily="var(--font-display), sans-serif"
          >
            {label ?? "5"}
          </text>
        </>
      );
    case "bubble":
      return (
        <>
          <circle cx="100" cy="96" r="76" fill={gradient} opacity="0.55" />
          <circle cx="100" cy="96" r="76" fill="none" stroke={shade(color, -40)} strokeOpacity="0.35" strokeWidth="2" />
          <circle cx="76" cy="70" r="22" fill="#ffffff" opacity="0.75" />
          <circle cx="118" cy="118" r="10" fill={shade(color, -30)} opacity="0.35" />
          <circle cx="86" cy="124" r="14" fill={shade(color, -20)} opacity="0.3" />
          <path d="M100 172v-2" stroke={shade(color, -50)} strokeWidth="3" />
          {knot(100, 176)}
        </>
      );
    case "cluster":
      return (
        <>
          <circle cx="66" cy="80" r="42" fill={gradient} />
          <circle cx="138" cy="66" r="32" fill={shade(color, 40)} />
          <circle cx="118" cy="128" r="38" fill={shade(color, -25)} />
          <circle cx="52" cy="62" r="12" fill="#ffffff" opacity="0.55" />
          <path d="M66 122c6 22 22 38 52 44M138 98c-4 20-12 32-20 40" stroke={shade(color, -55)} strokeWidth="3" fill="none" opacity="0.6" />
        </>
      );
    case "pump":
      return (
        <>
          <rect x="34" y="72" width="132" height="86" rx="20" fill={gradient} />
          <rect x="52" y="46" width="96" height="34" rx="16" fill={shade(color, -30)} />
          <rect x="72" y="98" width="56" height="30" rx="10" fill="#ffffff" opacity="0.55" />
          <circle cx="60" cy="140" r="8" fill={shade(color, -60)} opacity="0.6" />
          <circle cx="140" cy="140" r="8" fill={shade(color, -60)} opacity="0.6" />
          <rect x="88" y="26" width="24" height="26" rx="8" fill={shade(color, 30)} />
        </>
      );
    case "weight":
      return (
        <>
          <path d="M70 78h60l14 84H56Z" fill={gradient} />
          <path d="M78 78c-6-22 6-36 22-36s28 14 22 36" fill="none" stroke={shade(color, -40)} strokeWidth="8" />
          <path d="M62 162h76l-8 16H70Z" fill={shade(color, -45)} />
          <path d="M84 92h16l-4 52h-8Z" fill="#ffffff" opacity="0.4" />
        </>
      );
    case "ribbon":
      return (
        <>
          <ellipse cx="100" cy="100" rx="66" ry="58" fill={gradient} />
          <ellipse cx="100" cy="100" rx="24" ry="22" fill="#ffffff" opacity="0.8" />
          <path d="M46 74c26-12 82-12 108 0M42 100c30-10 86-10 116 0M46 126c26 12 82 12 108 0" stroke={shade(color, -45)} strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M154 118c22 14 20 40 6 52" stroke={gradient} strokeWidth="8" fill="none" strokeLinecap="round" />
        </>
      );
    case "clip":
      return (
        <>
          <rect x="40" y="60" width="52" height="34" rx="12" fill={gradient} />
          <rect x="104" y="60" width="52" height="34" rx="12" fill={shade(color, 35)} />
          <rect x="40" y="108" width="52" height="34" rx="12" fill={shade(color, -25)} />
          <rect x="104" y="108" width="52" height="34" rx="12" fill={gradient} />
          <circle cx="66" cy="77" r="7" fill="#ffffff" opacity="0.7" />
          <circle cx="130" cy="125" r="7" fill="#ffffff" opacity="0.7" />
        </>
      );
    case "sphere":
    case "round":
    default:
      return (
        <>
          <circle cx="100" cy="94" r="76" fill={gradient} />
          <ellipse cx="74" cy="64" rx="24" ry="18" fill="#ffffff" opacity="0.55" transform="rotate(-25 74 64)" />
          <path d="M40 118c22 24 98 24 120 0" stroke={shade(color, -50)} strokeWidth="3" fill="none" opacity="0.35" />
          {knot(100, 176)}
        </>
      );
  }
}

export default function BalloonVisual({ visual, className = "", size = 200 }) {
  const kind = visual?.kind ?? "round";
  const color = visual?.color ?? "#3382f0";
  const gradientId = `grad-${kind}-${color.replace("#", "")}`;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${kind} balloon illustration`}
    >
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor={shade(color, 70)} />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor={shade(color, -55)} />
        </radialGradient>
      </defs>
      <Shape
        kind={kind}
        color={color}
        label={visual?.label}
        gradient={`url(#${gradientId})`}
        highlight="#ffffff"
      />
    </svg>
  );
}
