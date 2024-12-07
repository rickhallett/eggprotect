import { useState, useEffect, useCallback } from 'react';
import { Star, StarSystemConfig, StarSystemState } from '@/lib/types';

export function useStarSystem(config: StarSystemConfig) {
  const [stars, setStars] = useState<Star[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const computeCurrentState = useCallback(() => {
    const now = new Date().getTime();
    return stars.map(star => ({
      ...star,
      active: star.active && new Date(star.expiresAt).getTime() > now
    }));
  }, [stars]);

  useEffect(() => {
    const initializeStars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/stars');
        if (!response.ok) throw new Error('Failed to fetch stars');
        const data = await response.json();
        setStars(data);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    initializeStars();
  }, []);

  const activateNextStar = useCallback(async () => {
    const currentState = computeCurrentState();
    const nextPosition = currentState.filter(s => !s.active).length > 0 
      ? Math.min(...currentState.filter(s => !s.active).map(s => s.position))
      : -1;

    if (nextPosition === -1) return;

    const now = new Date();
    const newStar: Star = {
      position: nextPosition,
      active: true,
      activatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + config.starDuration).toISOString()
    };

    setStars(prev => 
      prev.map(s => s.position === nextPosition ? newStar : s)
    );

    try {
      const response = await fetch('/api/stars', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position: nextPosition })
      });
      
      if (!response.ok) {
        setStars(prev => 
          prev.map(s => s.position === nextPosition ? 
            { ...s, active: false, activatedAt: '', expiresAt: '' } : s
          )
        );
        throw new Error('Failed to activate star');
      }

      const serverStar = await response.json();
      setStars(prev => 
        prev.map(s => s.position === nextPosition ? serverStar : s)
      );
      return serverStar;
    } catch (error) {
      console.error('Failed to activate star:', error);
      return undefined;
    }
  }, [stars, config.starDuration, computeCurrentState]);

  return {
    stars: computeCurrentState(),
    isInitialized,
    activateNextStar,
    loading,
    error
  };
}
