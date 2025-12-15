
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPoint, Refresh } from "@solar-icons/react";

interface Props {
  addressValue: string;
  onAddressChange: (value: string) => void;
  predictions: any[];
  showPredictions: boolean;
  isLoadingPredictions: boolean;
  onPredictionSelect: (prediction: any) => void;
  // Add other props for State/Region selection...
}

export const LocationStep = ({ 
    addressValue, 
    onAddressChange, 
    predictions, 
    showPredictions, 
    isLoadingPredictions,
    onPredictionSelect 
}: Props) => {
  return (
    <div className="space-y-6">
        {/* Header ... */}
        
        {/* Address Input */}
        <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
                <MapPoint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Input 
                    id="address" 
                    value={addressValue} 
                    onChange={(e) => onAddressChange(e.target.value)} 
                    placeholder="Start typing address..."
                    className="pl-10"
                />
                {isLoadingPredictions && <Refresh className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
                
                {showPredictions && predictions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {predictions.map((p: any) => (
                            <div key={p.place_id} onClick={() => onPredictionSelect(p)} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                {p.description}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
        {/* State/Region Selectors would go here (could be another sub-component) */}
    </div>
  );
};