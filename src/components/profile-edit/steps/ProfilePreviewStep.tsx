import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPoint, Mailbox, Phone, Calendar } from "@solar-icons/react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ProfilePreviewStepProps {
  formData: any;
  isParticipant: boolean;
}

export const ProfilePreviewStep: React.FC<ProfilePreviewStepProps> = React.memo(
  ({ formData, isParticipant }) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Current Profile</h2>
            <p className="text-sm text-gray-600">
              Review your current information before making changes
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">First Name</p>
                <p className="font-semibold">
                  {formData.firstName || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Name</p>
                <p className="font-semibold">
                  {formData.lastName || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold flex items-center gap-2">
                  <Mailbox className="w-4 h-4 text-gray-500" />
                  {formData.email || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {formData.phone || "Not set"}
                </p>
              </div>
              {formData.dateOfBirth && (
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {format(new Date(formData.dateOfBirth), "MMM dd, yyyy")}
                  </p>
                </div>
              )}
              {formData.gender && (
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-semibold">{formData.gender}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPoint className="w-5 h-5 text-primary" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">
              {formData.address || "No address provided"}
            </p>
          </CardContent>
        </Card>

        {/* Participant Specific */}
        {isParticipant && (
          <>
            {formData.ndisNumber && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">NDIS Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">NDIS Number</p>
                    <p className="font-semibold">{formData.ndisNumber}</p>
                  </div>
                  {formData.planManaged !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Plan Type</p>
                      <Badge
                        variant={formData.planManaged ? "default" : "secondary"}
                      >
                        {formData.planManaged ? "Plan Managed" : "Self Managed"}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {formData.emergencyContact && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">
                      {formData.emergencyContact.name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Relationship</p>
                    <p className="font-semibold">
                      {formData.emergencyContact.relationship || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">
                      {formData.emergencyContact.phone || "Not set"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Support Worker Specific */}
        {!isParticipant && (
          <>
            {formData.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Professional Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{formData.bio}</p>
                </CardContent>
              </Card>
            )}

            {formData.skills && formData.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {formData.languages && formData.languages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((lang: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800">
            Click <span className="font-semibold">Next</span> to start editing
            your profile information step by step.
          </p>
        </div>
      </div>
    );
  }
);
