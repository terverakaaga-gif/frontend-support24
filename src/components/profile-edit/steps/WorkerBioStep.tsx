import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CaseRoundMinimalistic, Refresh } from "@solar-icons/react";
import { MapPoint } from "@solar-icons/react/ssr";
import { Input } from "@/components/ui/input";

export const WorkerBioStep = React.memo(({ 
  formData, onChange, 
  addressProps // Props passed down for google autocomplete
}: any) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <CaseRoundMinimalistic className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Professional Bio</h2>
          <p className="text-sm text-gray-600">Your address and professional summary</p>
        </div>
      </div>

       {/* Address Input */}
        <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
                <MapPoint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Input 
                    id="address" 
                    value={addressProps.addressValue} 
                    onChange={(e) => addressProps.onAddressChange(e.target.value)} 
                    placeholder="Start typing address..."
                    className="pl-10"
                />
                {addressProps.isLoadingPredictions && <Refresh className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
                
                {addressProps.showPredictions && addressProps.predictions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {addressProps.predictions.map((p: any) => (
                            <div key={p.place_id} onClick={() => addressProps.onPredictionSelect(p)} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                {p.description}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label>Professional Bio</Label>
        <Textarea
          value={formData.bio || ""}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="Tell us about your experience..."
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
});