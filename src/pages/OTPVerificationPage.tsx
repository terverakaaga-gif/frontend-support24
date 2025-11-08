import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import authService from "@/api/services/authService";
import { CheckCircle } from "@solar-icons/react";

export default function OTPVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const userId = searchParams.get("userId") || "";
  const isForgotPassword = searchParams.get("forgotPassword") === "true";
  const isRegister = searchParams.get("register") === "true";

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(55);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Countdown timer
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
      setError("Please enter the complete 6-digit code");
      return;
    }

    if (!userId) {
      setError("Invalid verification link. Please try again.");
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      if (isForgotPassword) {
        // Redirect to reset password with verified flag
        setTimeout(() => {
          navigate(
            `/reset-password?email=${encodeURIComponent(
              email
            )}&userId=${userId}&otpCode=${otp}&verified=true`
          );
        }, 2000);
        return;
      } else {
        await authService.verifyEmail({
          userId,
          otpCode: otp,
        });
        setIsSuccess(true);
        toast.success("Email verified successfully!");
        // Redirect to login after short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data.error ||
        "Invalid or expired code. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email address is missing. Please try again.");
      return;
    }

    setCanResend(false);
    setCountdown(55);
    setError(null);
    setIsResending(true);

    try {
      await authService.forgotPassword({ email });
      toast.success("Verification code sent successfully!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data.error || "Failed to resend code. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setCanResend(true);
    } finally {
      setIsResending(false);
    }
  };

  // Redirect to forgot password if no email or userId
  if (!email || !userId) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#FDFDFD]">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-montserrat-bold text-gray-900">
            Invalid Verification Link
          </h2>
          <p className="text-gray-600 font-montserrat-semibold">
            This verification link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="text-orange-500 hover:text-orange-600 font-montserrat-semibold"
          >
            Request New Verification Code
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#FDFDFD]">
      {/* Left side - Illustration */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-[#F7F7F7] relative overflow-hidden"
      >
        {/* Illustration Container */}
        <div className="flex flex-col justify-center items-center w-full p-12 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-lg"
          >
            <img
              src="/new-res/otp-verify.svg"
              alt="OTP Verification"
              className="w-full h-auto object-contain"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - OTP Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center items-center w-full mb-16"
        >
          <img src="/logo.svg" alt="Support 24" className="h-12" />
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-montserrat-bold text-gray-900">
                  Email Verified Successfully!
                </h1>
                {!isRegister && (
                  <p className="text-gray-600 font-montserrat-semibold">
                    Redirecting you to reset your password...
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
                  OTP Code Verification
                </h1>
                <p className="font-montserrat-semibold text-gray-600">
                  We have sent a 6-digit code to{" "}
                  <span className="text-primary-600">{email}</span>.
                  <br />
                  Enter the code below to verify
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* OTP Input */}
              <div className="flex justify-center my-8">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setError(null);
                  }}
                  disabled={isVerifying}
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot
                      index={0}
                      className="w-14 h-14 text-xl font-montserrat-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-14 h-14 text-xl font-montserrat-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-14 h-14 text-xl font-montserrat-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <InputOTPSlot
                      index={3}
                      className="w-14 h-14 text-xl font-montserrat-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-14 h-14 text-xl font-montserrat-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <InputOTPSlot
                      index={5}
                      className="w-14 h-14 text-xl font-montserrat-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 font-montserrat-semibold">
                  Didn't receive code?{" "}
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      disabled={isResending}
                      className="text-orange-500 hover:text-orange-600 font-montserrat-semibold transition-colors disabled:opacity-50"
                    >
                      {isResending ? "Sending..." : "Resend"}
                    </button>
                  ) : (
                    <span className="text-orange-500">Resend</span>
                  )}
                </p>
                {!canResend && (
                  <p className="text-xs text-gray-500 mt-1">
                    You can resend code in {countdown} s
                  </p>
                )}
              </div>

              {/* Continue Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleVerify}
                  disabled={isVerifying || otp.length !== 6}
                  className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <>
                      Continue
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.5 15L12.5 10L7.5 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Back to Login */}
              <div className="text-center pt-6">
                <Link
                  to="/login"
                  className="text-orange-500 hover:text-orange-600 font-montserrat-semibold transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
