"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useStarStyles } from '@/lib/utils';
import StarStats from './StarStats';
import { OTPForm } from './OPTForm';
import { useStarSystem } from '@/hooks/useStarSystem';
import { useStarAnimation } from '@/hooks/useStarAnimation';

const StarChart = () => {
  const { stars, activateNextStar, isInitialized, loading, error } = useStarSystem({
    totalStars: 9,
    starDuration: 3000,
    cooldownPeriod: 1000
  });
  console.log(stars)
  const progress = useStarAnimation(stars);
  const [showOTP, setShowOTP] = useState(false);

  const activeStates = useMemo(() => stars.map(star => star.active), [stars]);
  const lastActiveStar = useMemo(() => stars.findIndex(star => star.active), [stars]);
  const currentProgress = useMemo(() =>
    lastActiveStar === -1 ? 0 : (progress[lastActiveStar] || 0),
    [lastActiveStar, progress]
  );

  const starStyles = useStarStyles(activeStates, currentProgress);

  useEffect(() => {
    const hasInactiveStars = stars.some(star => !star.active);
    if (showOTP !== hasInactiveStars) {
      setShowOTP(hasInactiveStars);
    }
  }, [stars, showOTP]);

  const handleOTPSuccess = async () => {
    await activateNextStar();
    setShowOTP(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="max-h-screen bg-zinc-900 p-4">
      <Card className="max-w-md mx-auto bg-zinc-800 text-zinc">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-slate-400">
            Tick, tock...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <StarStats
              stars={stars.map(star => star.active)}
              lastStarProgress={currentProgress}
              decayTime={parseInt(process.env.NEXT_PUBLIC_DECAY_TIME || "3000")}
              expiryTime={stars[lastActiveStar]?.expiresAt}
            />
          </div>
          <div className="grid grid-cols-3 gap-6 p-4">
            {stars.map((star, index) => (
              <div key={index} className="flex justify-center">
                <Star
                  size={48}
                  style={starStyles[index]}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <OTPForm
        isActive={showOTP}
        onSuccess={handleOTPSuccess}
      />
    </div>
  );
};

export default StarChart;
