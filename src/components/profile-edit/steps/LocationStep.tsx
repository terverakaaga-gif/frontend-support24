import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPoint, Refresh } from "@solar-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface State {
  _id: string;
  name: string;
  code: string;
}

interface Region {
  _id: string;
  name: string;
  stateId: string;
}

interface ServiceArea {
  _id: string;
  name: string;
  regionId: string;
  stateId: string;
}

interface Props {
  addressValue: string;
  onAddressChange: (value: string) => void;
  predictions: any[];
  showPredictions: boolean;
  isLoadingPredictions: boolean;
  onPredictionSelect: (prediction: any) => void;
  formData: any;
  onChange: (field: string, value: any) => void;
  states?: State[];
  regions?: Region[];
  serviceAreas?: ServiceArea[];
  isLoadingStates?: boolean;
  isLoadingRegions?: boolean;
  isLoadingServiceAreas?: boolean;
  selectedStateId: string;
  setSelectedStateId: (id: string) => void;
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
}

export const LocationStep = React.memo(
  ({
    addressValue,
    onAddressChange,
    predictions,
    showPredictions,
    isLoadingPredictions,
    onPredictionSelect,
    formData,
    onChange,
    states = [],
    regions = [],
    serviceAreas = [],
    isLoadingStates = false,
    isLoadingRegions = false,
    isLoadingServiceAreas = false,
    selectedStateId,
    setSelectedStateId,
    selectedRegionId,
    setSelectedRegionId,
  }: Props) => {
    const handleStateChange = (value: string) => {
      setSelectedStateId(value);
      onChange("stateId", value);
    };

    const handleRegionChange = (value: string) => {
      setSelectedRegionId(value);
      onChange("regionId", value);
    };

    const handleServiceAreaChange = (value: string) => {
      onChange("serviceAreaId", value);
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-1">
            Location Information
          </h3>
          <p className="text-sm text-gray-600">
            Update your address and service location
          </p>
        </div>

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
            {isLoadingPredictions && (
              <Refresh className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}

            {showPredictions && predictions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {predictions.map((p: any) => (
                  <div
                    key={p.place_id}
                    onClick={() => onPredictionSelect(p)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  >
                    {p.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* State Selection */}
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select
            value={formData.stateId || ""}
            onValueChange={handleStateChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state..." />
            </SelectTrigger>
            <SelectContent>
              {isLoadingStates ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : states.length > 0 ? (
                states.map((state) => (
                  <SelectItem key={state._id} value={state._id}>
                    {state.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No states available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Region Selection */}
        {formData.stateId && (
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select
              value={formData.regionId || ""}
              onValueChange={handleRegionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region..." />
              </SelectTrigger>
              <SelectContent>
                {isLoadingRegions ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : regions.length > 0 ? (
                  regions.map((region) => (
                    <SelectItem key={region._id} value={region._id}>
                      {region.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No regions available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Service Area Selection */}
        {formData.regionId && (
          <div className="space-y-2">
            <Label htmlFor="serviceArea">Service Area</Label>
            <Select
              value={formData.serviceAreaId || ""}
              onValueChange={handleServiceAreaChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service area..." />
              </SelectTrigger>
              <SelectContent>
                {isLoadingServiceAreas ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : serviceAreas.length > 0 ? (
                  serviceAreas.map((area) => (
                    <SelectItem key={area._id} value={area._id}>
                      {area.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No service areas available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  }
);
