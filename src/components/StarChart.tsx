"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { CountdownClock } from './CountdownClock';

const StarChart = () => {
  // const DECAY_TIME = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  const DECAY_TIME = 5 * 1000; // 10 seconds in milliseconds
  const UPDATE_INTERVAL = 100; // Update every second

  const [stars, setStars] = useState(Array(9).fill(true));
  const [lastStarProgress, setLastStarProgress] = useState(100);

  useEffect(() => {
    if (stars.some(Boolean)) { // Only run if there are active stars
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, DECAY_TIME - elapsed);
        const progress = (remaining / DECAY_TIME) * 100;

        setLastStarProgress(progress);

        if (progress === 0) {
          // Find the last active star and deactivate it
          const lastActiveIndex = stars.lastIndexOf(true);
          if (lastActiveIndex !== -1) {
            const newStars = [...stars];
            newStars[lastActiveIndex] = false;
            setStars(newStars);
            setLastStarProgress(100); // Reset progress for next star
          }
        }
      }, UPDATE_INTERVAL);

      return () => clearInterval(timer);
    }
  }, [DECAY_TIME, stars]);

  // Calculate color for the last active star
  const getStarStyle = (index: number) => {
    const lastActiveIndex = stars.lastIndexOf(true);
    const isActive = stars[index];

    if (!isActive) return 'fill-zinc-700 text-zinc-700';
    if (index === lastActiveIndex) {
      // First half: bright yellow (60deg hue, 100% sat, 50% light) to light yellow (60deg hue, 100% sat, 85% light)
      // Second half: light yellow to grey (60deg hue, 0% sat, 85% light)
      let saturation = 100;
      let lightness = 50;
      
      if (lastStarProgress > 50) {
        // First half: increase lightness from 50% to 85%
        lightness = 50 + ((100 - lastStarProgress) * 0.7);
      } else {
        // Second half: keep high lightness but reduce saturation
        lightness = 85;
        saturation = lastStarProgress * 2; // will go from 100 to 0
      }
      
      const color = `hsl(60,${saturation}%,${lightness}%)`;
      return `fill-[${color}] text-[${color}] stroke-[${color}]`;
    }
    return 'fill-yellow-400 text-yellow-400 stroke-yellow-400';
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <Card className="max-w-md mx-auto bg-zinc-800 text-zinc">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Accountability Stars
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress indicator */}
          <div className="mb-6">
            <p className="text-sm text-slate-600 text-center">
              {stars.filter(Boolean).length} of {stars.length} stars active
            </p>
            {stars.some(Boolean) && (
              <>
                <div className="mt-2">
                  <Progress value={lastStarProgress} />
                </div>
                <div className="mt-2 text-center">
                  <CountdownClock 
                    targetTime={Math.max(0, DECAY_TIME * (lastStarProgress / 100))} 
                  />
                </div>
              </>
            )}
          </div>

          {/* Star grid */}
          <div className="grid grid-cols-3 gap-6 p-4">
            {stars.map((isActive, index) => (
              <div key={index} className="flex justify-center">
                <Star
                  size={48}
                  className={`transition-all duration-300 ${getStarStyle(index)}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StarChart;
