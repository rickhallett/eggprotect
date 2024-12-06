"use client"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useToast } from "@/hooks/use-toast"

interface OTPProviderProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function OTPProvider({ isOpen, onClose, onSuccess }: OTPProviderProps) {
  const { toast } = useToast()

  const handleValueChange = (value: string) => {
    if (value.length === 6) {
      // Here you would normally validate against a backend
      if (value === "123456") {
        toast({
          title: "Star restored!",
          description: "Your star has been reactivated.",
        })
        onSuccess()
      } else {
        toast({
          variant: "destructive",
          title: "Invalid code",
          description: "Please try again.",
        })
      }
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-zinc-800 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-slate-200">Enter Recovery Code</h2>
        <InputOTP
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup className="gap-2">
              {slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} />
              ))}
            </InputOTPGroup>
          )}
          onComplete={handleValueChange}
        />
      </div>
    </div>
  )
}
