"use client"

interface MiniChartProps {
  data: number[]
  className?: string
  positive?: boolean
}

export function MiniChart({ data, className = "", positive = true }: MiniChartProps) {
  if (!data || data.length === 0) {
    return null
  }

  const width = 100
  const height = 60 // Increased from 40 for more vertical space
  const padding = 4

  // Calculate min and max for scaling
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  const pathData = `M ${points.join(" L ")}`

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d={pathData}
        fill="none"
        stroke={positive ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
