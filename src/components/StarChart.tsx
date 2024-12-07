"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useStarStyles } from '@/lib/utils';
import StarStats from './StarStats';
import { OTPForm } from './OPTForm';

const StarChart = () => {
  const DECAY_TIME = parseInt(process.env.NEXT_PUBLIC_DECAY_TIME || "3000");
  const UPDATE_INTERVAL = 100; // Fast updates for smooth animation
  const API_THROTTLE = 3000; // Minimum time between API calls (3 seconds)

  const [stars, setStars] = useState(Array(9).fill(true));
  const [lastStarProgress, setLastStarProgress] = useState(100);
  const [activeOTP, setActiveOTP] = useState(false);
  const [loading, setLoading] = useState(true);
  const starStyles = useStarStyles(stars, lastStarProgress);
  const lastRequestTimeRef = useRef(0);
  const pendingStateUpdateRef = useRef<{
    position: number;
    active: boolean;
    expiresAt: Date;
  } | null>(null);

  // Fetch initial star state
  useEffect(() => {
    const fetchStarState = async () => {
      const response = await fetch('/api/stars');
      const data = await response.json();
      const newStars = Array(9).fill(false);
      const now = Date.now();

      data.forEach((star: { position: number, active: boolean, expiresAt: string }) => {
        newStars[star.position] = star.active;
        if (star.active) {
          const timeLeft = new Date(star.expiresAt).getTime() - now;
          const progress = (timeLeft / DECAY_TIME) * 100;
          if (star.position === newStars.lastIndexOf(true)) {
            setLastStarProgress(Math.max(0, progress));
          }
        }
      });

      setStars(newStars);
      setLoading(false);
    };
    fetchStarState();
  }, [DECAY_TIME]);

  const handleOTPSuccess = async () => {
    const inactiveCount = stars.filter(star => !star).length;
    if (inactiveCount > 0) {
      const newStars = [...stars];
      const firstInactiveIndex = newStars.indexOf(false);
      newStars[firstInactiveIndex] = true;
      setStars(newStars);

      // Calculate new expiry time based on position
      const timeUntilExpiry = DECAY_TIME * (9 - firstInactiveIndex);
      const expiresAt = new Date(Date.now() + timeUntilExpiry);

      pendingStateUpdateRef.current = {
        position: firstInactiveIndex,
        active: true,
        expiresAt: expiresAt
      };
      updateStarAPI();

      setLastStarProgress(100);
    }
    setActiveOTP(false);
  };

  useEffect(() => {
    if (stars.some(Boolean)) {
      const timer = setInterval(async () => {
        const now = Date.now();
        const lastActiveIndex = stars.lastIndexOf(true);

        if (lastActiveIndex !== -1) {
          const response = await fetch('/api/stars');
          const data = await response.json();
          const star = data.find((s: { position: number }) => s.position === lastActiveIndex);

          if (star) {
            const timeLeft = new Date(star.expiresAt).getTime() - now;
            const progress = (timeLeft / DECAY_TIME) * 100;
            setLastStarProgress(Math.max(0, progress));

            if (progress <= 0) {
              const newStars = [...stars];
              newStars[lastActiveIndex] = false;
              setStars(newStars);

              pendingStateUpdateRef.current = {
                position: lastActiveIndex,
                active: false,
                expiresAt: new Date(now)
              };
              updateStarAPI();

              setLastStarProgress(100);
            }
          }
        }
      }, UPDATE_INTERVAL);

      if (stars.some(star => !star)) {
        setActiveOTP(true);
      }

      return () => clearInterval(timer);
    }
  }, [DECAY_TIME, UPDATE_INTERVAL, stars]);

  // Throttled API update function
  const updateStarAPI = async () => {
    const now = Date.now();
    if (pendingStateUpdateRef.current && now - lastRequestTimeRef.current >= API_THROTTLE) {
      const update = pendingStateUpdateRef.current;
      await fetch('/api/stars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });
      lastRequestTimeRef.current = now;
      pendingStateUpdateRef.current = null;
    }
  };

  // Separate effect for handling API updates
  useEffect(() => {
    const apiUpdateTimer = setInterval(() => {
      updateStarAPI();
    }, API_THROTTLE);

    return () => clearInterval(apiUpdateTimer);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
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
            <StarStats stars={stars} lastStarProgress={lastStarProgress} decayTime={DECAY_TIME} />
          </div>
          <div className="grid grid-cols-3 gap-6 p-4">
            {stars.map((_, index) => (
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
        isActive={activeOTP}
        onSuccess={handleOTPSuccess}
      />
    </div>
  );


};

export default StarChart;
