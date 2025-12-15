import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Translation, CloseCircle, TrashBinMinimalistic, AddCircle, CheckCircle } from "@solar-icons/react";
import { CustomDatePicker } from "@/components/supportworker/CustomDatePicker";
import { format } from "date-fns";

export const ExperienceStep = ({ 
  formData, removeExperience, addExperience, newExperience, setNewExperience, resumeFile, setResumeFile 
}: any) => {
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        alert('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setResumeFile(file);
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <Translation className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
          <p className="text-sm text-gray-600">Add your relevant work experience and upload your resume</p>
        </div>
      </div>

      {/* List Existing Experiences */}
      <div className="space-y-4">
        {formData.experience?.map((exp: any, index: number) => {
          const startDate = exp.startDate ? new Date(exp.startDate) : null;
          const endDate = exp.endDate ? new Date(exp.endDate) : null;
          
          return (
            <div key={index} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3 relative group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-montserrat-bold text-gray-900">{exp.title}</h4>
                  <p className="text-sm text-gray-600">{exp.organization}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {startDate ? format(startDate, "MMM yyyy") : "Unknown"} - {endDate ? format(endDate, "MMM yyyy") : "Present"}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => removeExperience(index)} 
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <TrashBinMinimalistic className="w-5 h-5"/>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Experience Form */}
      <div className="p-4 rounded-xl bg-primary-50/50 border border-primary-100 space-y-4">
        <h4 className="font-montserrat-semibold text-sm italic text-gray-700">Add New Experience</h4>
        
        {/* Job Title */}
        <div className="space-y-2">
          <Label className="font-montserrat-semibold text-gray-900">Job Title</Label>
          <Input 
            placeholder="e.g. Support Worker" 
            className="h-12 bg-white rounded-lg"
            value={newExperience.title} 
            onChange={e => setNewExperience({...newExperience, title: e.target.value})} 
          />
        </div>

        {/* Organization */}
        <div className="space-y-2">
          <Label className="font-montserrat-semibold text-gray-900">Organization</Label>
          <Input 
            placeholder="e.g. NDIS Provider" 
            className="h-12 bg-white rounded-lg"
            value={newExperience.organization} 
            onChange={e => setNewExperience({...newExperience, organization: e.target.value})} 
          />
        </div>

        {/* Date Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-montserrat-semibold text-gray-900">Start Date</Label>
            <CustomDatePicker
              value={newExperience.startDate ? new Date(newExperience.startDate) : undefined}
              onChange={(date) => setNewExperience({...newExperience, startDate: date ? date.toISOString() : ""})}
              maxDate={new Date()}
              placeholder="dd/mm/yyyy"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-montserrat-semibold text-gray-900">End Date</Label>
            <CustomDatePicker
              value={newExperience.endDate ? new Date(newExperience.endDate) : undefined}
              onChange={(date) => setNewExperience({...newExperience, endDate: date ? date.toISOString() : ""})}
              minDate={newExperience.startDate ? new Date(newExperience.startDate) : undefined}
              maxDate={new Date()}
              placeholder="dd/mm/yyyy"
              disabled={!newExperience.startDate}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="font-montserrat-semibold text-gray-900">Description</Label>
          <Textarea 
            placeholder="Enter job experience here..." 
            className="min-h-[120px] bg-white rounded-lg resize-none p-4"
            value={newExperience.description} 
            onChange={e => setNewExperience({...newExperience, description: e.target.value})} 
          />
        </div>

        <Button 
          type="button"
          onClick={addExperience} 
          className="w-full bg-primary-600 hover:bg-primary-700"
          disabled={!newExperience.title || !newExperience.organization}
        >
          <AddCircle className="w-4 h-4 mr-2"/> Add Experience
        </Button>
      </div>

      {/* Resume Upload */}
      <div className="border-t pt-6">
        <div className="space-y-2">
          <Label className="font-montserrat-semibold text-gray-900">
            Resume/CV
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="space-y-2">
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="h-12 bg-white rounded-lg"
            />
            {resumeFile && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="flex-1">{resumeFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveResume}
                  className="h-6 w-6 p-0 hover:bg-red-100"
                >
                  <CloseCircle className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )}
            {formData.resume && !resumeFile && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="flex-1">Current resume on file</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Upload PDF, DOC, or DOCX (Max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};