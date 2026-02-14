import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { cn, AUTH_BUTTON_PRIMARY, FLEX_COL_CENTER } from "@/lib/design-utils";
import { TEXT_SIZE, FONT_WEIGHT, TEXT_COLORS } from "@/constants/design-system";

interface OTPVerificationProps {
  email: string;
  onVerified: (otp: string) => void;
  onResend: () => Promise<void>;
  isVerifying?: boolean;
  isResending?: boolean;
}

export function OTPVerification({ 
  email, 
  onVerified, 
  onResend,
  isVerifying = false,
  isResending = false
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
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

    try {
      await onVerified(otp);
    } catch (error) {
      // Error is handled by the API client or parent component
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(30);
    
    try {
      await onResend();
    } catch (error) {
      // Error is handled by the API client
      setCanResend(true);
    }
  };

  return (
    <ScrollArea className="h-[400px] w-full">
      <div className="space-y-6 px-4 py-2">
        <div className={FLEX_COL_CENTER}>
          <h2 className={cn(TEXT_SIZE["2xl"], FONT_WEIGHT.bold, "font-montserrat-bold")}>Verify Your Email</h2>
          <p className={cn(TEXT_COLORS.muted, "mt-2")}>
            We've sent a 6-digit verification code to <span className={FONT_WEIGHT.semibold}>{email}</span>
          </p>
        </div>

        <div className={cn(FLEX_COL_CENTER, "my-8")}>
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
          className={AUTH_BUTTON_PRIMARY}
        >
          {isVerifying ? "Verifying..." : "Verify Email"}
        </Button>

        <div className={cn(FLEX_COL_CENTER, "mt-4")}>
          <p className={cn(TEXT_SIZE.sm, TEXT_COLORS.muted)}>
            Didn't receive the code?{" "}
            {canResend ? (
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend Code"}
              </Button>
            ) : (
              <span>Resend code in {countdown}s</span>
            )}
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}