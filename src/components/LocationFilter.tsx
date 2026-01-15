import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRegions, useServiceAreas, useStates } from "@/hooks/useLocationHooks";
import { MapPoint } from "@solar-icons/react";
import {
  cn,
  FLEX_ROW_CENTER,
} from "@/lib/design-utils";
import {
  GAP,
  SPACING,
  FONT_FAMILY,
  TEXT_STYLES
} from "@/constants/design-system";

interface LocationFilterProps {
  filters: any;
  onChange: (field: string, value: string | undefined) => void;
}

export function LocationFilter({ filters, onChange }: LocationFilterProps) {
  // Use React Query hooks here directly for better caching/performance
  const { data: states = [], isLoading: loadingStates } = useStates();
  
  // Fetch regions ONLY if a state is selected
  const { data: regions = [], isLoading: loadingRegions } = useRegions(
    filters.stateId, 
    !!filters.stateId
  );

  // Fetch service areas ONLY if a region is selected
  const { data: serviceAreas = [], isLoading: loadingAreas } = useServiceAreas(
    filters.stateId,
    filters.regionId
  );

  const handleStateChange = (val: string) => {
    onChange("stateId", val);
    // Reset child fields
    onChange("regionId", undefined);
    onChange("serviceAreaId", undefined);
  };

  const handleRegionChange = (val: string) => {
    onChange("regionId", val);
    // Reset child field
    onChange("serviceAreaId", undefined);
  };

  const isAutoLocation = filters.matchParticipantLocation === true;

  return (
    <div className={cn(`space-y-${SPACING.sm}`)}>
      <Label className={cn(TEXT_STYLES.small, FONT_FAMILY.montserratSemibold, FLEX_ROW_CENTER)}>
        <MapPoint className="h-4 w-4 mr-1" /> Location
      </Label>
      
      {/* Auto-location Toggle */}
      <div className={cn(FLEX_ROW_CENTER, GAP.sm, "mb-2")}>
        <Checkbox
          id="auto-location"
          checked={isAutoLocation}
          onCheckedChange={(checked) => 
            onChange('matchParticipantLocation', checked ? 'true' : undefined)
          }
        />
        <Label htmlFor="auto-location" className="text-sm cursor-pointer font-normal">
          Use my location
        </Label>
      </div>

      {/* Manual Selection (Only if Auto is OFF) */}
      {!isAutoLocation && (
        <div className={cn(`space-y-${SPACING.sm}`, "pl-2 border-l-2 border-gray-100 ml-1")}>
          {/* State */}
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">State</Label>
            <Select value={filters.stateId || ""} onValueChange={handleStateChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select state..." />
              </SelectTrigger>
              <SelectContent>
                {loadingStates ? <SelectItem value="loading" disabled>Loading...</SelectItem> : 
                 states.map((s) => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Region */}
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Region</Label>
            <Select 
              value={filters.regionId || ""} 
              onValueChange={handleRegionChange}
              disabled={!filters.stateId || loadingRegions}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select region..." />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Service Area */}
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Service Area</Label>
            <Select 
              value={filters.serviceAreaId || ""} 
              onValueChange={(val) => onChange("serviceAreaId", val)}
              disabled={!filters.regionId || loadingAreas}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select area..." />
              </SelectTrigger>
              <SelectContent>
                {serviceAreas.map((a) => <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}