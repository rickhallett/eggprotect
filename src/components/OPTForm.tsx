"use client"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Button } from "./ui/button"

interface OTPFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function OTPForm({ isOpen, onClose, onSuccess }: OTPFormProps) {
  const { toast } = useToast()
  const [value, setValue] = useState("")

  const handleValueChange = (input: string) => {
    console.log(input)
    setValue(input)

    if (input.length === 6) {
      // Here you would normally validate against a backend
      if (input === "123456") {
        toast({
          title: "Star restored!",
          description: "Your star has been reactivated.",
        })
        onSuccess()
        setValue("")
      } else {
        toast({
          variant: "destructive",
          title: "Invalid code",
          description: "Please try again.",
        })
      }

    }
  }

  if (!isOpen) return null

  return (
    <div className="bg-zinc-800 p-6 rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-4 text-slate-200 text-center">Reclaim a star</h2>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(e) => handleValueChange(e)}
      >
        <InputOTPGroup className="gap-2">
          <InputOTPSlot index={0} className="bg-zinc-700 rounded-md border-none" />
          <InputOTPSlot index={1} className="bg-zinc-700 rounded-md border-none" />
          <InputOTPSlot index={2} className="bg-zinc-700 rounded-md border-none" />
          <InputOTPSlot index={3} className="bg-zinc-700 rounded-md border-none" />
          <InputOTPSlot index={4} className="bg-zinc-700 rounded-md border-none" />
          <InputOTPSlot index={5} className="bg-zinc-700 rounded-md border-none" />
        </InputOTPGroup>
      </InputOTP>
      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  )
}
