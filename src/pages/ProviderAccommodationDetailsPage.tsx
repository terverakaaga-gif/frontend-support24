import { useNavigate, useParams } from "react-router-dom";
import {
  MapPoint,
  Pen2,
  Home,
  DollarMinimalistic,
  Bed,
  CheckCircle,
  Buildings,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Mock accommodation data
const mockAccommodation = {
  id: 1,
  title: "Ocean View Apartment",
  location: "123 Beach Road, Wollongong, NSW 2500",
  price: 350,
  priceUnit: "week",
  bedrooms: 2,
  bathrooms: 1,
  parking: 1,
  type: "Apartment",
  status: "Available",
  interested: 12,
  image: null,
  description: `This beautiful ocean view apartment is perfect for NDIS participants seeking independent living with stunning views of the coastline. Located just 5 minutes from Wollongong CBD, this property offers easy access to public transport, shopping centers, and medical facilities.

The apartment features modern finishes throughout, with an open-plan living and dining area that flows onto a private balcony overlooking the ocean. The kitchen is fully equipped with quality appliances and ample storage space.

Both bedrooms are generously sized with built-in wardrobes, and the main bathroom includes a shower and bathtub. The property also includes secure underground parking and access to building amenities including a gym and communal garden.`,
  features: [
    "Ocean views from living area and balcony",
    "Air conditioning throughout",
    "Secure building with intercom access",
    "Close to public transport",
    "Pet-friendly on application",
    "NBN connected",
  ],
  accessibility: [
    "Elevator access to all floors",
    "Wide doorways throughout",
    "Accessible bathroom with grab rails",
    "Level entry from car park",
  ],
  nearbyServices: [
    "Wollongong Hospital - 2km",
    "Wollongong Central Shopping - 1km",
    "Bus stop - 100m",
    "Train station - 500m",
  ],
};

export default function ProviderAccommodationDetailsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accommodationId } = useParams();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <GeneralHeader
            stickyTop={false}
            showBackButton
            title={mockAccommodation.title}
            subtitle=""
            user={user}
            onLogout={() => {}}
            onViewProfile={() => navigate("/provider/profile")}
          />
        </div>

        {/* Accommodation Image */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="w-full h-64 md:h-80 bg-gradient-to-r from-primary-100 to-purple-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Home className="h-16 w-16 mx-auto mb-2" />
              <p className="text-sm">Accommodation Image</p>
            </div>
          </div>
        </div>

        {/* Accommodation Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {mockAccommodation.title}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    mockAccommodation.status
                  )}`}
                >
                  {mockAccommodation.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPoint className="h-4 w-4" />
                <span className="text-sm">{mockAccommodation.location}</span>
              </div>
            </div>
            <Button
              onClick={() =>
                navigate(`/provider/accommodations/${accommodationId}/edit`)
              }
              className="bg-primary hover:bg-primary/90"
            >
              <Pen2 className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
          </div>

          {/* Price and Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <DollarMinimalistic className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold text-primary">
                ${mockAccommodation.price}
              </p>
              <p className="text-xs text-gray-500">per {mockAccommodation.priceUnit}</p>
            </div>
            <div className="text-center">
              <Buildings className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {mockAccommodation.bedrooms}
              </p>
              <p className="text-xs text-gray-500">Bedrooms</p>
            </div>
            <div className="text-center">
              <Home className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {mockAccommodation.bathrooms}
              </p>
              <p className="text-xs text-gray-500">Bathrooms</p>
            </div>
            <div className="text-center">
              <Buildings className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {mockAccommodation.parking}
              </p>
              <p className="text-xs text-gray-500">Parking</p>
            </div>
          </div>

          {/* Interested Users */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                ></div>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              +{mockAccommodation.interested} people interested
            </span>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Description
            </h3>
            <div className="text-sm text-gray-600 space-y-4 whitespace-pre-line">
              {mockAccommodation.description}
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockAccommodation.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" />
              Accessibility Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockAccommodation.accessibility.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nearby Services */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nearby Services
            </h3>
            <ul className="space-y-3">
              {mockAccommodation.nearbyServices.map((service, index) => (
                <li key={index} className="flex items-start gap-3">
                  <MapPoint className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <Button
              onClick={() =>
                navigate(`/provider/accommodations/${accommodationId}/interested`)
              }
              className="w-full bg-primary hover:bg-primary/90"
            >
              View Enquired Participants ({mockAccommodation.interested})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}