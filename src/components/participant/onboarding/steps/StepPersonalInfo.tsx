import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema } from "../schemas";
import { z } from "zod";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPoint, Refresh, Magnifer, CloseCircle, AltArrowRight } from "@solar-icons/react";
import { commonLanguages } from "@/constants/common-languages";
import { useRegions, useServiceAreasByRegion, useStates } from "@/hooks/useLocationHooks";

type SchemaType = z.infer<typeof personalInfoSchema>;

interface Props {
  defaultValues: any;
  onNext: (data: any) => void;
}

export function StepPersonalInfo({ defaultValues, onNext }: Props) {
  const [showAddressPredictions, setShowAddressPredictions] = useState(false);
  const addressContainerRef = useRef<HTMLDivElement>(null);
  const [languageInput, setLanguageInput] = useState("");

  // Location Hooks
  const { data: states = [] } = useStates();
  const [selectedStateId, setSelectedStateId] = useState(defaultValues.stateId || "");
  const [selectedRegionId, setSelectedRegionId] = useState(defaultValues.regionId || "");
  const { data: regions = [] } = useRegions(selectedStateId, !!selectedStateId);
  const { data: serviceAreas = [] } = useServiceAreasByRegion(selectedRegionId, !!selectedRegionId);

  const form = useForm<SchemaType>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      ndisNumber: defaultValues.ndisNumber,
      preferredLanguages: defaultValues.preferredLanguages,
      address: defaultValues.address,
      stateId: defaultValues.stateId,
      regionId: defaultValues.regionId,
      serviceAreaId: defaultValues.serviceAreaId,
    },
  });

  // Google Places Logic
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "",
    options: { types: ["address"], componentRestrictions: { country: "au" } },
  });

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
    // 1. Set values immediately
    const address = prediction.description;
    form.setValue("address", address, { shouldValidate: true });
    setShowAddressPredictions(false);
    
    // 2. Optional: Get details for lat/lng (does not block UI update)
    if (placesService) {
        placesService.getDetails({ placeId: prediction.place_id }, (details: any) => {
             if(details?.formatted_address) {
                 form.setValue("address", details.formatted_address); 
             }
        });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressContainerRef.current && !addressContainerRef.current.contains(event.target as Node)) {
        setShowAddressPredictions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addLanguage = () => {
    const current = form.getValues("preferredLanguages");
    if (languageInput.trim() && !current.includes(languageInput.trim())) {
      form.setValue("preferredLanguages", [...current, languageInput.trim()]);
      setLanguageInput("");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-montserrat-bold text-gray-900">Personal Information</h2>
          <p className="text-gray-500 text-sm">Tell us about yourself and where you live.</p>
        </div>

        <FormField
          control={form.control}
          name="ndisNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NDIS Number</FormLabel>
              <FormControl>
                <Input placeholder="430123456789" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Languages */}
        <FormField
          control={form.control}
          name="preferredLanguages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Languages</FormLabel>
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
                {commonLanguages.filter(l => !field.value.includes(l)).slice(0, 5).map(lang => (
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
              <FormLabel>Address</FormLabel>
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
                        onMouseDown={(e) => e.preventDefault()} // CRITICAL: Prevents blur
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
                <Magnifer className="w-5 h-5"/> Location Details
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="stateId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select value={field.value} onValueChange={(val) => { field.onChange(val); setSelectedStateId(val); }}>
                                <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="State" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {states.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="regionId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Region</FormLabel>
                            <Select value={field.value} onValueChange={(val) => { field.onChange(val); setSelectedRegionId(val); }} disabled={!selectedStateId}>
                                <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Region" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {regions.map(r => <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="serviceAreaId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service Area</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange} disabled={!selectedRegionId}>
                                <FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Area" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {serviceAreas.map(a => <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700 w-32">Next <AltArrowRight className="ml-2 w-4 h-4"/></Button>
        </div>
      </form>
    </Form>
  );
}