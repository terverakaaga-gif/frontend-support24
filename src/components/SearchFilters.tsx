import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { WorkerSearchFilters } from "@/api/services/participantService";
import { Magnifer, Filter, Refresh } from "@solar-icons/react";
import { LocationFilter } from "./LocationFilter"; // Import the new module

import {
  cn,
  FLEX_ROW_BETWEEN,
  FLEX_ROW_CENTER,
} from "@/lib/design-utils";
import {
  GAP,
  SPACING,
  FONT_FAMILY,
  TEXT_STYLES
} from "@/constants/design-system";

interface SearchFiltersProps {
  filters: WorkerSearchFilters;
  onApply: (filters: WorkerSearchFilters) => void;
  onReset: () => void;
  className?: string;
  skills?: Array<{ _id: string; name: string }>;
  isLoadingSkills?: boolean;
}

export function SearchFilters({ 
  filters, 
  onApply,
  onReset,
  className = "",
  skills,
  isLoadingSkills = false,
}: SearchFiltersProps) {
  
  const [localFilters, setLocalFilters] = useState<WorkerSearchFilters>(filters);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(filters.skills || []);
  const [maxRate, setMaxRate] = useState<number[]>([filters.maxHourlyRate || 100]);

  // Sync local state when parent filters change
  useEffect(() => {
    setLocalFilters(filters);
    setSelectedSkills(filters.skills || []);
    setMaxRate([filters.maxHourlyRate || 100]);
  }, [filters]);

  const updateLocalFilter = (key: string, value: any) => {
    setLocalFilters(prev => {
        const next = { ...prev };
        if (key === 'matchParticipantLocation' && value === 'true') {
             next.matchParticipantLocation = true;
             delete next.stateId;
             delete next.regionId;
             delete next.serviceAreaId;
        } else if (value === undefined) {
            delete (next as any)[key];
        } else {
            (next as any)[key] = value;
        }
        return next;
    });
  };

  const handleApply = () => onApply(localFilters);

  const handleSkillToggle = (skillId: string) => {
    const newSkills = selectedSkills.includes(skillId)
      ? selectedSkills.filter(id => id !== skillId)
      : [...selectedSkills, skillId];
    
    setSelectedSkills(newSkills);
    updateLocalFilter('skills', newSkills.length > 0 ? newSkills : undefined);
  };

  const activeFilterCount = [
    localFilters.keyword,
    localFilters.stateId || localFilters.matchParticipantLocation,
    selectedSkills.length > 0,
    localFilters.minRating,
    localFilters.maxHourlyRate && localFilters.maxHourlyRate < 100,
    localFilters.onlyVerified
  ].filter(Boolean).length;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header - Fixed at top */}
      <div className={cn(FLEX_ROW_BETWEEN, "flex-none mb-4 pb-4 border-b")}>
        <div className={cn(FLEX_ROW_CENTER, GAP.sm)}>
          <Filter className="h-5 w-5 text-primary" />
          <h3 className={cn(FONT_FAMILY.montserratSemibold)}>Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs">
            <Refresh className="h-3 w-3 mr-1" /> Reset
          </Button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className={cn("flex-1 overflow-y-auto p-2", `space-y-${SPACING.lg}`)}>
        
        {/* Keyword Search */}
        <div className={cn(`space-y-${SPACING.sm}`)}>
          <Label className={cn(TEXT_STYLES.small, FONT_FAMILY.montserratSemibold)}>Keywords</Label>
          <div className="relative">
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Name, bio, etc..."
              value={localFilters.keyword || ""}
              onChange={(e) => updateLocalFilter('keyword', e.target.value || undefined)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Location Module */}
        <LocationFilter 
            filters={localFilters} 
            onChange={updateLocalFilter} 
        />

        {/* Skills Filter */}
        <div className={cn(`space-y-${SPACING.sm}`)}>
          <Label className={cn(TEXT_STYLES.small, FONT_FAMILY.montserratSemibold)}>Skills</Label>
          {isLoadingSkills ? (
            <div className="text-xs text-gray-500">Loading skills...</div>
          ) : (
            <div className={cn("grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-2")}>
              {skills.filter((s:any) => s.status === 'active')?.map((skill) => (
                <div key={skill._id} className={cn(FLEX_ROW_CENTER, GAP.sm)}>
                  <Checkbox
                    id={skill._id}
                    checked={selectedSkills.includes(skill._id)}
                    onCheckedChange={() => handleSkillToggle(skill._id)}
                  />
                  <Label htmlFor={skill._id} className="text-xs cursor-pointer font-montserrat">
                    {skill.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div className={cn(`space-y-${SPACING.sm}`)}>
          <Label className={cn(TEXT_STYLES.small, FONT_FAMILY.montserratSemibold)}>Min Rating</Label>
          <Select
            value={localFilters.minRating?.toString() || ""}
            onValueChange={(value) => updateLocalFilter('minRating', value ? parseFloat(value) : undefined)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
              <SelectItem value="4.0">4.0+ stars</SelectItem>
              <SelectItem value="3.5">3.5+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hourly Rate Filter */}
        <div className={cn(`space-y-${SPACING.sm}`)}>
          <div className={cn(FLEX_ROW_BETWEEN)}>
            <Label className={cn(TEXT_STYLES.small, FONT_FAMILY.montserratSemibold)}>Hourly Rate</Label>
            <span className="text-xs text-primary font-montserrat-bold">
                Max: ${maxRate[0] >= 100 ? '100+' : maxRate[0]}
            </span>
          </div>
          <Slider
            value={maxRate}
            onValueChange={(val) => { setMaxRate(val); updateLocalFilter('maxHourlyRate', val[0] >= 100 ? undefined : val[0]); }}
            max={100} min={20} step={5}
            className="w-full"
          />
        </div>

        {/* Verification */}
        <div className={cn(FLEX_ROW_CENTER, GAP.sm, "pt-2")}>
          <Checkbox
            id="verified"
            checked={localFilters.onlyVerified || false}
            onCheckedChange={(checked) => updateLocalFilter('onlyVerified', checked ? true : undefined)}
          />
          <Label htmlFor="verified" className="text-sm font-montserrat cursor-pointer">
            Show verified workers only
          </Label>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="flex-none pt-4 border-t mt-4 bg-white z-10">
        <Button onClick={handleApply} className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}