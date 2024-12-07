import { useState, useEffect, useCallback, useRef } from 'react';
import { Star } from '@/lib/types';

const ANIMATION_INTERVAL = 100; // 10fps for smooth animation
const DEFAULT_DECAY_TIME = 3000;

export function useStarAnimation(stars: Star[]) {
  const decayTime = parseInt(process.env.NEXT_PUBLIC_DECAY_TIME || String(DEFAULT_DECAY_TIME));
  const [progress, setProgress] = useState<number[]>(Array(9).fill(100));
  const starsRef = useRef(stars);
  
  // Update ref when stars change
  useEffect(() => {
    starsRef.current = stars;
  }, [stars]);

  // Memoize the calculation function
  const calculateProgress = useCallback(() => {
    const now = Date.now();
    return starsRef.current.map((star) => {
      if (!star.active) return 0;
      
      const expiryTime = new Date(star.expiresAt).getTime();
      const timeLeft = expiryTime - now;
      
      return Math.max(0, Math.min(100, (timeLeft / decayTime) * 100));
    });
  }, [decayTime]); // Only depend on decayTime

  useEffect(() => {
    // Set up interval for updates
    const interval = setInterval(() => {
      setProgress(calculateProgress());
    }, ANIMATION_INTERVAL);

    // Cleanup
    return () => clearInterval(interval);
  }, [calculateProgress]); // Only depend on the memoized calculate function

  return progress;
}
