"use client"

interface LaunchpadIconProps {
  launchpad?: "pump" | "pumpfun" | "raydium" | "bonk"
  size?: "sm" | "md" | "lg"
}

export function LaunchpadIcon({ launchpad, size = "lg" }: LaunchpadIconProps) {
  if (!launchpad) return null

  const normalized = launchpad === "pump" ? "pumpfun" : launchpad
  const sizeClass = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-20 h-20'

  return (
    <div className={`${sizeClass} flex-shrink-0`}>
      <img
        src={`/launchpad-icons/${normalized}.png`}
        alt={normalized}
        className="w-full h-full object-contain"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  )
}
