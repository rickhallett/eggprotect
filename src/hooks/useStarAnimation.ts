import { useState, useEffect } from 'react';
import { Star } from '@/lib/types';

export function useStarAnimation(stars: Star[]) {
  const DECAY_TIME = parseInt(process.env.NEXT_PUBLIC_DECAY_TIME || "3000");
  const [progress, setProgress] = useState<number[]>(Array(9).fill(100));

  useEffect(() => {
    const calculateProgress = () => {
      const now = Date.now();
      return stars.map(star => {
        if (!star.active) return 0;
        const timeLeft = new Date(star.expiresAt).getTime() - now;
        return Math.max(0, (timeLeft / DECAY_TIME) * 100);
      });
    };

    const interval = setInterval(() => {
      setProgress(calculateProgress());
    }, 100);

    return () => clearInterval(interval);
  }, [stars, DECAY_TIME]);

  return progress;
}
