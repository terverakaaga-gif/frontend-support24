import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, CloseCircle } from "@solar-icons/react";
import { AddIcon } from "@/components/icons";

interface ServiceType {
  _id: string;
  name: string;
  code?: string;
}

interface Props {
  formData: any;
  addItem: (field: string, value: any) => void;
  removeItem: (field: string, index: any) => void;
  newLanguage: string;
  setNewLanguage: (value: string) => void;
  skills?: ServiceType[];
  isLoadingSkills?: boolean;
}

export const SkillsLanguagesStep = React.memo(
  ({
    formData,
    addItem,
    removeItem,
    newLanguage,
    setNewLanguage,
    skills = [],
    isLoadingSkills = false,
  }: Props) => {
    const handleSkillToggle = (skillId: string) => {
      const currentSkills = formData.skills || [];
      if (currentSkills.includes(skillId)) {
        const index = currentSkills.indexOf(skillId);
        removeItem("skills", index);
      } else {
        addItem("skills", skillId);
      }
    };

    const isSkillSelected = (skillId: string) => {
      return (formData.skills || []).includes(skillId);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <Star className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-montserrat-bold text-gray-900">
              Skills & Languages
            </h2>
            <p className="text-sm text-gray-600">
              Update your professional skills and languages
            </p>
          </div>
        </div>

        {/* Skills Selection */}
        <div className="space-y-3">
          <Label>Professional Skills</Label>
          <p className="text-sm text-gray-600">
            Select the services you can provide
          </p>

          {isLoadingSkills ? (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600">Loading skills...</p>
            </div>
          ) : skills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skills
                .filter((s: any) => s.status === "active")
                .map((skill) => (
                  <div
                    key={skill._id}
                    onClick={() => handleSkillToggle(skill._id)}
                    className={`
                  flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    isSkillSelected(skill._id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
                  >
                    <Checkbox
                      checked={isSkillSelected(skill._id)}
                      onCheckedChange={() => handleSkillToggle(skill._id)}
                    />
                    <Label className="cursor-pointer flex-1">
                      {skill.name}
                    </Label>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600">No skills available</p>
            </div>
          )}

          {/* Selected Skills Badges */}
          {formData.skills && formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map((skillId: string, index: number) => {
                const skill = skills.find((s) => s._id === skillId);
                return skill ? (
                  <Badge
                    key={skillId}
                    variant="secondary"
                    className="text-xs cursor-pointer bg-primary/10 text-primary"
                    onClick={() => removeItem("skills", index)}
                  >
                    {skill.name}
                    <CloseCircle className="h-3 w-3 ml-1" />
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="space-y-4">
          <Label>Languages</Label>
          <p className="text-sm text-gray-600">
            Add languages you can communicate in
          </p>
          <div className="flex flex-wrap gap-2">
            {formData.languages?.map((lang: string, i: number) => (
              <Badge key={i} className="bg-primary-100 text-primary px-3 py-1">
                {lang}
                <button
                  onClick={() => removeItem("languages", i)}
                  className="ml-2 hover:text-red-500"
                >
                  <CloseCircle className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add language (e.g., English, Mandarin)"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && newLanguage.trim()) {
                  e.preventDefault();
                  addItem("languages", newLanguage.trim());
                  setNewLanguage("");
                }
              }}
            />
            <Button
              onClick={() => {
                if (newLanguage.trim()) {
                  addItem("languages", newLanguage.trim());
                  setNewLanguage("");
                }
              }}
              disabled={!newLanguage.trim()}
            >
              <AddIcon className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
