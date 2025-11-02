"use client"

import { useEffect, useState } from "react"

interface AnimatedCounterProps {
  from: number
  to: number
  duration: number
  delay?: number
}

export function AnimatedCounter({ from, to, duration, delay = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(from)

  useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = Date.now()
      const targetTime = startTime + duration * 1000

      const updateCount = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / (targetTime - startTime), 1)

        setCount(Math.floor(from + (to - from) * progress))

        if (progress < 1) {
          requestAnimationFrame(updateCount)
        }
      }

      updateCount()
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [from, to, duration, delay])

  return <>{count}</>
}
