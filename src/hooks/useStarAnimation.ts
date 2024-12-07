import { useState, useEffect, useCallback } from 'react';
import { Star } from '@/lib/types';

const ANIMATION_INTERVAL = 100; // 10fps for smooth animation
const DEFAULT_DECAY_TIME = 3000;

export function useStarAnimation(stars: Star[]) {
  const decayTime = parseInt(process.env.NEXT_PUBLIC_DECAY_TIME || String(DEFAULT_DECAY_TIME));
  const [progress, setProgress] = useState<number[]>(Array(9).fill(100));

  const calculateProgress = useCallback(() => {
    const now = Date.now();
    return stars.map((star, index) => {
      if (!star.active) return 0;
      const expiryTime = new Date(star.expiresAt).getTime();
      const timeLeft = expiryTime - now;
      // Use base decay time for progress calculation
      return Math.max(0, Math.min(100, (timeLeft / decayTime) * 100));
    });
  }, [stars, decayTime]);

  useEffect(() => {
    setProgress(calculateProgress()); // Initial calculation
    
    const interval = setInterval(() => {
      setProgress(calculateProgress());
    }, ANIMATION_INTERVAL);

    return () => clearInterval(interval);
  }, [calculateProgress]);

  return progress;
}
