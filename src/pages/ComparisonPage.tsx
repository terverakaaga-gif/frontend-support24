import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BellBing, Star, CheckCircle } from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface PanelMember {
  id: number;
  name: string;
  type: "Provider" | "Support Worker";
  status: "Active" | "Inactive";
  rating: number;
  distance: number;
  price: number;
  logo: string | null;
}

// Mock detailed data
const getMemberDetails = (member: PanelMember) => {
  if (member.type === "Provider") {
    return {
      services: [
        {
          name: "Personal Care (Assistance with showering, dressing, mobility)",
          price: "$60/hr",
        },
        { name: "Core — Community Access / Social Support", price: "$70/hr" },
        {
          name: "Supported Independent Living (SIL) – overnight staffing",
          price: "$100/hr",
        },
        { name: "Assistance (cleaning, meal prep", price: "$40/hr" },
      ],
      specializations: [
        "Supported Independent Living (SIL) transition & tenancy support",
        "Personal care and daily living assistance",
        "Community participation & social inclusion programs",
      ],
      usageHistory:
        "I've worked with Hope Care Service Limited before, and it was a really positive experience. Their team made it easy to make referrals and followed through effectively with every participant I assigned to them. They maintained good communication and ensured participants were supported smoothly throughout their plans.",
    };
  } else {
    return {
      services: [
        {
          name: "Personal Care (Assistance with showering, dressing, mobility)",
          price: "$60/hr",
        },
        { name: "Core — Community Access / Social Support", price: "$70/hr" },
        {
          name: "Supported Independent Living (SIL) – overnight staffing",
          price: "$100/hr",
        },
        { name: "Assistance (cleaning, meal prep", price: "$40/hr" },
      ],
      specializations: [
        "Supported Independent Living (SIL) transition & tenancy support",
        "Personal care and daily living assistance",
        "Community participation & social inclusion programs",
      ],
      compliance: [
        { label: "First Aid Certificate", verified: true },
        { label: "CPR Certificate", verified: true },
      ],
      usageHistory:
        "I've worked with Grace Lemmy before, and it was a really positive experience. She made it easy to make referrals and followed through effectively with every participant I assigned to them. She maintained good communication and ensured participants were supported smoothly throughout their plans.",
    };
  }
};

export default function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const members: PanelMember[] = location.state?.members || [];

  if (members.length === 0) {
    navigate("/support-coordinator/my-panel");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
            Comparison
          </h1>
          <p className="text-gray-600 font-montserrat">
            Analyze provider details to make the best selection for your participant
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
            <AvatarImage src={user?.profileImage || undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => {
          const details = getMemberDetails(member);
          return (
            <Card key={member.id} className="p-6 border border-gray-200 rounded-xl bg-white">
              {/* Member Header */}
              <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-200">
                {member.type === "Provider" ? (
                  <div className="h-20 w-20 rounded-full bg-gray-900 flex items-center justify-center mb-4">
                    <img
                      src="/tdesign_logo-cnb-filled.png"
                      alt="Provider logo"
                      className="h-12 w-12"
                    />
                  </div>
                ) : (
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={member.logo || undefined} />
                    <AvatarFallback className="bg-red-100 text-red-700 font-montserrat-bold text-2xl">
                      GL
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-montserrat-bold text-gray-900">
                    {member.name}
                  </h3>
                  <Badge className="bg-green-100 text-green-700 text-xs font-montserrat-semibold">
                    {member.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 font-montserrat mb-3">
                  {member.type}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                    <span className="font-montserrat">{member.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-montserrat">📍 {member.distance} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-montserrat">💰 ${member.price}</span>
                  </div>
                </div>
              </div>

              {/* Lists of Services and Pricing */}
              <div className="mb-6">
                <h4 className="font-montserrat-bold text-gray-900 mb-3">
                  Lists of Services and Pricing
                </h4>
                <div className="space-y-3">
                  {details.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <span className="text-gray-700 font-montserrat flex-1">
                        {service.name}
                      </span>
                      <span className="font-montserrat-semibold text-gray-900 whitespace-nowrap">
                        {service.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-6">
                <h4 className="font-montserrat-bold text-gray-900 mb-3">
                  Specializations
                </h4>
                <ul className="space-y-2">
                  {details.specializations.map((spec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700 font-montserrat"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-900 flex-shrink-0"></span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compliance Check (Support Workers only) */}
              {member.type === "Support Worker" && details.compliance && (
                <div className="mb-6">
                  <h4 className="font-montserrat-bold text-gray-900 mb-3">
                    Compliance Check
                  </h4>
                  <div className="space-y-2">
                    {details.compliance.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 font-montserrat">
                          {item.label}
                        </span>
                        {item.verified && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Usage History */}
              <div className="mb-6">
                <h4 className="font-montserrat-bold text-gray-900 mb-3">
                  My Usage History
                </h4>
                <p className="text-sm text-gray-700 font-montserrat leading-relaxed">
                  {details.usageHistory}
                </p>
              </div>

              {/* Add to Participant Button */}
              <Button
                variant="outline"
                className="w-full border-primary-600 text-primary-600 hover:bg-primary-50 font-montserrat-semibold h-11"
              >
                Add to Participant
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
