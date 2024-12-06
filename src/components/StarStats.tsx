import { CountdownClock } from "./CountdownClock";
import ProgressBar from "@/components/ProgressBar";

interface StarStatsProps {
  stars: boolean[];
  lastStarProgress: number;
  decayTime: number;
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

export default function StarStats({ stars, lastStarProgress, decayTime }: StarStatsProps) {
  return (
    <div className="flex flex-col items-center">
      <StarCount stars={stars} />
      <ProgressBar lastStarProgress={lastStarProgress} />
      <CountdownClock targetTime={Math.max(0, decayTime * (lastStarProgress / 100))} />
    </div>
  );
};