import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useMemo } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Constants for color transitions
const BRIGHT_YELLOW = "#fbbf24" // Tailwind yellow-400
const INACTIVE_GRAY = "#3f3f46" // Tailwind zinc-700

export const useColorInterpolation = (progress: number) => {
  return useMemo(() => {
    // Convert progress to decimal
    const t = progress / 100

    // Parse the hex colors into RGB components
    const startRGB = {
      r: parseInt(BRIGHT_YELLOW.slice(1, 3), 16),
      g: parseInt(BRIGHT_YELLOW.slice(3, 5), 16),
      b: parseInt(BRIGHT_YELLOW.slice(5, 7), 16),
    }

    const endRGB = {
      r: parseInt(INACTIVE_GRAY.slice(1, 3), 16),
      g: parseInt(INACTIVE_GRAY.slice(3, 5), 16),
      b: parseInt(INACTIVE_GRAY.slice(5, 7), 16),
    }

    // Interpolate each component
    const resultRGB = {
      r: Math.round(startRGB.r * t + endRGB.r * (1 - t)),
      g: Math.round(startRGB.g * t + endRGB.g * (1 - t)),
      b: Math.round(startRGB.b * t + endRGB.b * (1 - t)),
    }

    // Convert back to hex
    return `#${resultRGB.r.toString(16).padStart(2, '0')}${resultRGB.g.toString(16).padStart(2, '0')}${resultRGB.b.toString(16).padStart(2, '0')}`
  }, [progress])
}

export const useStarStyle = (index: number, stars: boolean[], lastStarProgress: number) => {
  return useMemo(() => {
    const lastActiveIndex = stars.lastIndexOf(true)
    const isActive = stars[index]

    if (!isActive) {
      return { fill: INACTIVE_GRAY, stroke: INACTIVE_GRAY }
    }

    if (index === lastActiveIndex) {
      const currentColor = useColorInterpolation(lastStarProgress)
      return { fill: currentColor, stroke: currentColor }
    }

    return { fill: BRIGHT_YELLOW, stroke: BRIGHT_YELLOW }
  }, [index, stars, lastStarProgress])
}
