
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onResend: () => Promise<void>;
}

export function OTPVerification({ email, onVerified, onResend }: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a complete 6-digit code");
      return;
    }

    setIsVerifying(true);

    try {
      // This is a mock verification for demonstration
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, any 6-digit code is valid
      toast.success("Email successfully verified!");
      onVerified();
    } catch (error) {
      toast.error("Failed to verify email. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(30);
    
    try {
      await onResend();
      toast.success("A new verification code has been sent to your email");
    } catch (error) {
      toast.error("Failed to resend verification code");
      setCanResend(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="text-muted-foreground mt-2">
          We've sent a 6-digit verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="flex justify-center my-8">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button 
        onClick={handleVerify} 
        disabled={isVerifying || otp.length !== 6} 
        className="w-full"
      >
        {isVerifying ? "Verifying..." : "Verify Email"}
      </Button>

      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          {canResend ? (
            <Button 
              variant="link" 
              className="p-0 h-auto" 
              onClick={handleResend}
            >
              Resend Code
            </Button>
          ) : (
            <span>Resend code in {countdown}s</span>
          )}
        </p>
      </div>
    </div>
  );
}
