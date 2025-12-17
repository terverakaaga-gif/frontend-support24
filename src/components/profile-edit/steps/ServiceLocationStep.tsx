import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPoint, CloseCircle } from "@solar-icons/react";
import { Badge } from "@/components/ui/badge";
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

export const ServiceLocationStep = React.memo(({ 
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
  setSelectedRegionId
}: Props) => {
  
  const handleStateChange = (value: string) => {
    setSelectedStateId(value);
    // For support workers, we use arrays
    const currentStateIds = formData.stateIds || [];
    if (!currentStateIds.includes(value)) {
      onChange("stateIds", [...currentStateIds, value]);
    }
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegionId(value);
    const currentRegionIds = formData.regionIds || [];
    if (!currentRegionIds.includes(value)) {
      onChange("regionIds", [...currentRegionIds, value]);
    }
  };

  const handleServiceAreaToggle = (areaId: string) => {
    const currentAreas = formData.serviceAreaIds || [];
    if (currentAreas.includes(areaId)) {
      onChange("serviceAreaIds", currentAreas.filter((id: string) => id !== areaId));
    } else {
      onChange("serviceAreaIds", [...currentAreas, areaId]);
    }
  };

  const removeState = (stateId: string) => {
    const updated = (formData.stateIds || []).filter((id: string) => id !== stateId);
    onChange("stateIds", updated);
    // Also remove related regions and service areas
    if (formData.regionIds) {
      const relatedRegions = regions.filter(r => r.stateId === stateId).map(r => r._id);
      onChange("regionIds", formData.regionIds.filter((id: string) => !relatedRegions.includes(id)));
    }
    if (formData.serviceAreaIds) {
      const relatedAreas = serviceAreas.filter(a => a.stateId === stateId).map(a => a._id);
      onChange("serviceAreaIds", formData.serviceAreaIds.filter((id: string) => !relatedAreas.includes(id)));
    }
  };

  const removeRegion = (regionId: string) => {
    const updated = (formData.regionIds || []).filter((id: string) => id !== regionId);
    onChange("regionIds", updated);
    // Also remove related service areas
    if (formData.serviceAreaIds) {
      const relatedAreas = serviceAreas.filter(a => a.regionId === regionId).map(a => a._id);
      onChange("serviceAreaIds", formData.serviceAreaIds.filter((id: string) => !relatedAreas.includes(id)));
    }
  };

  const isServiceAreaSelected = (areaId: string) => {
    return (formData.serviceAreaIds || []).includes(areaId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <MapPoint className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Service Locations</h2>
          <p className="text-sm text-gray-600">Configure where you provide services</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Travel Radius (km)</Label>
        <Input 
            type="number" 
            value={formData.travelRadiusKm || ""} 
            onChange={(e) => onChange("travelRadiusKm", parseFloat(e.target.value))} 
            placeholder="Maximum distance you're willing to travel"
        />
      </div>

      {/* State Selection */}
      <div className="space-y-3">
        <Label>States</Label>
        <p className="text-sm text-gray-600">Select states where you provide services</p>
        <Select value={selectedStateId} onValueChange={handleStateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Add a state..." />
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

        {/* Selected States */}
        {formData.stateIds && formData.stateIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.stateIds.map((stateId: string) => {
              const state = states.find((s) => s._id === stateId);
              return state ? (
                <Badge
                  key={stateId}
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => removeState(stateId)}
                >
                  {state.name}
                  <CloseCircle className="h-3 w-3 ml-1" />
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Region Selection */}
      {formData.stateIds && formData.stateIds.length > 0 && (
        <div className="space-y-3">
          <Label>Regions</Label>
          <p className="text-sm text-gray-600">Select regions within your selected states</p>
          <Select value={selectedRegionId} onValueChange={handleRegionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Add a region..." />
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

          {/* Selected Regions */}
          {formData.regionIds && formData.regionIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.regionIds.map((regionId: string) => {
                const region = regions.find((r) => r._id === regionId);
                return region ? (
                  <Badge
                    key={regionId}
                    variant="secondary"
                    className="text-xs cursor-pointer"
                    onClick={() => removeRegion(regionId)}
                  >
                    {region.name}
                    <CloseCircle className="h-3 w-3 ml-1" />
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}

      {/* Service Areas Selection */}
      {formData.regionIds && formData.regionIds.length > 0 && serviceAreas.length > 0 && (
        <div className="space-y-3">
          <Label>Service Areas</Label>
          <p className="text-sm text-gray-600">Select specific service areas</p>
          
          {isLoadingServiceAreas ? (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600">Loading service areas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceAreas.map((area) => (
                <div
                  key={area._id}
                  onClick={() => handleServiceAreaToggle(area._id)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${isServiceAreaSelected(area._id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                    }
                  `}
                >
                  <Checkbox
                    checked={isServiceAreaSelected(area._id)}
                    onCheckedChange={() => handleServiceAreaToggle(area._id)}
                  />
                  <Label className="cursor-pointer flex-1">{area.name}</Label>
                </div>
              ))}
            </div>
          )}

          {/* Selected Service Areas Badges */}
          {formData.serviceAreaIds && formData.serviceAreaIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.serviceAreaIds.map((areaId: string) => {
                const area = serviceAreas.find((a) => a._id === areaId);
                return area ? (
                  <Badge
                    key={areaId}
                    variant="secondary"
                    className="text-xs cursor-pointer bg-primary/10 text-primary"
                    onClick={() => handleServiceAreaToggle(areaId)}
                  >
                    {area.name}
                    <CloseCircle className="h-3 w-3 ml-1" />
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});