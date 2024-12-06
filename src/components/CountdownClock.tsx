"use client"

import { useEffect, useState } from 'react'

interface CountdownClockProps {
  targetTime: number  // milliseconds remaining
}

export function CountdownClock({ targetTime }: CountdownClockProps) {
  const [timeLeft, setTimeLeft] = useState(targetTime)

  useEffect(() => {
    setTimeLeft(targetTime) // Reset timeLeft when targetTime changes

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetTime]) // Add targetTime to dependency array

  // Convert milliseconds to hours, minutes, seconds
  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  return (
    <div className="font-mono text-4xl text-slate-400 mt-4">
      {String(hours).padStart(2, '0')}:
      {String(minutes).padStart(2, '0')}:
      {String(seconds).padStart(2, '0')}
    </div>
  )
}
