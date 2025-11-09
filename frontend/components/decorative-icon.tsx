"use client"

export function DecorativeIcon() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-w-md opacity-60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sombras suaves radiales */}
        <defs>
          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Círculo base con sombra */}
        <circle cx="200" cy="200" r="180" fill="url(#shadowGrad)" />

        {/* Elementos geométricos principales */}
        <g opacity="0.8" stroke="currentColor" strokeWidth="2">
          {/* Círculos concéntricos */}
          <circle cx="200" cy="200" r="140" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="100" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="60" strokeWidth="1.5" />

          {/* Líneas radiales */}
          <line x1="200" y1="60" x2="200" y2="340" strokeWidth="1" opacity="0.5" />
          <line x1="60" y1="200" x2="340" y2="200" strokeWidth="1" opacity="0.5" />
          <line x1="106" y1="106" x2="294" y2="294" strokeWidth="1" opacity="0.5" />
          <line x1="294" y1="106" x2="106" y2="294" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Elemento central más visible */}
        <circle cx="200" cy="200" r="35" fill="currentColor" opacity="0.15" />
        <circle cx="200" cy="200" r="20" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      </svg>
    </div>
  )
}
