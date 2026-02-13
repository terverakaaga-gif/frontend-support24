import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoCircle } from "@solar-icons/react";
import { cn } from "@/lib/design-utils";
import { RADIUS, BG_COLORS, TEXT_COLORS } from "@/constants/design-system";
import { useNavigate } from "react-router-dom";

interface OnboardingNoticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    onContinueToOnboarding?: () => void;
}

export function OnboardingNoticeModal({
    isOpen,
    onClose,
    title = "Complete Your Onboarding",
    description = "To perform this action, you need to complete your onboarding process first. This helps us ensure a safe and reliable community for everyone.",
    onContinueToOnboarding,
}: OnboardingNoticeModalProps) {
    const navigate = useNavigate();

    const handleContinue = () => {
        if (onContinueToOnboarding) {
            onContinueToOnboarding();
        } else {
            // Default redirection based on common convention if needed, 
            // though usually explicit via prop is better
            navigate("/setup-choice");
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={cn("max-w-md", RADIUS.lg, BG_COLORS.white)}>
                <DialogHeader className="flex flex-col items-center gap-4 pt-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                        <InfoCircle className="w-10 h-10 text-primary-600" />
                    </div>
                    <div className="text-center">
                        <DialogTitle className="text-xl font-montserrat-bold text-gray-900 mb-2">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 font-montserrat leading-relaxed">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 w-full mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 font-montserrat-semibold"
                    >
                        Not Now
                    </Button>
                    <Button
                        onClick={handleContinue}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
                    >
                        Complete Onboarding
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
