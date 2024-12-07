import { useState, useEffect, useCallback } from 'react';
import { Star, StarSystemState } from '@/lib/types';

const POLL_INTERVAL = 3000;

export function useStarSystem(): StarSystemState & {
  activateNextStar: () => Promise<Star | undefined>;
  refreshStars: () => Promise<void>;
} {
  const [state, setState] = useState<StarSystemState>({
    stars: [],
    loading: true,
    error: null
  });

  const fetchStars = useCallback(async () => {
    try {
      const response = await fetch('/api/stars');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setState(prev => ({ ...prev, stars: data, error: null }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to fetch stars' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const activateNextStar = useCallback(async () => {
    try {
      const response = await fetch('/api/stars', { method: 'PATCH' });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      await fetchStars();
      return data;
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to activate star' }));
      return undefined;
    }
  }, [fetchStars]);

  useEffect(() => {
    fetchStars();
    const interval = setInterval(fetchStars, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStars]);

  return { 
    ...state, 
    activateNextStar, 
    refreshStars: fetchStars 
  };
}
