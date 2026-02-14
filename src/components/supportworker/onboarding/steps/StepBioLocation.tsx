import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bioSchema } from "../schemas";
import { z } from "zod";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPoint, Refresh, Magnifer, CloseCircle, AltArrowRight } from "@solar-icons/react";
import { commonLanguages } from "@/constants/common-languages";
import { useRegions, useServiceAreasByRegion, useStates } from "@/hooks/useLocationHooks";
import { cn } from "@/lib/utils";

type SchemaType = z.infer<typeof bioSchema>;

interface Props {
  defaultValues: any;
  onNext: (data: any) => void;
}

export function StepBioLocation({ defaultValues, onNext }: Props) {
  const [showAddressPredictions, setShowAddressPredictions] = useState(false);
  const addressContainerRef = useRef<HTMLDivElement>(null);
  const [languageInput, setLanguageInput] = useState("");

  // Location Hooks
  const { data: states = [] } = useStates();
  const [selectedStateIds, setSelectedStateIds] = useState<string[]>(defaultValues.stateIds || []);
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>(defaultValues.regionIds || []);
  
  // Fetch regions for all selected states (we'll use the first state's regions or combine multiple queries)
  // For simplicity, if multiple states selected, fetch regions for each
  const { data: regions1 = [] } = useRegions(selectedStateIds[0], selectedStateIds.length > 0);
  const { data: regions2 = [] } = useRegions(selectedStateIds[1], selectedStateIds.length > 1);
  const { data: regions3 = [] } = useRegions(selectedStateIds[2], selectedStateIds.length > 2);
  
  // Combine all regions
  const allRegions = [...regions1, ...regions2, ...regions3];
  
  // Fetch service areas for all selected regions (similar approach)
  const { data: serviceAreas1 = [] } = useServiceAreasByRegion(selectedRegionIds[0], selectedRegionIds.length > 0);
  const { data: serviceAreas2 = [] } = useServiceAreasByRegion(selectedRegionIds[1], selectedRegionIds.length > 1);
  const { data: serviceAreas3 = [] } = useServiceAreasByRegion(selectedRegionIds[2], selectedRegionIds.length > 2);
  
  const allServiceAreas = [...serviceAreas1, ...serviceAreas2, ...serviceAreas3];
  const isLoadingServiceAreas = false; // Since we're using multiple queries

  const form = useForm<SchemaType>({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      bio: defaultValues.bio || "",
      languages: defaultValues.languages || [],
      address: defaultValues.address || "",
      stateIds: defaultValues.stateIds || [],
      regionIds: defaultValues.regionIds || [],
      serviceAreaIds: defaultValues.serviceAreaIds || [],
    },
  });

  // Google Places
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "",
    options: { types: ["address"], componentRestrictions: { country: "au" } },
  });

  // Address Logic
  const handleAddressType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    form.setValue("address", val);
    if (val.length > 2) {
      getPlacePredictions({ input: val });
      setShowAddressPredictions(true);
    } else {
      setShowAddressPredictions(false);
    }
  };

  const handleAddressSelect = (prediction: any) => {
    const address = prediction.description;
    form.setValue("address", address, { shouldValidate: true });
    setShowAddressPredictions(false);
    
    // Optional: Fetch details if you need lat/lng later
    if (placesService) {
        placesService.getDetails({ placeId: prediction.place_id }, (details: any) => {
             if(details?.formatted_address) {
                 form.setValue("address", details.formatted_address); 
             }
        });
    }
  };

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressContainerRef.current && !addressContainerRef.current.contains(event.target as Node)) {
        setShowAddressPredictions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Language Logic
  const addLanguage = () => {
    const current = form.getValues("languages");
    if (languageInput.trim() && !current.includes(languageInput.trim())) {
      form.setValue("languages", [...current, languageInput.trim()]);
      setLanguageInput("");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-montserrat-bold text-gray-900">Bio & Location</h2>
          <p className="text-gray-500 text-sm">Tell us about yourself and where you work.</p>
        </div>

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-montserrat-semibold">About</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself..." className="min-h-[100px] resize-none bg-white" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Languages */}
        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-montserrat-semibold">Languages</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {field.value.map((lang) => (
                  <Badge key={lang} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                    {lang}
                    <button type="button" onClick={() => field.onChange(field.value.filter((l) => l !== lang))}>
                      <CloseCircle className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={languageInput} 
                  onChange={(e) => setLanguageInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  placeholder="Type a language..." 
                  className="bg-white"
                />
                <Button type="button" variant="outline" onClick={addLanguage}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonLanguages.filter(l => !field.value.includes(l)).map(lang => (
                    <button key={lang} type="button" onClick={() => field.onChange([...field.value, lang])} className="text-xs text-primary-600 hover:underline">+ {lang}</button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-montserrat-semibold">Address</FormLabel>
              <div className="relative" ref={addressContainerRef}>
                <MapPoint className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="Start typing address..." 
                  className="pl-10 bg-white" 
                  value={field.value} 
                  onChange={handleAddressType} 
                  autoComplete="off"
                />
                {isPlacePredictionsLoading && <Refresh className="absolute right-3 top-3 animate-spin w-4 h-4 text-gray-400"/>}
                
                {showAddressPredictions && placePredictions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {placePredictions.map((prediction) => (
                      <div
                        key={prediction.place_id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleAddressSelect(prediction)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
                      >
                        {prediction.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-2 text-primary-600 font-montserrat-semibold">
                <Magnifer className="w-5 h-5"/> Service Location
            </div>
            
            <FormField
                control={form.control}
                name="stateIds"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>States</FormLabel>
                        <FormDescription>Select the states you service.</FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {states.map(state => {
                                const isSelected = field.value.includes(state._id);
                                return (
                                    <div 
                                        key={state._id} 
                                        onClick={() => {
                                            const newValue = isSelected 
                                                ? field.value.filter(id => id !== state._id) 
                                                : [...field.value, state._id];
                                            field.onChange(newValue);
                                            setSelectedStateIds(newValue);
                                            // Clear regions and service areas if no states selected
                                            if (newValue.length === 0) {
                                                form.setValue("regionIds", []);
                                                form.setValue("serviceAreaIds", []);
                                                setSelectedRegionIds([]);
                                            }
                                        }}
                                        className={cn(
                                            "p-3 rounded-lg border-2 cursor-pointer text-center text-sm transition-all",
                                            isSelected 
                                                ? "border-primary-600 bg-primary-600 text-white" 
                                                : "border-gray-200 hover:border-primary-300"
                                        )}
                                    >
                                        {state.name}
                                    </div>
                                )
                            })}
                        </div>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="regionIds"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Regions</FormLabel>
                        <FormDescription>Select the regions you service.</FormDescription>
                        {selectedStateIds.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {allRegions.map(region => {
                                    const isSelected = field.value.includes(region._id);
                                    return (
                                        <div 
                                            key={region._id} 
                                            onClick={() => {
                                                const newValue = isSelected 
                                                    ? field.value.filter(id => id !== region._id) 
                                                    : [...field.value, region._id];
                                                field.onChange(newValue);
                                                setSelectedRegionIds(newValue);
                                                // Clear service areas if no regions selected
                                                if (newValue.length === 0) {
                                                    form.setValue("serviceAreaIds", []);
                                                }
                                            }}
                                            className={cn(
                                                "p-3 rounded-lg border-2 cursor-pointer text-center text-sm transition-all",
                                                isSelected 
                                                    ? "border-primary-600 bg-primary-600 text-white" 
                                                    : "border-gray-200 hover:border-primary-300"
                                            )}
                                        >
                                            {region.name}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400 py-4 text-center border rounded-lg bg-gray-50">
                                Please select at least one state to view regions.
                            </div>
                        )}
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="serviceAreaIds"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Service Areas</FormLabel>
                        <FormDescription>Select the areas you service.</FormDescription>
                        {selectedRegionIds.length > 0 && !isLoadingServiceAreas ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {allServiceAreas.map(area => {
                                    const isSelected = field.value.includes(area._id);
                                    return (
                                        <div 
                                            key={area._id} 
                                            onClick={() => {
                                                const newValue = isSelected 
                                                    ? field.value.filter(id => id !== area._id) 
                                                    : [...field.value, area._id];
                                                field.onChange(newValue);
                                            }}
                                            className={cn(
                                                "p-3 rounded-lg border-2 cursor-pointer text-center text-sm transition-all",
                                                isSelected 
                                                    ? "border-primary-600 bg-primary-600 text-white" 
                                                    : "border-gray-200 hover:border-primary-300"
                                            )}
                                        >
                                            {area.name}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400 py-4 text-center border rounded-lg bg-gray-50">
                                Please select at least one region to view areas.
                            </div>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700 w-32">Next <AltArrowRight className="ml-2 w-4 h-4"/></Button>
        </div>
      </form>
    </Form>
  );
}