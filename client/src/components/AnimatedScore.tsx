import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  className?: string
}

export function AnimatedScore({ value, className }: Props) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return

    const duration = 650
    let startTime: number | null = null

    const frame = (now: number) => {
      if (startTime === null) startTime = now
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        fromRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  return <span className={className}>{display}</span>
}
