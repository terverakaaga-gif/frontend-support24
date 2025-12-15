import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, CloseCircle } from "@solar-icons/react";
import { Plus } from "lucide-react";

export const SkillsLanguagesStep = ({ 
  formData, addItem, removeItem, newLanguage, setNewLanguage 
}: any) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <Star className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Skills & Languages</h2>
        </div>
      </div>

      {/* Read Only Skills */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <Label>Professional Skills</Label>
        <p className="text-sm text-gray-600 mt-1">
           {formData.skills?.length || 0} skills configured (Managed by Admin)
        </p>
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <Label>Languages</Label>
        <div className="flex flex-wrap gap-2">
          {formData.languages?.map((lang: string, i: number) => (
            <Badge key={i} className="bg-primary-100 text-primary px-3 py-1">
              {lang}
              <button onClick={() => removeItem("languages", i)} className="ml-2 hover:text-red-500">
                <CloseCircle className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Add language" 
            value={newLanguage} 
            onChange={(e) => setNewLanguage(e.target.value)} 
          />
          <Button onClick={() => { addItem("languages", newLanguage); setNewLanguage(""); }}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
};