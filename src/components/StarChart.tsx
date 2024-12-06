"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { CountdownClock } from './CountdownClock';
import { useStarStyles } from '@/lib/utils';
import dotenv from 'dotenv';

dotenv.config();

const StarChart = () => {
  const DECAY_TIME = parseInt(process.env.DECAY_TIME || "5000");
  const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL || "100");

  const [stars, setStars] = useState(Array(9).fill(true));
  const [lastStarProgress, setLastStarProgress] = useState(100);

  const starStyles = useStarStyles(stars, lastStarProgress);

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
  }, [DECAY_TIME, stars]);



  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <Card className="max-w-md mx-auto bg-zinc-800 text-zinc">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Accountability Stars
          </CardTitle>
        </CardHeader>
        <CardContent>
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

          <div className="grid grid-cols-3 gap-6 p-4">
            {stars.map((isActive, index) => (
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
    </div>
  );
};

export default StarChart;
