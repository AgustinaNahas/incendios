"use client";

type Props = {
  stage: "burned" | "fire" | "healthy";
  className?: string;
};

export function TreeSilhouette({ stage, className = "" }: Props) {
  if (stage === "burned") {
    return (
      <svg
        className={`h-40 w-auto md:h-56 ${className}`}
        viewBox="0 0 200 160"
        aria-hidden
      >
        <path
          d="M20 150 L35 80 L28 78 L45 40 L40 38 L55 10 L70 38 L65 40 L82 78 L75 80 L90 150 Z"
          fill="#4a4540"
        />
        <path
          d="M100 150 L112 95 L108 94 L120 60 L116 58 L130 28 L144 58 L140 60 L152 94 L148 95 L160 150 Z"
          fill="#5a5550"
          opacity="0.85"
        />
        <path
          d="M155 150 L168 100 L164 99 L175 70 L172 68 L182 45 L192 68 L189 70 L198 99 L194 100 L200 150"
          fill="#3f3a36"
        />
        <ellipse cx="100" cy="148" rx="90" ry="6" fill="#2a2622" opacity="0.5" />
      </svg>
    );
  }

  if (stage === "fire") {
    return (
      <svg
        className={`h-40 w-auto md:h-56 ${className}`}
        viewBox="0 0 200 160"
        aria-hidden
      >
        <path
          d="M70 150 L85 90 L100 150 Z"
          fill="#5a4030"
        />
        <path
          d="M100 20 C120 40 140 50 130 80 C150 70 155 100 125 125 C115 145 90 150 85 130 C70 140 55 110 75 90 C65 60 80 40 100 20 Z"
          fill="#ff6b2d"
        />
        <path
          d="M100 50 C110 60 115 70 108 90 C118 85 120 100 105 115 C98 105 95 90 100 50 Z"
          fill="#ffd166"
        />
        <ellipse cx="100" cy="148" rx="70" ry="5" fill="#3a1c12" opacity="0.45" />
      </svg>
    );
  }

  return (
    <svg
      className={`h-40 w-auto md:h-56 ${className}`}
      viewBox="0 0 220 160"
      aria-hidden
    >
      <ellipse cx="60" cy="70" rx="36" ry="48" fill="#2f6b4f" />
      <ellipse cx="110" cy="55" rx="40" ry="52" fill="#4f9d6e" />
      <ellipse cx="160" cy="72" rx="34" ry="46" fill="#c47b3a" opacity="0.9" />
      <ellipse cx="145" cy="60" rx="18" ry="22" fill="#d4a017" opacity="0.75" />
      <rect x="52" y="100" width="8" height="48" fill="#5a4030" />
      <rect x="102" y="95" width="9" height="53" fill="#5a4030" />
      <rect x="152" y="105" width="8" height="43" fill="#5a4030" />
      <ellipse cx="110" cy="150" rx="95" ry="6" fill="#1a2e24" opacity="0.2" />
    </svg>
  );
}
