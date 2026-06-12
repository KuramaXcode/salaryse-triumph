import type { HouseVariant } from '../types';

type MarkProps = {
  theme: HouseVariant;
  className?: string;
  title?: string;
};

// Intentionally "collab-like" symbols: recognizable without being a full logo dump.
// Uses currentColor so each surface can drive the accent tone.
export function UniverseMark({ theme, className, title }: MarkProps) {
  const common = {
    className,
    role: title ? 'img' : undefined,
    'aria-label': title,
    viewBox: '0 0 64 64',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  } as const;

  switch (theme) {
    case 'hp':
      return (
        <svg {...common}>
          <path
            d="M40 10 L24 38"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M22 42 L18 50"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M40 10 L46 16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M46 16 L41 21"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M46 16 L51 21"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M46 16 L52 16"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M46 16 L46 10"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M28 30 L36 30 L30 44 L40 44"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      );
    case 'got':
      return (
        <svg {...common}>
          <path
            d="M32 10 C24 12 20 18 20 25 C20 34 27 39 32 44 C37 39 44 34 44 25 C44 18 40 12 32 10 Z"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.95"
          />
          <path
            d="M32 18 L32 52"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M24 30 L40 30"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M28 52 L36 52"
            stroke="currentColor"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          <path
            d="M26 14 L38 14"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'marvel':
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="3" />
          <circle cx="32" cy="32" r="9" stroke="currentColor" strokeWidth="3" opacity="0.95" />
          <path
            d="M32 12 L32 20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M32 44 L32 52"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M12 32 L20 32"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M44 32 L52 32"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M18 18 L23 23"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M46 18 L41 23"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M18 46 L23 41"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M46 46 L41 41"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      );
    case 'sw':
      return (
        <svg {...common}>
          <path
            d="M32 10 C22 14 16 22 16 32 C16 44 26 52 32 54 C38 52 48 44 48 32 C48 22 42 14 32 10 Z"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.9"
          />
          <path
            d="M14 34 C22 31 26 26 32 18 C38 26 42 31 50 34"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M22 42 L32 36 L42 42"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.95"
          />
        </svg>
      );
    case 'mbh':
      return (
        <svg {...common}>
          {/* Dharmachakra wheel */}
          <circle cx="32" cy="32" r="16" stroke="currentColor" strokeWidth="3" opacity="0.95" />
          {/* 8 spokes */}
          <line x1="32" y1="16" x2="32" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          <line x1="32" y1="48" x2="32" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          <line x1="16" y1="32" x2="8" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          <line x1="48" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          <line x1="20.7" y1="20.7" x2="15" y2="15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
          <line x1="43.3" y1="43.3" x2="49" y2="49" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
          <line x1="43.3" y1="20.7" x2="49" y2="15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
          <line x1="20.7" y1="43.3" x2="15" y2="49" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
          {/* Hub */}
          <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.9" />
        </svg>
      );
    case 'dbz':
      return (
        <svg {...common}>
          {/* Dragon Ball sphere */}
          <circle cx="32" cy="28" r="16" stroke="currentColor" strokeWidth="3" opacity="0.95" />
          {/* Star dots on the ball */}
          <circle cx="32" cy="22" r="2" fill="currentColor" opacity="0.9" />
          <circle cx="27" cy="30" r="2" fill="currentColor" opacity="0.9" />
          <circle cx="37" cy="30" r="2" fill="currentColor" opacity="0.9" />
          {/* Energy burst lines radiating outward */}
          <path d="M32 8 L32 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M48 12 L51 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path d="M54 28 L58 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path d="M16 12 L13 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path d="M10 28 L6 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          {/* Ground line */}
          <path d="M18 52 L46 52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          <path d="M22 56 L42 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        </svg>
      );
    default:
      return null;
  }
}

type WatermarkProps = {
  theme: HouseVariant;
  className?: string;
};

export function UniverseWatermark({ theme, className }: WatermarkProps) {
  const common = {
    className,
    'aria-hidden': true,
    viewBox: '0 0 320 320',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  } as const;

  switch (theme) {
    case 'hp':
      return (
        <svg {...common}>
          <path
            d="M160 34 L110 250 L210 250 Z"
            stroke="currentColor"
            strokeWidth="8"
            opacity="0.28"
          />
          <circle cx="160" cy="156" r="64" stroke="currentColor" strokeWidth="8" opacity="0.18" />
          <path d="M160 78 L160 252" stroke="currentColor" strokeWidth="8" opacity="0.22" />
          <path
            d="M200 84 L120 222"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.16"
          />
          <path
            d="M96 244 C120 212 136 208 160 176 C184 208 200 212 224 244"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.12"
          />
        </svg>
      );
    case 'got':
      return (
        <svg {...common}>
          <path
            d="M76 98 L160 34 L244 98"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinejoin="round"
            opacity="0.22"
          />
          <path
            d="M116 276 L160 108 L204 276"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinejoin="round"
            opacity="0.22"
          />
          <path
            d="M108 126 H212"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.16"
          />
          <path
            d="M88 256 C120 236 136 210 160 176 C184 210 200 236 232 256"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.12"
          />
          <path
            d="M86 156 L234 156"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="10 14"
            opacity="0.12"
          />
        </svg>
      );
    case 'marvel':
      return (
        <svg {...common}>
          <circle cx="160" cy="160" r="110" stroke="currentColor" strokeWidth="10" opacity="0.22" />
          <circle cx="160" cy="160" r="58" stroke="currentColor" strokeWidth="10" opacity="0.18" />
          <path
            d="M160 50 L160 94"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.18"
          />
          <path
            d="M160 226 L160 270"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.18"
          />
          <path
            d="M50 160 L94 160"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.18"
          />
          <path
            d="M226 160 L270 160"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.18"
          />
          <path
            d="M66 78 L254 78"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="12 14"
            opacity="0.1"
          />
          <path
            d="M66 242 L254 242"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="12 14"
            opacity="0.1"
          />
        </svg>
      );
    case 'sw':
      return (
        <svg {...common}>
          <path
            d="M160 44 C106 62 74 104 74 160 C74 228 128 268 160 280 C192 268 246 228 246 160 C246 104 214 62 160 44 Z"
            stroke="currentColor"
            strokeWidth="10"
            opacity="0.2"
          />
          <path
            d="M52 174 C108 154 126 124 160 78 C194 124 212 154 268 174"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.14"
          />
          <path
            d="M80 236 L160 190 L240 236"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.16"
          />
          <path
            d="M64 112 L256 112"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="4 16"
            opacity="0.12"
          />
          <path
            d="M64 208 L256 208"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="4 16"
            opacity="0.12"
          />
        </svg>
      );
    case 'mbh':
      return (
        <svg {...common}>
          {/* Large Dharmachakra */}
          <circle cx="160" cy="160" r="90" stroke="currentColor" strokeWidth="10" opacity="0.18" />
          <circle cx="160" cy="160" r="58" stroke="currentColor" strokeWidth="6" opacity="0.1" />
          <circle cx="160" cy="160" r="20" stroke="currentColor" strokeWidth="8" opacity="0.14" />
          {/* 8 spokes */}
          <line x1="160" y1="70" x2="160" y2="102" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.14" />
          <line x1="160" y1="218" x2="160" y2="250" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.14" />
          <line x1="70" y1="160" x2="102" y2="160" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.14" />
          <line x1="218" y1="160" x2="250" y2="160" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.14" />
          <line x1="97" y1="97" x2="118" y2="118" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.1" />
          <line x1="202" y1="202" x2="223" y2="223" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.1" />
          <line x1="223" y1="97" x2="202" y2="118" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.1" />
          <line x1="97" y1="223" x2="118" y2="202" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.1" />
          {/* Decorative outer ring dots */}
          <circle cx="160" cy="64" r="6" fill="currentColor" opacity="0.12" />
          <circle cx="160" cy="256" r="6" fill="currentColor" opacity="0.12" />
          <circle cx="64" cy="160" r="6" fill="currentColor" opacity="0.12" />
          <circle cx="256" cy="160" r="6" fill="currentColor" opacity="0.12" />
        </svg>
      );
    case 'dbz':
      return (
        <svg {...common}>
          {/* Large Dragon Ball sphere */}
          <circle cx="160" cy="148" r="80" stroke="currentColor" strokeWidth="10" opacity="0.2" />
          <circle cx="160" cy="148" r="52" stroke="currentColor" strokeWidth="6" opacity="0.12" />
          {/* Star dots */}
          <circle cx="160" cy="118" r="9" fill="currentColor" opacity="0.18" />
          <circle cx="136" cy="154" r="9" fill="currentColor" opacity="0.18" />
          <circle cx="184" cy="154" r="9" fill="currentColor" opacity="0.18" />
          {/* Energy burst — long radiating lines */}
          <path d="M160 44 L160 18" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.16" />
          <path d="M243 65 L263 45" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.13" />
          <path d="M276 148 L302 148" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.13" />
          <path d="M243 231 L263 251" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.13" />
          <path d="M77 65 L57 45" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.13" />
          <path d="M44 148 L18 148" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.13" />
          <path d="M77 231 L57 251" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.13" />
          {/* Ground shockwave rings */}
          <path d="M80 262 C110 250 210 250 240 262" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.1" />
          <path d="M60 278 C110 260 210 260 260 278" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.07" />
        </svg>
      );
    default:
      return null;
  }
}

type FxProps = {
  theme: HouseVariant;
  className?: string;
};

export function UniverseTileFx({ theme, className }: FxProps) {
  return (
    <svg
      className={className}
      data-universe={theme}
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="uFx__base" x="5" y="5" width="90" height="90" rx="10" />
      <rect className="uFx__tracer" x="5" y="5" width="90" height="90" rx="10" />
      <circle className="uFx__spark uFx__spark--a" cx="22" cy="24" r="1.6" />
      <circle className="uFx__spark uFx__spark--b" cx="76" cy="70" r="1.4" />
    </svg>
  );
}
