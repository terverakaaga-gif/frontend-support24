import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BellBing,
  AltArrowLeft,
  Pen,
  TrashBinMinimalistic,
  Letter,
  AltArrowRight,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock notification details
const notificationDetails: Record<
  string,
  {
    id: string;
    title: string;
    date: string;
    type: "plan-expiry" | "tender-submission";
    content: any;
  }
> = {
  "1": {
    id: "1",
    title: "Plan expiring in 90 days - Support24",
    date: "1 Nov, 2025",
    type: "plan-expiry",
    content: {
      greeting: "Dear John Doe",
      message:
        "Your participant's current support plan is set to expire in 90 days. Please review the plan details and begin the renewal process to ensure uninterrupted services and funding continuity.",
      planDetails: {
        participantName: "Jane Doe",
        planStartDate: "24 Oct, 2025",
        planEndDate: "1 Dec, 2025",
        remainingDays: "90 days",
        coordinatorName: "John Doe",
      },
    },
  },
  "2": {
    id: "2",
    title: "Plan expiring in 90 days - Support24",
    date: "1 Nov, 2025",
    type: "plan-expiry",
    content: {
      greeting: "Dear John Doe",
      message:
        "Your participant's current support plan is set to expire in 90 days. Please review the plan details and begin the renewal process to ensure uninterrupted services and funding continuity.",
      planDetails: {
        participantName: "Jane Doe",
        planStartDate: "24 Oct, 2025",
        planEndDate: "1 Dec, 2025",
        remainingDays: "90 days",
        coordinatorName: "John Doe",
      },
    },
  },
  "3": {
    id: "3",
    title: "Plan expiring in 90 days - Support24",
    date: "1 Nov, 2025",
    type: "plan-expiry",
    content: {
      greeting: "Dear John Doe",
      message:
        "Your participant's current support plan is set to expire in 90 days. Please review the plan details and begin the renewal process to ensure uninterrupted services and funding continuity.",
      planDetails: {
        participantName: "Jane Doe",
        planStartDate: "24 Oct, 2025",
        planEndDate: "1 Dec, 2025",
        remainingDays: "90 days",
        coordinatorName: "John Doe",
      },
    },
  },
  "4": {
    id: "4",
    title: "Plan expiring in 90 days - Support24",
    date: "1 Nov, 2025",
    type: "tender-submission",
    content: {
      greeting: "Dear John Doe",
      message: "You have three new submission on tender ST24-001234",
      tenderId: "ST24-001234",
    },
  },
  "5": {
    id: "5",
    title: "Plan expiring in 90 days - Support24",
    date: "1 Nov, 2025",
    type: "tender-submission",
    content: {
      greeting: "Dear John Doe",
      message: "You have three new submission on tender ST24-001234",
      tenderId: "ST24-001234",
    },
  },
};

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const notification = id ? notificationDetails[id] : null;

  if (!notification) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <p>Notification not found</p>
      </div>
    );
  }

  const isPlanExpiry = notification.type === "plan-expiry";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/support-coordinator/notifications")}
            className="h-8 w-8"
          >
            <AltArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pen className="h-5 w-5 text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <TrashBinMinimalistic className="h-5 w-5 text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Letter className="h-5 w-5 text-gray-700" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification */}
          <Button variant="ghost" size="icon" className="relative">
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

      {/* Title and Date */}
      <div className="mb-6">
        <h1 className="text-2xl font-montserrat-bold text-gray-900 mb-2">
          {notification.title}
        </h1>
        <p className="text-sm text-gray-600 font-montserrat">
          {notification.date}
        </p>
      </div>

      {/* Email Content */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          {/* Header Banner */}
          <div className="bg-[#1a1d2e] h-40 flex items-center justify-center">
            <div className="text-white font-montserrat-bold text-4xl">
              SUPP
              <span className="inline-block h-7 w-7 rounded-full bg-white mx-1 relative">
                <span className="absolute inset-0 flex items-center justify-center text-[#1a1d2e] text-xl">
                  @
                </span>
              </span>
              RT<span className="text-yellow-400">24</span>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-8">
            <p className="text-lg font-montserrat-semibold text-gray-900 mb-4">
              {notification.content.greeting} 😊
            </p>

            {isPlanExpiry ? (
              <>
                <p className="text-gray-700 font-montserrat mb-6 leading-relaxed">
                  {notification.content.message}
                </p>

                {/* Plan Details Box */}
                <div className="border-l-4 border-primary-600 bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-montserrat-bold text-gray-900 mb-4">
                    Plan Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-montserrat">
                        Participant Name:
                      </span>
                      <span className="font-montserrat-semibold text-gray-900">
                        {notification.content.planDetails.participantName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-montserrat">
                        Plan Start Date:
                      </span>
                      <span className="font-montserrat-semibold text-gray-900">
                        {notification.content.planDetails.planStartDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-montserrat">
                        Plan End Date:
                      </span>
                      <span className="font-montserrat-semibold text-gray-900">
                        {notification.content.planDetails.planEndDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-montserrat">
                        Remaining Days:
                      </span>
                      <span className="font-montserrat-semibold text-gray-900">
                        {notification.content.planDetails.remainingDays}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-montserrat">
                        Coordinator's Name:
                      </span>
                      <span className="font-montserrat-semibold text-gray-900">
                        {notification.content.planDetails.coordinatorName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center mb-6">
                  <Button
                    className="bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold px-6 py-3 h-auto"
                    onClick={() => navigate("/support-coordinator/participants")}
                  >
                    View Participant Profile
                    <AltArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700 font-montserrat mb-6">
                  {notification.content.message}
                </p>

                {/* CTA Button */}
                <div className="flex justify-center mb-6">
                  <Button
                    className="bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold px-6 py-3 h-auto"
                    onClick={() => navigate("/support-coordinator/tender")}
                  >
                    Go to Tender Dashboard
                    <AltArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </>
            )}

            {/* Tagline */}
            <p className="text-center text-sm italic text-gray-600 font-montserrat mb-6">
              Let's build a healthier workplace or community together
            </p>

            {/* Signature */}
            <div className="text-gray-700 font-montserrat">
              <p className="mb-1">Best Regards</p>
              <p className="font-montserrat-semibold">Support24 Team</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#1a1d2e] text-white text-center py-6 px-8">
            <p className="text-sm mb-2">© 2025 Support24. All rights reserved.</p>
            <p className="text-sm mb-4">
              Connecting organizations with trusted allied health professionals
            </p>
            {/* Social Icons */}
            <div className="flex items-center justify-center gap-3">
              <button className="h-8 w-8 rounded-full bg-white text-[#1a1d2e] flex items-center justify-center hover:bg-gray-100 transition-colors">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </button>
              <button className="h-8 w-8 rounded-full bg-white text-[#1a1d2e] flex items-center justify-center hover:bg-gray-100 transition-colors">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </button>
              <button className="h-8 w-8 rounded-full bg-white text-[#1a1d2e] flex items-center justify-center hover:bg-gray-100 transition-colors">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

