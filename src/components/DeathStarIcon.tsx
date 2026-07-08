import { useId } from 'react';

interface DeathStarIconProps {
  /** Rendered width/height in pixels. */
  size?: number;
  className?: string;
  title?: string;
}

/**
 * Death Star silhouette icon. IDs are made unique per instance so multiple
 * icons can share a page without clip-path / gradient collisions.
 */
export function DeathStarIcon({
  size = 24,
  className,
  title,
}: DeathStarIconProps) {
  const uid = useId();
  const sphereId = `ds-sphere-${uid}`;
  const shadeId = `ds-shade-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <defs>
        <clipPath id={sphereId}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
        <radialGradient id={shadeId} cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="70%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
      </defs>

      {/* Sphere body */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill={`url(#${shadeId})`}
        stroke="#4a4a4a"
        strokeWidth="2"
      />

      <g clipPath={`url(#${sphereId})`} stroke="#2e2e2e" fill="none">
        {/* Equatorial trench */}
        <line x1="0" y1="37" x2="64" y2="37" strokeWidth="2" />
        <line x1="0" y1="34.5" x2="64" y2="34.5" strokeWidth="1" opacity="0.7" />
        <line x1="0" y1="39.5" x2="64" y2="39.5" strokeWidth="1" opacity="0.7" />

        {/* Latitude panel lines */}
        <path d="M2 24 Q32 20 62 24" strokeWidth="0.8" opacity="0.5" />
        <path d="M4 48 Q32 52 60 48" strokeWidth="0.8" opacity="0.5" />
        <path d="M6 55 Q32 58 58 55" strokeWidth="0.7" opacity="0.4" />

        {/* Longitude panel lines */}
        <path d="M20 3 Q16 32 20 61" strokeWidth="0.7" opacity="0.4" />
        <path d="M44 3 Q48 32 44 61" strokeWidth="0.7" opacity="0.4" />
        <path d="M32 2 L32 62" strokeWidth="0.6" opacity="0.35" />

        {/* Surface panel detail */}
        <path d="M40 44 h10 v8 h-10 z" strokeWidth="0.6" opacity="0.4" />
        <path d="M12 42 h8 v6 h-8 z" strokeWidth="0.6" opacity="0.4" />
      </g>

      {/* Superlaser dish */}
      <g fill="none">
        <circle
          cx="23"
          cy="22"
          r="10"
          fill="#141414"
          stroke="#2e2e2e"
          strokeWidth="1.5"
        />
        <circle cx="23" cy="22" r="6.5" stroke="#3a3a3a" strokeWidth="1" opacity="0.8" />
        <circle cx="23" cy="22" r="3" stroke="#3a3a3a" strokeWidth="1" opacity="0.9" />
        {/* Focusing emitters */}
        <circle cx="23" cy="16.5" r="0.9" fill="#5a5a5a" />
        <circle cx="18" cy="24" r="0.9" fill="#5a5a5a" />
        <circle cx="28" cy="24" r="0.9" fill="#5a5a5a" />
        <circle cx="23" cy="27" r="0.9" fill="#5a5a5a" />
      </g>
    </svg>
  );
}
