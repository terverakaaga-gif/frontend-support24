import { useState, useEffect } from "react";
import { CheckCircle, ConfettiMinimalistic, VerifiedCheck } from "@solar-icons/react";
import { cn } from "@/lib/utils";

// UI Components from Design System
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RADIUS } from "@/constants/design-system";

interface OnboardingModalProps {
  isOpen: boolean;
  worker: { name: string; role: string; avatar: string; rating: number; location: string; price: string } | null;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingModal({ isOpen, worker, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<'verify' | 'loading' | 'success'>('verify');
  const [checks, setChecks] = useState({
    agreementSent: false,
    agreementSigned: false,
    termsAgreed: false,
    expectations: false,
    codeOfConduct: false
  });

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('verify');
      setChecks({
        agreementSent: false,
        agreementSigned: false,
        termsAgreed: false,
        expectations: false,
        codeOfConduct: false
      });
    }
  }, [isOpen]);

  // Loading Simulation
  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => {
        setStep('success');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (!worker) return null;

  const allChecked = Object.values(checks).every(Boolean);

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAdd = () => {
    setStep('loading');
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>

      {/* 1. VERIFICATION CHECKLIST */}
      {step === 'verify' && (
        <DialogContent className={cn(RADIUS.lg, 'overflow-hidden max-w-md p-0')}>
          {/* Header Badge */}
          <div className="flex justify-end p-4 pb-0">
            <Badge className="bg-primary-50 text-primary-600 hover:bg-primary-50 gap-1 rounded-lg">
              <CheckCircle className="w-4 h-4" /> Interview Completed
            </Badge>
          </div>

          {/* Profile Summary */}
          <DialogHeader className="flex flex-col items-center px-6 pb-6">
            <Avatar className="w-20 h-20 border-4 border-white shadow-sm mb-2">
              <AvatarImage src={worker.avatar} alt={worker.name} />
              <AvatarFallback className="text-lg font-montserrat-bold bg-primary-100 text-primary-600">
                {getInitials(worker.name)}
              </AvatarFallback>
            </Avatar>
            <DialogTitle className="flex items-center gap-1 text-xl font-montserrat-bold">
              {worker.name}
              <VerifiedCheck className="w-5 h-5 text-primary-600" />
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm mb-2 text-center">
              {worker.role}
            </DialogDescription>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="text-yellow-500">★</span> {worker.rating}</span>
              <span className="text-gray-300">|</span>
              <span>{worker.location}</span>
              <span className="text-gray-300">|</span>
              <span>{worker.price}</span>
            </div>
          </DialogHeader>

          {/* Checklist Area */}
          <div className="bg-gray-50 p-6 space-y-4">
            <h4 className="font-montserrat-bold text-gray-900 text-sm mb-2">Onboarding Verification</h4>

            {[
              { id: 'agreementSent', label: 'Letter of agreement sent' },
              { id: 'agreementSigned', label: 'Letter of agreement signed' },
              { id: 'termsAgreed', label: 'Terms and conditions agreed' },
              { id: 'expectations', label: 'Roles of expectation explained' },
              { id: 'codeOfConduct', label: 'Code of conduct acknowledged' }
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => toggleCheck(item.id as keyof typeof checks)}
              >
                <label
                  htmlFor={item.id}
                  className="text-sm text-gray-700 font-montserrat-medium group-hover:text-gray-900 cursor-pointer"
                >
                  {item.label}
                </label>
                <Checkbox
                  id={item.id}
                  checked={checks[item.id as keyof typeof checks]}
                  onCheckedChange={() => toggleCheck(item.id as keyof typeof checks)}
                  onClick={() => toggleCheck(item.id as keyof typeof checks)}

                  className="h-6 w-6 rounded border-gray-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                />
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <DialogFooter className="p-6 pt-4 bg-gray-50 border-t border-gray-100">
            <Button
              onClick={handleAdd}
              disabled={!allChecked}
              className={cn(
                "w-full py-6 rounded-xl font-montserrat-bold",
                allChecked
                  ? "bg-primary-600 hover:bg-primary-700 text-white"
                  : "bg-primary-200 text-white cursor-not-allowed"
              )}
            >
              Add to Workforce
            </Button>
          </DialogFooter>
        </DialogContent>
      )}

      {/* 2. LOADING STATE */}
      {step === 'loading' && (
        <DialogContent className="max-w-sm p-10 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="relative w-20 h-20 mb-6">
            <svg className="animate-spin w-full h-full text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-montserrat-bold text-primary-600 text-sm">95%</span>
          </div>
          <DialogTitle className="font-montserrat-bold text-gray-900 text-sm">
            Adding to workforce....... Please wait
          </DialogTitle>
        </DialogContent>
      )}

      {/* 3. SUCCESS STATE */}
      {step === 'success' && (
        <DialogContent className="max-w-md p-8 rounded-2xl text-center">
          <div className="w-16 h-16 bg-white mx-auto mb-4 flex items-center justify-center">
            <ConfettiMinimalistic className="w-12 h-12 text-yellow-500" />
          </div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-montserrat-bold text-gray-900">
              Added to Workforce Successfully
            </DialogTitle>
            <DialogDescription className="text-gray-600 px-4 text-sm leading-relaxed">
              You have successfully added <span className="font-montserrat-bold text-gray-900">Support Worker</span> {worker?.name} to your workforce
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8">
            <Button
              onClick={onComplete}
              className="w-full py-6 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-bold rounded-xl"
            >
              Continue to Workforce
            </Button>
          </DialogFooter>
        </DialogContent>
      )}

    </Dialog>
  );
}