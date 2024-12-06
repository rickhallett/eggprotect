import { Progress } from "@/components/ui/progress";

function ProgressBar({ lastStarProgress }: { lastStarProgress: number }) {
  return <Progress value={lastStarProgress} />;
}

export default ProgressBar;
