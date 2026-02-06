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
import { FileDropZone, UploadedFile } from "@/components/ui/FileDropZone";
import { X } from "lucide-react";

interface EnquireAccommodationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accommodationTitle?: string;
}

export function EnquireAccommodationModal({
  open,
  onOpenChange,
  accommodationTitle = "Accommodation",
}: EnquireAccommodationModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    reasonForEnquiry: "",
  });
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilesChange = (files: UploadedFile[] | ((prevFiles: UploadedFile[]) => UploadedFile[])) => {
    if (typeof files === "function") {
      setAttachments(files);
    } else {
      setAttachments(files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enquiry data:", formData, attachments);
    // Handle enquiry logic here
    alert("Enquiry sent successfully! We will get back to you immediately.");
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      location: "",
      reasonForEnquiry: "",
    });
    setAttachments([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-gray-50">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-montserrat-bold text-gray-900">
              Enquire
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

          {/* Reason for Enquiry */}
          <div className="space-y-2">
            <Label htmlFor="reasonForEnquiry" className="text-sm font-montserrat-semibold text-gray-900">
              Reason for Enquiry
            </Label>
            <Textarea
              id="reasonForEnquiry"
              name="reasonForEnquiry"
              value={formData.reasonForEnquiry}
              onChange={handleInputChange}
              placeholder="Enter your reason here......"
              className="min-h-[100px] bg-white border-gray-300"
              required
            />
          </div>

          {/* Attachment */}
          <div className="space-y-2">
            <Label className="text-sm font-montserrat-semibold text-gray-900">
              Attachment
            </Label>
            <FileDropZone
              files={attachments}
              onFilesChange={handleFilesChange}
              maxFiles={3}
              maxSizeMB={5}
              acceptedTypes={["image/png", "image/jpeg", "application/pdf"]}
              title="Drop and drop your file or"
              subtitle="Maximum file: 3, File type: PNG + JPG + PDF, File limit: 5MB"
              browseText="Browse"
              compact={false}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-700 text-white h-12 text-base font-montserrat-semibold"
            >
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
