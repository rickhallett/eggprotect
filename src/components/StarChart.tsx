"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { CountdownClock } from './CountdownClock';

// Constants for color transitions
const BRIGHT_YELLOW = "#fbbf24"; // Tailwind yellow-400
const INACTIVE_GRAY = "#3f3f46"; // Tailwind zinc-700

const StarChart = () => {
  const DECAY_TIME = 5 * 1000; // 5 seconds for testing (change to 4 hours for production)
  const UPDATE_INTERVAL = 100;

  const [stars, setStars] = useState(Array(9).fill(true));
  const [lastStarProgress, setLastStarProgress] = useState(100);

  // Helper function to interpolate between two colors
  const interpolateColor = (progress: number) => {
    // Convert progress to decimal
    const t = progress / 100;

    // Parse the hex colors into RGB components
    const startRGB = {
      r: parseInt(BRIGHT_YELLOW.slice(1, 3), 16),
      g: parseInt(BRIGHT_YELLOW.slice(3, 5), 16),
      b: parseInt(BRIGHT_YELLOW.slice(5, 7), 16),
    };

    const endRGB = {
      r: parseInt(INACTIVE_GRAY.slice(1, 3), 16),
      g: parseInt(INACTIVE_GRAY.slice(3, 5), 16),
      b: parseInt(INACTIVE_GRAY.slice(5, 7), 16),
    };

    // Interpolate each component
    const resultRGB = {
      r: Math.round(startRGB.r * t + endRGB.r * (1 - t)),
      g: Math.round(startRGB.g * t + endRGB.g * (1 - t)),
      b: Math.round(startRGB.b * t + endRGB.b * (1 - t)),
    };

    // Convert back to hex
    return `#${resultRGB.r.toString(16).padStart(2, '0')}${resultRGB.g.toString(16).padStart(2, '0')}${resultRGB.b.toString(16).padStart(2, '0')}`;
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
  }, [stars]);

  const getStarStyle = (index: number) => {
    const lastActiveIndex = stars.lastIndexOf(true);
    const isActive = stars[index];

    if (!isActive) {
      return { fill: INACTIVE_GRAY, stroke: INACTIVE_GRAY };
    }

    if (index === lastActiveIndex) {
      const currentColor = interpolateColor(lastStarProgress);
      return { fill: currentColor, stroke: currentColor };
    }

    return { fill: BRIGHT_YELLOW, stroke: BRIGHT_YELLOW };
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
                  style={{ fill: getStarStyle(index).fill, stroke: getStarStyle(index).stroke }}
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
