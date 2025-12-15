
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@solar-icons/react";
import { EditProfileFormData } from "@/types/edit-profile";

interface Props {
  formData: EditProfileFormData;
  onChange: (field: keyof EditProfileFormData, value: any) => void;
}

export const BasicInfoStep = ({ formData, onChange }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-montserrat-bold text-gray-900">Basic Information</h2>
          <p className="text-sm text-gray-600">Your personal details and contact information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" value={formData.firstName || ""} onChange={(e) => onChange("firstName", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input id="lastName" value={formData.lastName || ""} onChange={(e) => onChange("lastName", e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" value={formData.phone || ""} onChange={(e) => onChange("phone", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender || ""} onValueChange={(val) => onChange("gender", val)}>
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input 
            id="dateOfBirth" 
            type="date" 
            value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ""} 
            onChange={(e) => onChange("dateOfBirth", e.target.value ? new Date(e.target.value) : null)} 
        />
      </div>
      
      {/* Notification Preferences only for participant in original code? Or both? Assuming shared for now based on structure */}
      <div className="space-y-2">
        <Label htmlFor="notificationPreferences">Notification Preferences</Label>
        <Select value={formData.notificationPreferences || ""} onValueChange={(val) => onChange("notificationPreferences", val)}>
            <SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="emailAndSms">Both Email & SMS</SelectItem>
                <SelectItem value="none">None</SelectItem>
            </SelectContent>
        </Select>
      </div>
    </div>
  );
};