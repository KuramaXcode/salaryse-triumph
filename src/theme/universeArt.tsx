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
    case 'mh':
      return (
        <svg {...common}>
          <path
            d="M22 22 C22 14 28 10 32 10 C36 10 42 14 42 22 L42 36 C42 46 38 54 32 54 C26 54 22 46 22 36 Z"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M26 30 C28 28 30 28 32 30 C34 28 36 28 38 30"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M28 40 C30 42 34 42 36 40"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M20 24 L16 28"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M44 24 L48 28"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
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
    case 'mh':
      return (
        <svg {...common}>
          <path
            d="M112 110 C112 76 138 60 160 60 C182 60 208 76 208 110 L208 176 C208 224 190 260 160 260 C130 260 112 224 112 176 Z"
            stroke="currentColor"
            strokeWidth="10"
            opacity="0.22"
          />
          <path
            d="M128 150 C140 140 152 140 160 150 C168 140 180 140 192 150"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.14"
          />
          <path
            d="M140 198 C148 210 172 210 180 198"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.14"
          />
          <path
            d="M80 90 H240"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="10 10"
            opacity="0.1"
          />
          <path
            d="M80 230 H240"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="10 10"
            opacity="0.1"
          />
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
