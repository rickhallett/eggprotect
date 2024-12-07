import { useState, useEffect, useCallback } from 'react';
import { Star } from '@/lib/types';

const ANIMATION_INTERVAL = 100; // 10fps for smooth animation
const DEFAULT_DECAY_TIME = 3000;

export function useStarAnimation(stars: Star[]) {
  const decayTime = parseInt(process.env.NEXT_PUBLIC_DECAY_TIME || String(DEFAULT_DECAY_TIME));
  const [progress, setProgress] = useState<number[]>(Array(9).fill(100));

  const calculateProgress = useCallback(() => {
    const now = Date.now();
    return stars.map((star) => {
      if (!star.active) return 0;
      
      const expiryTime = new Date(star.expiresAt).getTime();
      const timeLeft = expiryTime - now;
      
      // Calculate progress based on the actual time left vs decay time
      return Math.max(0, Math.min(100, (timeLeft / decayTime) * 100));
    });
  }, [stars, decayTime]);

  useEffect(() => {
    const updateProgress = () => {
      const newProgress = calculateProgress();
      setProgress(newProgress);
    };
    
    // Initial calculation
    updateProgress();
    
    // Set up interval for updates
    const interval = setInterval(updateProgress, ANIMATION_INTERVAL);

    // Cleanup
    return () => clearInterval(interval);
  }, [calculateProgress]); // Only depend on calculateProgress

  return progress;
}
