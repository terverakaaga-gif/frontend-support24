import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface RegisterEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle?: string;
}

export function RegisterEventModal({
  open,
  onOpenChange,
  eventTitle = "Event",
}: RegisterEventModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    reasonForAttending: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration data:", formData);
    // Handle registration logic here
    alert("Registration successful! Additional information will be sent to your email.");
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      location: "",
      reasonForAttending: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-gray-50">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-montserrat-bold text-gray-900">
              Register
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <X className="h-5 w-5 text-gray-700" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Enter your details below to register, additional information will be sent to your email
          </p>
        </DialogHeader>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-montserrat-semibold text-gray-900">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe Singh"
              className="h-12 bg-white border-gray-300"
              required
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-montserrat-semibold text-gray-900">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="johndoe@gmail.com"
              className="h-12 bg-white border-gray-300"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-montserrat-semibold text-gray-900">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+61 67635567"
              className="h-12 bg-white border-gray-300"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-montserrat-semibold text-gray-900">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="123 Main Street, Anytown, AU"
              className="h-12 bg-white border-gray-300"
              required
            />
          </div>

          {/* Reason for Attending */}
          <div className="space-y-2">
            <Label htmlFor="reasonForAttending" className="text-sm font-montserrat-semibold text-gray-900">
              Reason for Attending
            </Label>
            <Textarea
              id="reasonForAttending"
              name="reasonForAttending"
              value={formData.reasonForAttending}
              onChange={handleInputChange}
              placeholder="Enter your reason here......"
              className="min-h-[100px] bg-white border-gray-300"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-700 text-white h-12 text-base font-montserrat-semibold"
            >
              Register
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
