import { useState, useEffect } from 'react';
import { Star } from '@/lib/types';

export function useStarSystem() {
  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStars = async () => {
    try {
      const response = await fetch('/api/stars');
      const data = await response.json();
      setStars(data);
    } catch (err) {
      setError('Failed to fetch stars');
    } finally {
      setLoading(false);
    }
  };

  const activateNextStar = async () => {
    try {
      const response = await fetch('/api/stars', { method: 'PATCH' });
      const data = await response.json();
      await fetchStars();
      return data;
    } catch (err) {
      setError('Failed to activate star');
    }
  };

  useEffect(() => {
    fetchStars();
    const interval = setInterval(fetchStars, 3000);
    return () => clearInterval(interval);
  }, []);

  return { stars, loading, error, activateNextStar, refreshStars: fetchStars };
}
