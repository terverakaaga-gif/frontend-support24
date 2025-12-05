import GeneralHeader from "@/components/GeneralHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { AltArrowRight, CheckCircle } from "@solar-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockUnverifiedWorker = {
  name: "John Doe Singh",
  image: null,
  idNumber: null,
  email: "johndoe@gmail.com",
  phoneNumber: "+61 000 000 00",
  status: "Inactive",
  isVerified: false,
  verificationDate: null,
  issuedDate: null,
  expiryDate: null,
  qualifications: [],
  signature: null,
};

const mockVerifiedWorker = {
  name: "John Doe Singh",
  image: null,
  idNumber: "12345679",
  email: "johndoe@gmail.com",
  phoneNumber: "+61 000 000 00",
  status: "Active",
  isVerified: true,
  verificationDate: "5 Mar, 2025",
  issuedDate: "12 Oct, 2025",
  expiryDate: "12 Oct, 2026",
  qualifications: [
    "First Aid Certificate",
    "CPR Certificate",
    "Police Check",
    "Working with Children Check",
    "Relevant Insurance",
  ],
  signature: null,
};

export default function ComplianceCheckPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  // Toggle this to see different states
  const [workerInfo] = useState(mockUnverifiedWorker);
  // const [workerInfo] = useState(mockVerifiedWorker);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <GeneralHeader
        title="Compliance Check"
        subtitle="Verify your documents and certifications to complete compliance status"
        onLogout={logout}
        user={user}
        onViewProfile={() => navigate("/support-worker/profile")}
      />

      {/* Main Content */}
      <div className="max-w-md font-montserrat-bold mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative pb-12">
          {/* Watermark - positioned absolutely */}
          {!workerInfo.isVerified && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <img src="/logo.svg" alt="Verified" className="w-full" />
            </div>
          )}

          {workerInfo.isVerified && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
              <div className="text-primary-600 font-bold text-8xl md:text-9xl tracking-wider transform rotate-[-15deg]">
                VERIFIED
              </div>
            </div>
          )}

          <div className="relative z-10 p-6 md:p-8">
            {/* Avatar Section with styled graphic arround the avatar */}
            <div className="flex items-center justify-center mb-6 relative">
             {/* <img className="absolute  w-full h-fit rounded-b-2xl" src="/new-res/compliance-avatar-grahpics"  /> */}
             <Avatar className="w-32 h-32">
              <AvatarImage src="" alt="Avatar Image" />
              <AvatarFallback>
                {workerInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
             </Avatar>
            </div>

            {/* Worker Information */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Worker Information
              </h3>
              <div className="space-y-3">
                <InfoRow
                  label="ID Number:"
                  value={workerInfo.idNumber || "Not Available"}
                  valueClassName={
                    workerInfo.idNumber ? "text-gray-900" : "text-gray-400"
                  }
                />
                <InfoRow label="Email:" value={workerInfo.email} />
                <InfoRow label="Phone Number:" value={workerInfo.phoneNumber} />

                {/* Status Row */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Status:</span>
                  <div className="flex items-center gap-2">
                    {workerInfo.isVerified && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white fill-current" />
                      </div>
                    )}
                    <span
                      className={`font-semibold text-sm ${
                        workerInfo.status === "Active"
                          ? "text-green-600"
                          : workerInfo.status === "Pending"
                          ? "text-yellow-600"
                          : "text-gray-500"
                      }`}
                    >
                      {workerInfo.status}
                    </span>
                  </div>
                </div>

                <InfoRow
                  label="Verification Date:"
                  value={workerInfo.verificationDate || "Not Verified"}
                  valueClassName={
                    workerInfo.verificationDate
                      ? "text-gray-900"
                      : "text-gray-400"
                  }
                />
                <InfoRow
                  label="Issued Date:"
                  value={workerInfo.issuedDate || "Not Issued"}
                  valueClassName={
                    workerInfo.issuedDate ? "text-gray-900" : "text-gray-400"
                  }
                />
                <InfoRow
                  label="Expiry Date:"
                  value={workerInfo.expiryDate || "Not Issued"}
                  valueClassName={
                    workerInfo.expiryDate ? "text-gray-900" : "text-gray-400"
                  }
                />
              </div>
            </section>

            {/* Qualification and Certifications */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Qualification and Certifications
              </h3>
              {workerInfo.qualifications.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No qualifications and certifications added yet
                </p>
              ) : (
                <ul className="space-y-3">
                  {workerInfo.qualifications.map((qual, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-700 text-sm"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Signature Section */}
            {workerInfo.isVerified && (
              <section className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Signature
                </h3>
                <div className="h-16 flex items-center">
                  <svg
                    width="100"
                    height="40"
                    viewBox="0 0 100 40"
                    className="text-gray-800"
                  >
                    <path
                      d="M5 30 Q15 15 25 25 T40 20 Q45 10 55 25 T75 20 Q85 15 95 28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </section>
            )}

            {/* Start Verification Link */}
            {!workerInfo.isVerified && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => navigate("/support-worker/compliance/verify")}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm"
                >
                  Start Verification
                  <AltArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {/* footer graphics */}
          <div className="absolute bottom-0 left-0 w-full h-12rounded-b-2xl">
            <img className="h-12" src="/new-res/compliance-footer-vector.svg" alt="Footer Graphic" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for info rows
function InfoRow({
  label,
  value,
  valueClassName = "text-gray-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className={`font-semibold text-sm ${valueClassName}`}>{value}</span>
    </div>
  );
}
