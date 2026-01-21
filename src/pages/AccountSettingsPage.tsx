import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BellBing, Pen } from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "John",
    lastName: user?.lastName || "Doe",
    email: user?.email || "johndoe@gmail.com",
    location: "Sydney, Australia",
    password: "******************",
    confirmPassword: "******************",
  });

  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage || null
  );

  const [editingField, setEditingField] = useState<string | null>(null);

  const handleFieldEdit = (field: string) => {
    setEditingField(field);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image under 15MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    // Handle save logic here
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 font-montserrat">
            Update your profile details and change password
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/support-coordinator/notifications")}
          >
            <BellBing className="h-6 w-6 text-gray-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Avatar */}
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src={profileImage || user?.profileImage || undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
              {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Settings Form */}
      <div className=" bg-white rounded-xl p-8">
        {/* Profile Picture Section */}
        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileImage || user?.profileImage || undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-bold text-2xl">
              {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-montserrat-bold text-gray-900 mb-1">
              Profile Picture
            </h3>
            <p className="text-sm text-gray-600 mb-3">PNG, JPEG under 15MB</p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-primary-600 text-primary-600 hover:bg-primary-50 font-montserrat-semibold"
                onClick={handleUploadClick}
              >
                Upload new picture
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 font-montserrat-semibold"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <Label className="text-sm font-montserrat-semibold text-gray-900 mb-2 block">
                First Name
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={editingField !== "firstName"}
                  className="pr-10 bg-white border-gray-300 disabled:opacity-100 disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => handleFieldEdit("firstName")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  <Pen className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Last Name */}
            <div>
              <Label className="text-sm font-montserrat-semibold text-gray-900 mb-2 block">
                Last Name
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={editingField !== "lastName"}
                  className="pr-10 bg-white border-gray-300 disabled:opacity-100 disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => handleFieldEdit("lastName")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  <Pen className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <Label className="text-sm font-montserrat-semibold text-gray-900 mb-2 block">
              Email Address
            </Label>
            <div className="relative">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={editingField !== "email"}
                className="pr-10 bg-white border-gray-300 disabled:opacity-100 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={() => handleFieldEdit("email")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                <Pen className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label className="text-sm font-montserrat-semibold text-gray-900 mb-2 block">
              Location
            </Label>
            <div className="relative">
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                disabled={editingField !== "location"}
                className="pr-10 bg-white border-gray-300 disabled:opacity-100 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={() => handleFieldEdit("location")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                <Pen className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Password and Confirm Password Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <Label className="text-sm font-montserrat-semibold text-gray-900 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  disabled={editingField !== "password"}
                  className="pr-10 bg-white border-gray-300 disabled:opacity-100 disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => handleFieldEdit("password")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  <Pen className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label className="text-sm font-montserrat-semibold text-gray-900 mb-2 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  disabled={editingField !== "confirmPassword"}
                  className="pr-10 bg-white border-gray-300 disabled:opacity-100 disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => handleFieldEdit("confirmPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  <Pen className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <Button
              onClick={handleSave}
              className="bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold px-8"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
