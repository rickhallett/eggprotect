import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useMemo } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Constants
const BRIGHT_YELLOW = "#fbbf24"
const INACTIVE_GRAY = "#3f3f46"

// Remove the useColorInterpolation hook and make it a regular function
const interpolateColor = (progress: number) => {
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

  return `#${resultRGB.r.toString(16).padStart(2, '0')}${resultRGB.g.toString(16).padStart(2, '0')}${resultRGB.b.toString(16).padStart(2, '0')}`
}

const interpolateStrokeWidth = (progress: number) => {
  return 1 + (progress / 100) * 2
}

// Custom hook
export function useStarStyles(stars: boolean[], lastStarProgress: number) {
  return useMemo(() =>
    stars.map((isActive, index) => {
      const lastActiveIndex = stars.lastIndexOf(true);

      if (!isActive) {
        return { 
          fill: INACTIVE_GRAY, 
          stroke: INACTIVE_GRAY, 
          strokeWidth: 1 
        };
      }

      if (index === lastActiveIndex && lastStarProgress !== undefined) {
        const currentColor = interpolateColor(Math.max(0, Math.min(100, lastStarProgress)));
        return { 
          fill: currentColor, 
          stroke: currentColor, 
          strokeWidth: Math.max(1, interpolateStrokeWidth(lastStarProgress)) 
        };
      }

      return { 
        fill: BRIGHT_YELLOW, 
        stroke: BRIGHT_YELLOW,
        strokeWidth: 1 
      };
    }),
    [stars, lastStarProgress]
  );
}
