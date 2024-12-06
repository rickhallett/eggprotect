import { Progress } from "@/components/ui/progress";

function ProgressBar({ lastStarProgress }: { lastStarProgress: number }) {
  return <div className="mt-2">
    <Progress value={lastStarProgress} />
  </div>;
}

export default ProgressBar;