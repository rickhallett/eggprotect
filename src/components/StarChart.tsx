import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const StarChart = () => {
  // This would be replaced with actual data/state management
  const stars = Array(7).fill(true); // Example: 7 stars, all active

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
          </div>

          {/* Star grid */}
          <div className="grid grid-cols-3 gap-6 p-4">
            {stars.map((isActive, index) => (
              <div key={index} className="flex justify-center">
                <Star
                  size={48}
                  className={`transition-all duration-300 ${isActive
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-slate-200 text-slate-200'
                    }`}
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