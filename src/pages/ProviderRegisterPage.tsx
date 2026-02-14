import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRegister } from "@/hooks/useAuthHooks";
import {
  providerRegisterSchema,
  ProviderRegisterFormValues,
  STEPS,
} from "@/types/auth/provider-register/schema";

// Modules
import { PersonalInfoStep } from "@/components/auth/provider-register/steps/PersonalInfoStep";
import { OrganizationInfoStep } from "@/components/auth/provider-register/steps/OrganizationInfoStep";
import { ReviewStep } from "@/components/auth/provider-register/steps/ReviewStep";
import { OnboardingCarousel } from "@/components/auth/provider-register/OnboardingCarousel";

export default function ProviderRegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<ProviderRegisterFormValues>({
    resolver: zodResolver(providerRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
      abn: "",
      businessAddress: {
        street: "",
        city: "",
        state: "",
        postcode: "",
        country: "Australia",
      },
      primaryContactName: "",
      primaryContactPhone: "",
      primaryContactEmail: "",
    },
  });

  const handleNextStep = async () => {
    let fields: any[] = [];
    if (currentStep === 1)
      fields = [
        "firstName",
        "lastName",
        "phone",
        "email",
        "password",
        "confirmPassword",
      ];
    if (currentStep === 2)
      fields = [
        "organizationName",
        "abn",
        "businessAddress",
        "providerType",
        "primaryContactName",
      ];

    const isValid = await form.trigger(fields);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  async function onSubmit(values: ProviderRegisterFormValues) {
    // Only allow submission if we're on step 3 (Review)
    if (currentStep !== 3) {
      return;
    }

    try {
      await register.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: "provider",
        organizationName: values.organizationName,
        abn: values.abn,
        providerType: values.providerType,
        primaryContactName: values.primaryContactName,
        primaryContactPhone: values.primaryContactPhone,
        primaryContactEmail: values.primaryContactEmail,
        // Flatten address structure if backend requires it specifically differently, otherwise send object
        businessAddress: {
          street: values.businessAddress.street || "",
          city: values.businessAddress.city || "",
          state: values.businessAddress.state || "",
          postcode: values.businessAddress.postcode || "",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (register.isSuccess) {
      navigate(
        `/otp-verify?email=${encodeURIComponent(
          form.getValues("email")
        )}&userId=${register.data.userId}&register=true`
      );
    }
  }, [register.isSuccess, navigate, form]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left Form Side */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <img src="/logo.svg" alt="Logo" className="h-10 mx-auto mb-6" />
            <h1 className="text-3xl font-montserrat-bold text-gray-900">
              Provider Registration
            </h1>
            <p className="text-gray-600">
              Join our network of trusted providers
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-8 relative px-4">
            <div className="flex items-center justify-between relative">
              {STEPS.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center z-10 bg-gray-50"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-montserrat-bold text-sm ${currentStep >= step.number
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {currentStep > step.number ? "✓" : step.number}
                  </div>
                  <span className="text-xs mt-2 font-montserrat-medium text-gray-500 whitespace-nowrap">
                    {step.title}
                  </span>
                </div>
              ))}
              {/* Progress line background */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-0" />
              {/* Active progress line */}
              <div
                className="absolute top-4 left-4 h-0.5 bg-primary-600 -z-0 transition-all duration-300"
                style={{
                  width: `calc((100% - 2rem) * ${(currentStep - 1) / (STEPS.length - 1)})`
                }}
              />
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                // Prevent form submission on Enter key press
                if (e.key === 'Enter' && e.target instanceof HTMLElement && e.target.tagName !== 'BUTTON') {
                  e.preventDefault();
                }
              }}
              className="space-y-6"
            >
              {currentStep === 1 && <PersonalInfoStep form={form} />}
              {currentStep === 2 && <OrganizationInfoStep form={form} />}
              {currentStep === 3 && (
                <ReviewStep form={form} onEditStep={setCurrentStep} />
              )}

              <div className="flex gap-4 pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep((p) => p - 1)}
                    className="flex-1 h-12"
                  >
                    Previous
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 h-12 bg-primary-600 hover:bg-primary-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={register.isPending}
                    className="flex-1 h-12 bg-primary-600 hover:bg-primary-700"
                  >
                    {register.isPending ? "Creating Account..." : "Register"}
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-primary-600 font-montserrat-bold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Right Carousel Side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:flex lg:w-1/2 bg-[#F7F7F7] relative overflow-hidden"
      >
        <OnboardingCarousel />
      </motion.div>
    </div>
  );
}
