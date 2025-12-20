import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Magnifer, MapPoint } from "@solar-icons/react";
import { useStates, useRegions, useServiceAreasByRegion } from "@/hooks/useLocationHooks";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { cn } from "@/lib/utils";
import { JobFormData } from "@/types/job";

interface Props {
  formData: JobFormData;
  errors: Partial<Record<keyof JobFormData, string>>;
  onChange: (field: keyof JobFormData, value: any) => void;
  addressInputValue: string;
  setAddressInputValue: (val: string) => void;
}

export const JobLocationSection = React.memo(({ formData, errors, onChange, addressInputValue, setAddressInputValue }: Props) => {
  // Location Data Hooks
  const { data: states = [], isLoading: loadingStates } = useStates();
  const { data: regions = [], isLoading: loadingRegions } = useRegions(formData.stateId, !!formData.stateId);
  const { data: serviceAreas = [], isLoading: loadingAreas } = useServiceAreasByRegion(formData.regionId, !!formData.regionId);

  // Google Places Logic
  const { placePredictions, getPlacePredictions } = usePlacesService({
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "",
    options: { types: ["address"], componentRestrictions: { country: "au" } },
  });
  const [showPredictions, setShowPredictions] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddressInputValue(val);
    onChange("location", val);
    if (val.length > 2) {
      getPlacePredictions({ input: val });
      setShowPredictions(true);
    } else {
      setShowPredictions(false);
    }
  };

  const handleAddressSelect = (prediction: any) => {
    setAddressInputValue(prediction.description);
    onChange("location", prediction.description);
    setShowPredictions(false);
  };

  const toggleServiceArea = (id: string) => {
    const current = formData.serviceAreaIds;
    const updated = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    onChange("serviceAreaIds", updated);
  };

  return (
    <>
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center gap-2 mb-4">
          <Magnifer className="h-5 w-5 text-primary" />
          <Label className="text-sm font-semibold text-gray-900">Service Location</Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* State */}
          <div>
            <Label className="text-sm mb-2 block">State *</Label>
            <Select 
              value={formData.stateId} 
              onValueChange={(val) => { onChange("stateId", val); onChange("regionId", ""); onChange("serviceAreaIds", []); }}
              disabled={loadingStates}
            >
              <SelectTrigger className={errors.stateId ? "border-red-500" : ""}><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {states.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.stateId && <p className="text-xs text-red-600 mt-1">{errors.stateId}</p>}
          </div>

          {/* Region */}
          <div>
            <Label className="text-sm mb-2 block">Region *</Label>
            <Select 
              value={formData.regionId} 
              onValueChange={(val) => { onChange("regionId", val); onChange("serviceAreaIds", []); }}
              disabled={!formData.stateId || loadingRegions}
            >
              <SelectTrigger className={errors.regionId ? "border-red-500" : ""}><SelectValue placeholder="Select region" /></SelectTrigger>
              <SelectContent>
                {regions.map(r => <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.regionId && <p className="text-xs text-red-600 mt-1">{errors.regionId}</p>}
          </div>
        </div>
      </div>

      {/* Google Address */}
      <div className="mb-6 relative">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Specific Location/Address</Label>
        <div className="relative">
          <MapPoint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <Input
            value={addressInputValue}
            onChange={handleAddressChange}
            placeholder="Start typing address..."
            className={cn("pl-10", errors.location ? "border-red-500" : "")}
            onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
          />
        </div>
        {showPredictions && placePredictions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {placePredictions.map((p) => (
              <div key={p.place_id} onClick={() => handleAddressSelect(p)} className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm">
                 {p.description}
              </div>
            ))}
          </div>
        )}
        {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
      </div>

      {/* Service Areas */}
      {formData.regionId && (
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">Service Areas</Label>
          {loadingAreas ? (
            <div className="text-center py-4 text-sm text-gray-500">Loading areas...</div>
          ) : serviceAreas.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {serviceAreas.map(area => {
                const isSelected = formData.serviceAreaIds.includes(area._id);
                return (
                  <div 
                    key={area._id} 
                    onClick={() => toggleServiceArea(area._id)}
                    className={cn("cursor-pointer p-3 rounded-lg border-2 text-center text-sm transition-all", isSelected ? "bg-primary border-primary text-white" : "border-gray-200 bg-white hover:bg-gray-50")}
                  >
                    {area.name}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">No service areas found.</div>
          )}
        </div>
      )}
    </>
  );
});