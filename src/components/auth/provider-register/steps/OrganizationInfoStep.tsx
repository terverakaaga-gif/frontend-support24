import { memo, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProviderRegisterFormValues } from "@/types/auth/provider-register/schema";
import { useGoogleAddressAutocomplete } from "@/hooks/useGoogleAddressAutoComplete"; // Import custom hook
import { motion } from "framer-motion";

interface Props {
  form: UseFormReturn<ProviderRegisterFormValues>;
}

export const OrganizationInfoStep = memo(({ form }: Props) => {
  const {
    inputValue,
    placePredictions,
    showPredictions,
    isLoading,
    setShowPredictions,
    handleInputChange,
    handleAddressSelect,
  } = useGoogleAddressAutocomplete(form);

  // Close predictions on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".address-container"))
        setShowPredictions(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setShowPredictions]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-montserrat-bold text-gray-900 mb-4">
        Organization Information
      </h3>

      <FormField
        control={form.control}
        name="organizationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-montserrat-semibold">
              Organization Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g ABC Care Services"
                className="h-12 bg-[#F7F7F7]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="abn"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-montserrat-semibold">ABN</FormLabel>
            <FormControl>
              <Input
                maxLength={11}
                placeholder="e.g 12345678901"
                className="h-12 bg-[#F7F7F7]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Autocomplete Field */}
      <FormItem className="address-container relative">
        <FormLabel className="font-montserrat-semibold">
          Business Address
        </FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              placeholder="Start typing address..."
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="h-12 px-4 bg-[#F7F7F7]"
              autoComplete="off"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-600 rounded-full animate-spin border-t-transparent" />
            )}

            {showPredictions && placePredictions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {placePredictions.map((prediction) => (
                  <div
                    key={prediction.place_id}
                    onClick={() => handleAddressSelect(prediction)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-0"
                  >
                    <div className="font-montserrat-medium text-gray-900">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-xs text-gray-500">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormControl>
        {/* Hidden fields bind to Zod schema */}
        <input type="hidden" {...form.register("businessAddress.city")} />
        <FormMessage>
          {form.formState.errors.businessAddress?.street?.message}
        </FormMessage>
      </FormItem>

      <FormField
        control={form.control}
        name="providerType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-montserrat-semibold">
              Provider Type
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 bg-[#F7F7F7]">
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="DISABILITY_SUPPORT">
                  Disability Support
                </SelectItem>
                <SelectItem value="AGED_CARE">Aged Care</SelectItem>
                <SelectItem value="HOME_CARE">Home Care</SelectItem>
                <SelectItem value="MENTAL_HEALTH">Mental Health</SelectItem>
                <SelectItem value="COMMUNITY_SUPPORT">
                  Community Services
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="pt-4 border-t mt-4">
        <h4 className="font-montserrat-semibold text-gray-900 mb-3">
          Primary Contact
        </h4>
        <FormField
          control={form.control}
          name="primaryContactName"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="font-montserrat-semibold">
                Contact Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g Jane Smith"
                  className="h-12 bg-[#F7F7F7]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="primaryContactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-montserrat-semibold">
                  Contact Phone
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="04..."
                    className="h-12 bg-[#F7F7F7]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primaryContactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-montserrat-semibold">
                  Contact Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@..."
                    className="h-12 bg-[#F7F7F7]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </motion.div>
  );
});
