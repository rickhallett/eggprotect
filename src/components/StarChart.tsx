"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useStarStyles } from '@/lib/utils';
import StarStats from './StarStats';
import { OTPProvider } from './OTPProvider';

const StarChart = () => {
  const DECAY_TIME = parseInt(process.env.NEXT_PUBLIC_DECAY_TIME || "3000");
  const UPDATE_INTERVAL = parseInt(process.env.NEXT_PUBLIC_UPDATE_INTERVAL || "100");

  const [stars, setStars] = useState(Array(9).fill(true));
  const [lastStarProgress, setLastStarProgress] = useState(100);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const starStyles = useStarStyles(stars, lastStarProgress);

  const handleStarClick = (index: number) => {
    if (!stars[index]) {
      setSelectedStar(index);
    }
  };

  const handleOTPSuccess = () => {
    if (selectedStar !== null) {
      const newStars = [...stars];
      newStars[selectedStar] = true;
      setStars(newStars);
      setLastStarProgress(100);
      setSelectedStar(null);
    }
  };

  useEffect(() => {
    if (stars.some(Boolean)) {
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, DECAY_TIME - elapsed);
        const progress = (remaining / DECAY_TIME) * 100;

        setLastStarProgress(progress);

        if (progress === 0) {
          const lastActiveIndex = stars.lastIndexOf(true);
          if (lastActiveIndex !== -1) {
            const newStars = [...stars];
            newStars[lastActiveIndex] = false;
            setStars(newStars);
            setLastStarProgress(100);
          }
        }
      }, UPDATE_INTERVAL);

      return () => clearInterval(timer);
    }
  }, [DECAY_TIME, UPDATE_INTERVAL, stars]);



  return (
    <div className="max-h-screenbg-zinc-900 p-4">
      <Card className="max-w-md mx-auto bg-zinc-800 text-zinc">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-slate-400">
            Tick, tock...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <StarStats stars={stars} lastStarProgress={lastStarProgress} decayTime={DECAY_TIME} />
          </div>

          <div className="grid grid-cols-3 gap-6 p-4">
            {stars.map((_, index) => (
              <div key={index} className="flex justify-center">
                <Star
                  size={48}
                  style={starStyles[index]}
                  className="cursor-pointer"
                  onClick={() => handleStarClick(index)}
                />
              </div>
            ))}
          </div>
          <OTPProvider 
            isOpen={selectedStar !== null}
            onClose={() => setSelectedStar(null)}
            onSuccess={handleOTPSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );


};

export default StarChart;
