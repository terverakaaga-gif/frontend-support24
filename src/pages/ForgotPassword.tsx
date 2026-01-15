import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/Spinner";
import { useForgotPassword } from "@/hooks/useAuthHooks";
import { AltArrowRight, CheckCircle } from "@solar-icons/react";
import {
  cn,
  AUTH_PAGE_WRAPPER,
  AUTH_PANEL,
  AUTH_CAROUSEL_PANEL,
  AUTH_FORM_CONTAINER,
  AUTH_LOGO_CONTAINER,
  AUTH_HEADING,
  AUTH_SUBHEADING,
  AUTH_INPUT,
  AUTH_BUTTON_PRIMARY,
  AUTH_LABEL,
  AUTH_LINK,
  FLEX_ROW_CENTER,
  FLEX_COL_CENTER,
} from "@/lib/design-utils";
import { BG_COLORS, TEXT_COLORS, TEXT_SIZE } from "@/constants/design-system";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // mutation for forgot password
  const { data, error, mutateAsync, isSuccess, isPending, isError } =
    useForgotPassword();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const response = await mutateAsync(email);

        if (isSuccess) {
          setTimeout(() => {
            navigate(
              `/otp-verify?email=${encodeURIComponent(email)}&userId=${
                response.userId
              }&forgotPassword=true`
            );
          }, 3000);
        }
      } catch (err: any) {
        // Error handling is done in the mutation
      }
    },
    [email, isSuccess, mutateAsync, navigate]
  );

  return (
    <div className={AUTH_PAGE_WRAPPER}>
      {/* Left side - Illustration */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={AUTH_CAROUSEL_PANEL}
      >
        {/* Illustration Container */}
        <div className={cn(FLEX_COL_CENTER, "w-full p-12 relative z-10")}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-lg"
          >
            <img
              src="/new-res/forgotpassword.svg"
              alt="Forgot Password"
              className="w-full h-auto object-contain"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className={AUTH_PANEL}
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={AUTH_LOGO_CONTAINER}
        >
          <img src="/logo.svg" alt="Support 24" className="h-12" />
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className={cn(AUTH_FORM_CONTAINER, "space-y-8")}
        >
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(FLEX_COL_CENTER, "space-y-6")}
            >
              <div className={cn(
                "w-16 h-16",
                BG_COLORS.successLight,
                "rounded-full",
                FLEX_ROW_CENTER,
                "mx-auto"
              )}>
                <CheckCircle className={cn("w-8 h-8", TEXT_COLORS.success)} />
              </div>
              <div className={cn(FLEX_COL_CENTER, "space-y-2")}>
                <h1 className={AUTH_HEADING}>Check your email</h1>
                <p className={AUTH_SUBHEADING}>
                  We've sent password reset instructions to {email}
                </p>
              </div>
              <Button asChild className={AUTH_BUTTON_PRIMARY}>
                <Link
                  to={`/otp-verify?email=${encodeURIComponent(email)}&userId=${
                    data?.userId
                  }&forgotPassword=true`}
                >
                  Next
                  <AltArrowRight className="w-4 h-4 mr-2" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className={FLEX_COL_CENTER}>
                <h1 className={AUTH_HEADING}>Forgot Password</h1>
                <p className={AUTH_SUBHEADING}>
                  Please enter your email and we will send an OTP code
                  <br />
                  in the next step to reset your password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}

                {/* Email Field */}
                <div className={cn(FLEX_COL_CENTER, "space-y-2")}>
                  <Label htmlFor="email" className={AUTH_LABEL}>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g johndoe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={AUTH_INPUT}
                    disabled={isPending}
                  />
                </div>

                {/* Continue Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className={AUTH_BUTTON_PRIMARY}
                    disabled={isPending || !email.trim()}
                  >
                    {isPending ? (
                      <div className={cn(FLEX_ROW_CENTER, "gap-2")}>
                        <Spinner />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className={cn(FLEX_ROW_CENTER, "gap-2")}>
                        Continue
                        <AltArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Back to Login */}
              <div className={FLEX_COL_CENTER}>
                <Link to="/login" className={AUTH_LINK}>
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
