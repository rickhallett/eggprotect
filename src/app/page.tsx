import StarChart from "@/components/StarChart";
import { InputOTPForm } from "@/components/InputOTPForm";
export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <StarChart />
      <InputOTPForm />
    </div>
  );
}
