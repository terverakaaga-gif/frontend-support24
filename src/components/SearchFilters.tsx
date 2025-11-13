import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  WorkerSearchFilters, 
  FilterOptions 
} from "@/api/services/participantService";
import { useSearchFilterOptions } from "@/hooks/useParticipant";
import { MapPin, Search, X, Filter, RefreshCw } from "lucide-react";
import { WaveLoader } from "./Loader";

interface SearchFiltersProps {
  filters: WorkerSearchFilters;
  onFiltersChange: (filters: WorkerSearchFilters) => void;
  onReset: () => void;
  className?: string;
}

export function SearchFilters({ 
  filters, 
  onFiltersChange, 
  onReset,
  className = ""
}: SearchFiltersProps) {
  const { data: filterOptions, isLoading } = useSearchFilterOptions();
  
  const [localFilters, setLocalFilters] = useState<WorkerSearchFilters>(filters);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(filters.skills || []);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(filters.languages || []);
  const [maxRate, setMaxRate] = useState<number[]>([filters.maxHourlyRate || 100]);

  // Update local state when filters prop changes
  useEffect(() => {
    setLocalFilters(filters);
    setSelectedSkills(filters.skills || []);
    setSelectedLanguages(filters.languages || []);
    setMaxRate([filters.maxHourlyRate || 100]);
  }, [filters]);

  const updateFilters = (newFilters: Partial<WorkerSearchFilters>) => {
    const updated = { ...localFilters, ...newFilters };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const handleSkillToggle = (skillId: string) => {
    const newSkills = selectedSkills.includes(skillId)
      ? selectedSkills.filter(id => id !== skillId)
      : [...selectedSkills, skillId];
    
    setSelectedSkills(newSkills);
    updateFilters({ skills: newSkills.length > 0 ? newSkills : undefined });
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter(lang => lang !== language)
      : [...selectedLanguages, language];
    
    setSelectedLanguages(newLanguages);
    updateFilters({ languages: newLanguages.length > 0 ? newLanguages : undefined });
  };

  const handleRateChange = (value: number[]) => {
    setMaxRate(value);
    updateFilters({ maxHourlyRate: value[0] > 99 ? undefined : value[0] });
  };

  const handleLocationFilterChange = (field: keyof WorkerSearchFilters, value: string | undefined) => {
    // Clear other location filters when one is selected
    const locationUpdate: Partial<WorkerSearchFilters> = {};
    
    if (field === 'matchParticipantLocation' && value === 'true') {
      locationUpdate.matchParticipantLocation = true;
      locationUpdate.stateId = undefined;
      locationUpdate.regionId = undefined;
      locationUpdate.serviceAreaId = undefined;
    } else {
      locationUpdate.matchParticipantLocation = undefined;
      (locationUpdate as any)[field] = value;
      
      // Clear dependent fields
      if (field === 'stateId') {
        locationUpdate.regionId = undefined;
        locationUpdate.serviceAreaId = undefined;
      } else if (field === 'regionId') {
        locationUpdate.serviceAreaId = undefined;
      }
    }
    
    updateFilters(locationUpdate);
  };

  const handleReset = () => {
    setLocalFilters({});
    setSelectedSkills([]);
    setSelectedLanguages([]);
    setMaxRate([100]);
    onReset();
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (localFilters.keyword) count++;
    if (localFilters.stateId || localFilters.regionId || localFilters.serviceAreaId || localFilters.matchParticipantLocation) count++;
    if (selectedSkills.length > 0) count++;
    if (selectedLanguages.length > 0) count++;
    if (localFilters.minRating) count++;
    if (localFilters.maxHourlyRate && localFilters.maxHourlyRate < 100) count++;
    if (localFilters.onlyVerified) count++;
    return count;
  };

  const getRegionsForState = () => {
    if (!filterOptions?.regions || !localFilters.stateId) return [];
    return filterOptions.regions.filter(region => region.stateId === localFilters.stateId);
  };

  const getServiceAreasForRegion = () => {
    if (!filterOptions?.serviceAreas || !localFilters.regionId) return [];
    return filterOptions.serviceAreas.filter(area => area.regionId === localFilters.regionId);
  };

  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <WaveLoader />
      </div>
    );
  }

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-montserrat-semibold">Search Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Keyword Search */}
      <div className="space-y-2">
        <Label className="text-sm font-montserrat-semibold">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, bio, or skills..."
            value={localFilters.keyword || ""}
            onChange={(e) => updateFilters({ keyword: e.target.value || undefined })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Location Filters */}
      <div className="space-y-3">
        <Label className="text-sm font-montserrat-semibold">
          <MapPin className="inline h-4 w-4 mr-1" />
          Location
        </Label>
        
        {/* Auto-location option */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="auto-location"
            checked={localFilters.matchParticipantLocation || false}
            onCheckedChange={(checked) => 
              handleLocationFilterChange('matchParticipantLocation', checked ? 'true' : undefined)
            }
          />
          <Label 
            htmlFor="auto-location" 
            className="text-sm cursor-pointer"
          >
            Use my location (recommended)
          </Label>
        </div>

        {/* Manual location selection */}
        {!localFilters.matchParticipantLocation && (
          <div className="space-y-3 pl-6 border-l-2 border-gray-100">
            <div>
              <Label className="text-xs text-gray-600">State</Label>
              <Select
                value={localFilters.stateId || ""}
                onValueChange={(value) => handleLocationFilterChange('stateId', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state..." />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions?.states?.map((state) => (
                    <SelectItem key={state._id} value={state._id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {localFilters.stateId && (
              <div>
                <Label className="text-xs text-gray-600">Region</Label>
                <Select
                  value={localFilters.regionId || ""}
                  onValueChange={(value) => handleLocationFilterChange('regionId', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getRegionsForState().map((region) => (
                      <SelectItem key={region._id} value={region._id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {localFilters.regionId && (
              <div>
                <Label className="text-xs text-gray-600">Service Area</Label>
                <Select
                  value={localFilters.serviceAreaId || ""}
                  onValueChange={(value) => handleLocationFilterChange('serviceAreaId', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service area..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getServiceAreasForRegion().map((area) => (
                      <SelectItem key={area._id} value={area._id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skills Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-montserrat-semibold">Skills & Services</Label>
        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
          {filterOptions?.skills?.map((skill) => (
            <div key={skill._id} className="flex items-center space-x-2">
              <Checkbox
                id={skill._id}
                checked={selectedSkills.includes(skill._id)}
                onCheckedChange={() => handleSkillToggle(skill._id)}
              />
              <Label htmlFor={skill._id} className="text-sm cursor-pointer">
                {skill.name}
              </Label>
            </div>
          ))}
        </div>
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedSkills.map((skillId) => {
              const skill = filterOptions?.skills?.find(s => s._id === skillId);
              return skill ? (
                <Badge
                  key={skillId}
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => handleSkillToggle(skillId)}
                >
                  {skill.name}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Languages Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-montserrat-semibold">Languages</Label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {filterOptions?.languages?.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={language}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={() => handleLanguageToggle(language)}
              />
              <Label htmlFor={language} className="text-sm cursor-pointer">
                {language}
              </Label>
            </div>
          ))}
        </div>
        {selectedLanguages.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedLanguages.map((language) => (
              <Badge
                key={language}
                variant="secondary"
                className="text-xs cursor-pointer"
                onClick={() => handleLanguageToggle(language)}
              >
                {language}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-montserrat-semibold">Minimum Rating</Label>
        <Select
          value={localFilters.minRating?.toString() || ""}
          onValueChange={(value) => updateFilters({ minRating: value ? parseFloat(value) : undefined })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4.5">4.5+ stars</SelectItem>
            <SelectItem value="4.0">4.0+ stars</SelectItem>
            <SelectItem value="3.5">3.5+ stars</SelectItem>
            <SelectItem value="3.0">3.0+ stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hourly Rate Filter */}
      <div className="space-y-3">
        <Label className="text-xs font-montserrat-semibold text-black">
          Max Hourly Rate: ${maxRate[0] >= 100 ? 'Any' : `${maxRate[0]}`}
        </Label>
        <Slider
          value={maxRate}
          onValueChange={handleRateChange}
          max={100}
          min={20}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>$20</span>
          <span>$100+</span>
        </div>
      </div>

      {/* Verification Filter */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified"
          checked={localFilters.onlyVerified || false}
          onCheckedChange={(checked) => updateFilters({ onlyVerified: checked === true ? true : undefined })}
        />
        <Label htmlFor="verified" className="text-sm cursor-pointer">
          Show only verified workers
        </Label>
      </div>
    </div>
  );
}