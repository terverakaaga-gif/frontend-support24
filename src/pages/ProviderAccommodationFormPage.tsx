import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CloseCircle,
  UploadMinimalistic,
  MapPoint,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

// Mock accommodation data for edit mode
const mockAccommodationData = {
  id: 1,
  title: "Ocean View Apartment",
  location: "123 Beach Road, Wollongong, NSW 2500",
  price: "350",
  priceUnit: "week",
  bedrooms: "2",
  bathrooms: "1",
  parking: "1",
  type: "Apartment",
  description: "This beautiful ocean view apartment is perfect for NDIS participants...",
  features: ["airConditioning", "petFriendly", "nbn"],
  accessibilityFeatures: ["elevatorAccess", "wideDoorways"],
  image: null,
};

interface AccommodationFormData {
  title: string;
  location: string;
  price: string;
  priceUnit: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  type: string;
  description: string;
  features: string[];
  accessibilityFeatures: string[];
  image: File | null;
}

const propertyTypes = [
  "Apartment",
  "House",
  "Unit",
  "Studio",
  "Townhouse",
  "Villa",
  "Granny Flat",
];

const featureOptions = [
  { id: "airConditioning", label: "Air Conditioning" },
  { id: "heating", label: "Heating" },
  { id: "petFriendly", label: "Pet Friendly" },
  { id: "furnished", label: "Furnished" },
  { id: "unfurnished", label: "Unfurnished" },
  { id: "nbn", label: "NBN Connected" },
  { id: "secureParking", label: "Secure Parking" },
  { id: "laundry", label: "Laundry Facilities" },
  { id: "dishwasher", label: "Dishwasher" },
  { id: "balcony", label: "Balcony/Patio" },
  { id: "garden", label: "Garden" },
  { id: "pool", label: "Pool Access" },
];

const accessibilityOptions = [
  { id: "elevatorAccess", label: "Elevator Access" },
  { id: "wideDoorways", label: "Wide Doorways" },
  { id: "wheelchairAccessible", label: "Wheelchair Accessible" },
  { id: "grabRails", label: "Grab Rails in Bathroom" },
  { id: "levelEntry", label: "Level Entry" },
  { id: "ramp", label: "Ramp Access" },
  { id: "accessibleParking", label: "Accessible Parking" },
  { id: "rollInShower", label: "Roll-in Shower" },
];

export default function ProviderAccommodationFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accommodationId } = useParams();
  const isEditMode = !!accommodationId;

  // Initialize form with mock data if in edit mode
  const [formData, setFormData] = useState<AccommodationFormData>(
    isEditMode
      ? {
          title: mockAccommodationData.title,
          location: mockAccommodationData.location,
          price: mockAccommodationData.price,
          priceUnit: mockAccommodationData.priceUnit,
          bedrooms: mockAccommodationData.bedrooms,
          bathrooms: mockAccommodationData.bathrooms,
          parking: mockAccommodationData.parking,
          type: mockAccommodationData.type,
          description: mockAccommodationData.description,
          features: mockAccommodationData.features,
          accessibilityFeatures: mockAccommodationData.accessibilityFeatures,
          image: null,
        }
      : {
          title: "",
          location: "",
          price: "",
          priceUnit: "week",
          bedrooms: "",
          bathrooms: "",
          parking: "",
          type: "",
          description: "",
          features: [],
          accessibilityFeatures: [],
          image: null,
        }
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AccommodationFormData, string>>
  >({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof AccommodationFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureToggle = (featureId: string, isAccessibility: boolean) => {
    const field = isAccessibility ? "accessibilityFeatures" : "features";
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(featureId)
        ? prev[field].filter((f) => f !== featureId)
        : [...prev[field], featureId],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
        setErrors((prev) => ({
          ...prev,
          image: "File must be PNG or JPG",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AccommodationFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Property title is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.type) {
      newErrors.type = "Property type is required";
    }

    if (!formData.bedrooms) {
      newErrors.bedrooms = "Number of bedrooms is required";
    }

    if (!formData.bathrooms) {
      newErrors.bathrooms = "Number of bathrooms is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Form data:", formData);

    if (isEditMode) {
      console.log("Updating accommodation:", accommodationId);
    } else {
      console.log("Creating new accommodation");
    }

    navigate("/provider/accommodations");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <GeneralHeader
        showBackButton
        stickyTop={false}
        title={isEditMode ? "Edit Accommodation" : "Add New Accommodation"}
        subtitle=""
        user={user}
        onLogout={() => {}}
        onViewProfile={() => navigate("/provider/profile")}
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        {/* Image Upload */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
            Property Images
          </Label>

          {imagePreview ? (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
              <img
                src={imagePreview}
                alt="Property preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-6 right-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                <CloseCircle className="h-5 w-5 text-red-600" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <UploadMinimalistic className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-sm text-gray-600 mb-2">
                  Drop and drop your file or{" "}
                  <label className="text-primary cursor-pointer hover:underline">
                    Browse
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-400">
                  File type: PNG + JPG, File limit: 5MB
                </p>
              </div>
            </div>
          )}
          {errors.image && (
            <p className="text-xs text-red-600 mt-1">{errors.image}</p>
          )}
        </div>

        {/* Property Title */}
        <div className="mb-6">
          <Label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 block">
            Property Title
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Ocean View Apartment"
            value={formData.title}
            onChange={handleInputChange}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-xs text-red-600 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Location */}
        <div className="mb-6">
          <Label htmlFor="location" className="text-sm font-semibold text-gray-700 mb-2 block">
            Full Address
          </Label>
          <div className="relative">
            <Input
              id="location"
              name="location"
              placeholder="123 Street Name, Suburb, State Postcode"
              value={formData.location}
              onChange={handleInputChange}
              className={errors.location ? "border-red-500 pr-10" : "pr-10"}
            />
            <MapPoint className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.location && (
            <p className="text-xs text-red-600 mt-1">{errors.location}</p>
          )}
        </div>

        {/* Price and Property Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-2 block">
              Price ($)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="350"
              value={formData.price}
              onChange={handleInputChange}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-xs text-red-600 mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Price Period
            </Label>
            <Select
              value={formData.priceUnit}
              onValueChange={(value) => handleSelectChange("priceUnit", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Per Week</SelectItem>
                <SelectItem value="fortnight">Per Fortnight</SelectItem>
                <SelectItem value="month">Per Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Property Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-red-600 mt-1">{errors.type}</p>
            )}
          </div>
        </div>

        {/* Bedrooms, Bathrooms, Parking */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Bedrooms
            </Label>
            <Select
              value={formData.bedrooms}
              onValueChange={(value) => handleSelectChange("bedrooms", value)}
            >
              <SelectTrigger className={errors.bedrooms ? "border-red-500" : ""}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num === 0 ? "Studio" : num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bedrooms && (
              <p className="text-xs text-red-600 mt-1">{errors.bedrooms}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Bathrooms
            </Label>
            <Select
              value={formData.bathrooms}
              onValueChange={(value) => handleSelectChange("bathrooms", value)}
            >
              <SelectTrigger className={errors.bathrooms ? "border-red-500" : ""}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bathrooms && (
              <p className="text-xs text-red-600 mt-1">{errors.bathrooms}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Parking Spaces
            </Label>
            <Select
              value={formData.parking}
              onValueChange={(value) => handleSelectChange("parking", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
            Property Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Provide a detailed description of the property, including any unique features or selling points..."
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-xs text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Features */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            Property Features
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {featureOptions.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={formData.features.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id, false)}
                />
                <label
                  htmlFor={feature.id}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            Accessibility Features
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {accessibilityOptions.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={formData.accessibilityFeatures.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id, true)}
                />
                <label
                  htmlFor={feature.id}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 h-12"
        >
          {isEditMode ? "Update Listing" : "Publish Listing"}
        </Button>
      </form>
    </div>
  );
}