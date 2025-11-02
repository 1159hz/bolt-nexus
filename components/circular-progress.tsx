"use client"

import { useEffect, useState } from "react"

interface CircularProgressProps {
  percentage: number
  size?: number
  animate?: boolean
}

export function CircularProgress({ percentage, size = 140, animate = false }: CircularProgressProps) {
  const [displayPercentage, setDisplayPercentage] = useState(animate ? 0 : percentage)

  useEffect(() => {
    if (!animate) return

    const startTime = Date.now()
    const duration = 2000

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setDisplayPercentage(Math.floor(percentage * progress))

      if (progress < 1) {
        requestAnimationFrame(updateProgress)
      }
    }

    updateProgress()
  }, [animate, percentage])

  const radius = size / 2 - 8
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayPercentage / 100) * circumference

  // Color based on percentage
  const getColor = (percent: number) => {
    if (percent < 50) return "#D32F2F"
    if (percent < 70) return "#FF9800"
    if (percent < 85) return "#FFC107"
    return "#00BFA5"
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(displayPercentage)}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all"
          style={{ transitionDuration: "0.1s" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{displayPercentage}</div>
          <div className="text-xs text-foreground/50">out of 100</div>
        </div>
      </div>
    </div>
  )
}
