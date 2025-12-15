import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, CloseCircle } from "@solar-icons/react";
import { Plus } from "lucide-react";
import { commonLanguages } from "@/constants/common-languages";

export const PreferencesStep = ({ 
  formData, onChange, addItem, removeItem, newLanguage, setNewLanguage 
}: any) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <Star className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
          <p className="text-sm text-gray-600">Your care preferences</p>
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <Label>Preferred Languages</Label>
        <div className="flex flex-wrap gap-2">
          {formData.preferredLanguages?.map((lang: string, i: number) => (
            <Badge key={i} className="bg-primary-100 text-primary px-3 py-1">
              {lang}
              <button onClick={() => removeItem("preferredLanguages", i)} className="ml-2 hover:text-red-500">
                <CloseCircle className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        
        {/* Quick Add Buttons */}
        <div className="flex flex-wrap gap-2">
            {commonLanguages.filter(l => !formData.preferredLanguages?.includes(l)).slice(0,5).map(l => (
                <Button key={l} variant="outline" size="sm" onClick={() => addItem("preferredLanguages", l)} className="h-6 text-xs rounded-full">
                    + {l}
                </Button>
            ))}
        </div>

        <div className="flex gap-2">
          <Input 
            placeholder="Add language" 
            value={newLanguage} 
            onChange={(e) => setNewLanguage(e.target.value)} 
          />
          <Button onClick={() => { addItem("preferredLanguages", newLanguage); setNewLanguage(""); }}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Additional Notes</Label>
        <Textarea
          value={formData.notes || ""}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Notes about your care needs..."
          className="min-h-[120px]"
        />
      </div>
    </div>
  );
};