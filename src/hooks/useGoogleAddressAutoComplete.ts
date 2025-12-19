import { useState, useEffect } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { UseFormReturn } from "react-hook-form";
import { ProviderRegisterFormValues } from "@/types/auth/provider-register/schema";

export function useGoogleAddressAutocomplete(
  form: UseFormReturn<ProviderRegisterFormValues>
) {
  const [showPredictions, setShowPredictions] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "",
    options: {
      types: ["establishment", "geocode"], // Broader types for business addresses
      componentRestrictions: { country: "au" },
    },
  });

  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Partially update street so validation doesn't fail immediately, 
    // but the full object isn't set yet
    if (value.trim().length > 2) {
      getPlacePredictions({ input: value });
      setShowPredictions(true);
    } else {
      setShowPredictions(false);
    }
  };

  const handleAddressSelect = (prediction: any) => {
    const description = prediction.description;
    setInputValue(description);
    setShowPredictions(false);

    if (placesService && prediction.place_id) {
      placesService.getDetails(
        {
          placeId: prediction.place_id,
          fields: ["address_components", "formatted_address"],
        },
        (placeDetails: any) => {
          if (placeDetails?.address_components) {
            const components = placeDetails.address_components;
            
            // Extract Google Address Components
            const getComponent = (type: string) => 
              components.find((c: any) => c.types.includes(type))?.long_name || "";

            const streetNum = getComponent("street_number");
            const route = getComponent("route");
            const city = getComponent("locality");
            const state = getComponent("administrative_area_level_1");
            const postcode = getComponent("postal_code");

            // Update Form
            form.setValue("businessAddress", {
              street: `${streetNum} ${route}`.trim() || description, // Fallback if components fail
              city: city,
              state: state,
              postcode: postcode,
              country: "Australia"
            });
          }
        }
      );
    }
  };

  return {
    inputValue,
    placePredictions,
    showPredictions,
    isLoading: isPlacePredictionsLoading,
    setShowPredictions,
    handleInputChange,
    handleAddressSelect,
  };
}