import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CloseCircle, MapPoint } from "@solar-icons/react";
import { 
  MODAL_OVERLAY, 
  MODAL_CONTENT, 
  MODAL_HEADER, 
  MODAL_BODY, 
  FORM_GROUP, 
  FORM_LABEL, 
  FORM_INPUT, 
  FORM_TEXTAREA,
  BUTTON_PRIMARY,
  cn 
} from "@/lib/design-utils";
import { Button } from "@/components/ui/button";
import { useRegisterForEvent } from "@/hooks/useEventHooks";
import { useProfile } from "@/hooks/useProfile";

interface EventRegistrationModalProps {
  eventId: string;
  eventName: string;
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

type RegistrationFormData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  reason: string;
};

export default function EventRegistrationModal({
  eventId,
  eventName,
  isOpen,
  onClose,
  userEmail,
  userName
}: EventRegistrationModalProps) {
  const { data: profileData } = useProfile();
  const [useProfileLocation, setUseProfileLocation] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegistrationFormData>({
    defaultValues: {
      fullName: userName || "",
      email: userEmail || "",
      location: ""
    }
  });

  const locationValue = watch("location");

  // When useProfileLocation is toggled, populate or clear location
  useEffect(() => {
    if (useProfileLocation && profileData?.user?.address) {
      setValue("location", profileData.user.address);
    } else if (!useProfileLocation) {
      setValue("location", "");
    }
  }, [useProfileLocation, profileData?.user?.address, setValue]);

  const registerMutation = useRegisterForEvent();

  const onSubmit = (data: RegistrationFormData) => {
    registerMutation.mutate(
      { eventId, data },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  if (!isOpen) return null;

  const profileAddress = profileData?.user?.address;
  const hasProfileLocation = !!profileAddress;

  return (
    <div className={MODAL_OVERLAY}>
      <div className={cn(MODAL_CONTENT, "max-w-2xl")}>
        <div className={MODAL_HEADER}>
          <h2 className="text-2xl font-montserrat-bold text-gray-900">Register for Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <CloseCircle className="w-6 h-6" />
          </button>
        </div>

        <div className={MODAL_BODY}>
          <p className="mb-6 text-gray-600 text-sm leading-relaxed">
            Enter your details below to register for <span className="font-semibold text-gray-900">{eventName}</span>. 
            Additional information will be sent to your email.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={FORM_GROUP}>
                <label className={FORM_LABEL}>Full Name</label>
                <input 
                  {...register("fullName", { required: "Name is required" })}
                  className={cn(FORM_INPUT, errors.fullName && "border-red-500")}
                  placeholder="John Doe Singh"
                />
                {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName.message}</span>}
              </div>

              <div className={FORM_GROUP}>
                <label className={FORM_LABEL}>Email Address</label>
                <input 
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                  className={cn(FORM_INPUT, errors.email && "border-red-500")}
                  type="email"
                  placeholder="johndoe@gmail.com"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
              </div>
            </div>

            <div className={FORM_GROUP}>
              <label className={FORM_LABEL}>Phone Number</label>
              <input 
                {...register("phone", { required: "Phone is required" })}
                className={cn(FORM_INPUT, errors.phone && "border-red-500")}
                placeholder="+61 67635567"
              />
              {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
            </div>

            <div className={FORM_GROUP}>
              <div className="flex items-center justify-between mb-2">
                <label className={FORM_LABEL}>Location</label>
                {hasProfileLocation && (
                  <button
                    type="button"
                    onClick={() => setUseProfileLocation(!useProfileLocation)}
                    className={cn(
                      "text-xs font-medium px-3 py-1 rounded-full transition-all duration-200 flex items-center gap-1",
                      useProfileLocation
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <MapPoint className="w-3 h-3" />
                    {useProfileLocation ? "Using Profile Location" : "Use My Location"}
                  </button>
                )}
              </div>
              <input 
                {...register("location", { required: "Location is required" })}
                className={cn(FORM_INPUT, errors.location && "border-red-500", useProfileLocation && "bg-gray-50 cursor-not-allowed")}
                placeholder="123 Main Street, Anytown, AU"
                disabled={useProfileLocation}
              />
              {errors.location && <span className="text-red-500 text-xs mt-1">{errors.location.message}</span>}
            </div>

            <div className={FORM_GROUP}>
              <label className={FORM_LABEL}>Reason for Attending (Optional)</label>
              <textarea 
                {...register("reason")}
                className={cn(FORM_TEXTAREA, "min-h-24")}
                placeholder="Tell us why you're interested in attending this event..."
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                type="submit" 
                className={cn(BUTTON_PRIMARY, "flex-1")}
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Registering..." : "Register for Event"}
              </button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}