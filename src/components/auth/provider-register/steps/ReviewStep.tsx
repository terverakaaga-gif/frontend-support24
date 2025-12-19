import { memo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ProviderRegisterFormValues } from "@/types/auth/provider-register/schema";
import { motion } from "framer-motion";

interface Props {
  form: UseFormReturn<ProviderRegisterFormValues>;
  onEditStep: (step: number) => void;
}

export const ReviewStep = memo(({ form, onEditStep }: Props) => {
  const values = form.getValues();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-montserrat-bold text-gray-900 mb-4">
        Review Your Information
      </h3>

      {/* Personal Info Review */}
      <ReviewSection title="Personal Information" onEdit={() => onEditStep(1)}>
        <ReviewRow
          label="Name"
          value={`${values.firstName} ${values.lastName}`}
        />
        <ReviewRow label="Phone" value={values.phone} />
        <ReviewRow label="Email" value={values.email} fullWidth />
      </ReviewSection>

      {/* Org Info Review */}
      <ReviewSection
        title="Organization Information"
        onEdit={() => onEditStep(2)}
      >
        <ReviewRow
          label="Organization Name"
          value={values.organizationName}
          fullWidth
        />
        <ReviewRow label="ABN" value={values.abn} />
        <ReviewRow
          label="Type"
          value={values.providerType?.replace("_", " ")}
          capitalize
        />
        <ReviewRow
          label="Address"
          value={`${values.businessAddress?.street}, ${values.businessAddress?.city}`}
          fullWidth
        />

        <div className="col-span-2 border-t pt-2 mt-1">
          <p className="font-semibold text-gray-500 mb-2">Primary Contact</p>
          <div className="grid grid-cols-2 gap-3">
            <ReviewRow label="Name" value={values.primaryContactName} />
            <ReviewRow label="Phone" value={values.primaryContactPhone} />
            <ReviewRow
              label="Email"
              value={values.primaryContactEmail}
              fullWidth
            />
          </div>
        </div>
      </ReviewSection>
    </motion.div>
  );
});

const ReviewSection = memo(({ title, onEdit, children }: any) => (
  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-montserrat-semibold text-gray-900">
        {title}
      </h4>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="text-primary-600"
      >
        Edit
      </Button>
    </div>
    <div className="grid grid-cols-2 gap-3 text-sm">{children}</div>
  </div>
));

const ReviewRow = memo(({ label, value, fullWidth, capitalize }: any) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <p className="text-gray-500 font-montserrat text-xs">{label}</p>
    <p
      className={`font-montserrat-semibold text-gray-900 ${
        capitalize ? "capitalize" : ""
      }`}
    >
      {value || "N/A"}
    </p>
  </div>
));
