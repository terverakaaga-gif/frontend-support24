import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import authService from "@/api/services/authService";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const userId = searchParams.get("userId") || "";
  
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.otp.trim()) {
      setError("Please enter the verification code");
      return false;
    }
    if (!formData.newPassword) {
      setError("Please enter a new password");
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!userId) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      await authService.resetPassword({
        userId,
        otpCode: formData.otp,
        password: formData.newPassword,
      });
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // Redirect to forgot password if no userId
  if (!userId) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
          <p className="text-gray-600">This password reset link is invalid or has expired.</p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-[#2195F2] hover:text-[#1976D2] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Brand section - Left side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-[#2195F2] p-12 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_60%)]"></div>

        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="z-10 mb-auto"
        >
           <div className="flex items-center gap-2 mb-2">
            {/* <Heart className="h-8 w-8 text-white drop-shadow-md" fill="white" /> */}
            <img src="/favicon.svg" alt="Guardian Care Pro" className="h-10 w-10" />
            <span className="text-2xl font-bold text-white drop-shadow-sm">
              GuardianCare+
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="z-10 space-y-8"
        >
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Create New Password
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              You're almost done! Enter the verification code we sent to your email
              and create a new secure password for your account.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 flex flex-col items-center shadow-lg hover:bg-white/25 transition-all">
              <Lock className="h-8 w-8 text-white mb-2" />
              <h3 className="text-white font-medium">Secure Reset</h3>
              <p className="text-white/80 text-sm text-center">
                OTP verification for security
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 flex flex-col items-center shadow-lg hover:bg-white/25 transition-all">
              <CheckCircle className="h-8 w-8 text-white mb-2" />
              <h3 className="text-white font-medium">Almost There</h3>
              <p className="text-white/80 text-sm text-center">
                Last step to regain access
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="z-10 mt-auto"
        >
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} Guardian Care Pro. All rights reserved.
          </p>
        </motion.div>
      </motion.div>

      {/* Form section - Right side */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-[#2195F2]" fill="#2195F2" />
              <span className="text-2xl font-bold text-gray-900">Guardian Care Pro</span>
            </div>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
              <CardDescription className="text-gray-600">
                Enter the verification code and your new password
                {email && (
                  <span className="block mt-1 text-sm font-medium text-[#2195F2]">
                    Code sent to: {email}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Password Reset Successfully!</h3>
                    <p className="text-gray-600 text-sm">
                      Your password has been updated. You can now login with your new password.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleLoginRedirect}
                      className="w-full bg-[#2195F2] hover:bg-[#1976D2]"
                    >
                      Continue to Login
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={formData.otp}
                      onChange={handleInputChange("otp")}
                      required
                      className="h-11 text-center text-lg tracking-widest"
                      disabled={isLoading}
                      maxLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleInputChange("newPassword")}
                        required
                        className="h-11 pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-700 leading-relaxed">
                        <span className="font-medium">Password requirements:</span> At least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange("confirmPassword")}
                        required
                        className="h-11 pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-[#2195F2] hover:bg-[#1976D2] text-white font-medium"
                    disabled={isLoading || !formData.otp.trim() || !formData.newPassword || !formData.confirmPassword}
                  >
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-sm text-[#2195F2] hover:text-[#1976D2] font-medium inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* <div className="text-center text-sm text-gray-600">
            Didn't receive the code?{" "}
            <Link to="/forgot-password" className="text-[#2195F2] hover:text-[#1976D2] font-medium">
              Resend
            </Link>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
} 