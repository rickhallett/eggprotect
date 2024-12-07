import { CountdownClock } from "./CountdownClock";
import ProgressBar from "@/components/ProgressBar";

interface StarStatsProps {
  stars: boolean[];
  lastStarProgress: number;
  decayTime: number;
  expiryTime?: string;
}

interface StarCountProps {
  stars: boolean[]
}

export function StarCount({ stars }: StarCountProps) {
  return (
    <p className="text-sm text-slate-600 text-center">
      {stars.filter(Boolean).length} of {stars.length} stars active
    </p>
  )
}

export default function StarStats({ stars, lastStarProgress, decayTime, expiryTime }: StarStatsProps) {
  const getRemainingTime = () => {
    if (!expiryTime) return 0;
    const timeLeft = new Date(expiryTime).getTime() - Date.now();
    return Math.max(0, timeLeft);
  };

  return (
    <div className="flex flex-col items-center">
      <StarCount stars={stars} />
      {stars.some(Boolean) && (
        <>
          <div className="mt-2 w-full">
            <ProgressBar lastStarProgress={lastStarProgress} />
          </div>
          <div className="mt-2">
            <CountdownClock targetTime={getRemainingTime()} />
          </div>
        </>
      )}
    </div>
  );
};
