import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CloseCircle,
  Star,
  MapPoint,
  MoneyBag,
  CheckCircle,
  CloseSquare,
  DangerCircle,
} from "@solar-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkerDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: any;
}

export function WorkerDetailsModal({
  open,
  onOpenChange,
  worker,
}: WorkerDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("description");

  if (!worker) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-montserrat-bold">
              Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <CloseCircle className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Profile Header */}
          <div className="text-center mb-6">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={worker.avatar || undefined} />
              <AvatarFallback className="bg-red-100 text-red-700 font-montserrat-bold text-2xl">
                GL
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-2xl font-montserrat-bold text-gray-900">
                Grace Lemmy
              </h2>
              <Badge className="bg-green-100 text-green-700 text-xs font-montserrat-semibold">
                Active
              </Badge>
            </div>
            <p className="text-gray-600 font-montserrat mb-2">
              +61 0000 0000 | gracelemmey@gmail.com
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-orange-500" />
                <span>4.5</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPoint className="h-4 w-4" />
                <span>42 km</span>
              </div>
              <div className="flex items-center gap-1">
                <MoneyBag className="h-4 w-4" />
                <span>$40</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="services">Services & Pricing</TabsTrigger>
              <TabsTrigger value="location">Location & Coverage</TabsTrigger>
              <TabsTrigger value="compliance">Compliance & Credentials</TabsTrigger>
              <TabsTrigger value="ratings">Ratings & Reviews</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="space-y-6">
              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-3">
                  About
                </h3>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  Grace Lemmy is a support worker delivering person-centered disability support
                  and community access services. We aim to increase independence, wellbeing, and
                  community participation through practical, respectful, culturally safe supports
                  tailored to each participant's goals.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-3">
                  Years of Experience
                </h3>
                <p className="text-gray-700 font-montserrat">10 years</p>
              </div>

              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-3">
                  Specializations
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700 font-montserrat">
                    <span className="mt-1">•</span>
                    <span>Supported Independent Living (SIL) transition & tenancy support</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 font-montserrat">
                    <span className="mt-1">•</span>
                    <span>Personal care and daily living assistance</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 font-montserrat">
                    <span className="mt-1">•</span>
                    <span>Community participation & social inclusion programs</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-3">
                  Language Spoken
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700 font-montserrat">
                    <span className="mt-1">•</span>
                    <span>English</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 font-montserrat">
                    <span className="mt-1">•</span>
                    <span>French</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 font-montserrat">
                    <span className="mt-1">•</span>
                    <span>Spanish</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-3">
                  Cultural Competencies
                </h3>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  Indigenous cultural awareness training completed; trauma-informed care;
                  disability-inclusive cultural liaison services; staff with lived experience and
                  multicultural support workers available on request.
                </p>
              </div>
            </TabsContent>

            {/* Services & Pricing Tab */}
            <TabsContent value="services">
              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                  Lists of Services and Pricing
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      service: "Personal Care (Assistance with showering, dressing, mobility)",
                      price: "$55/hr",
                    },
                    {
                      service: "Core — Community Access / Social Support",
                      price: "$55/hr",
                    },
                    {
                      service: "Supported Independent Living (SIL) – overnight staffing",
                      price: "$55/hr",
                    },
                    {
                      service: "Assistance (cleaning, meal prep",
                      price: "$55/hr",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="text-gray-700 font-montserrat">{item.service}</span>
                      <span className="font-montserrat-semibold text-gray-900">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Location & Coverage Tab */}
            <TabsContent value="location" className="space-y-6">
              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-3">
                  New South Wales
                </h3>
                <ul className="space-y-2">
                  {["Hunter Region", "Central Coast", "Blue Mountain", "Central West"].map(
                    (region) => (
                      <li key={region} className="text-gray-700 font-montserrat">
                        {region}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-3">Victoria</h3>
                <ul className="space-y-2">
                  {[
                    "Melbourne",
                    "Geelong & Surf Coast",
                    "Ballarat Region",
                    "Gippsland (Traralgon Sale)",
                    "Mornington Peninsula",
                  ].map((region) => (
                    <li key={region} className="text-gray-700 font-montserrat">
                      {region}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Compliance & Credentials Tab */}
            <TabsContent value="compliance" className="space-y-6">
              {[
                {
                  title: "NDIS Registration Type",
                  value: "Registered Provider",
                  status: "success",
                },
                {
                  title: "NDIS Registration Number",
                  value: "1234 0873533",
                  status: "success",
                },
                {
                  title: "Registration Expiry Date",
                  value: "23/5/2025",
                  status: "warning",
                },
                {
                  title: "Worker Screening Check",
                  value: "Police Check",
                  status: "success",
                },
                {
                  title: "Screening Expiry Date",
                  value: "23/6/2026",
                  status: "success",
                },
                {
                  title: "Insurance Details",
                  value: "Public Liability Insurance",
                  status: "success",
                },
                {
                  title: "Insurance Expiry Date",
                  value: "1/10/2025",
                  status: "error",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-montserrat-bold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-700 font-montserrat">{item.value}</p>
                  </div>
                  {item.status === "success" && (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  )}
                  {item.status === "warning" && (
                    <DangerCircle className="h-6 w-6 text-orange-500 mt-1" />
                  )}
                  {item.status === "error" && (
                    <CloseSquare className="h-6 w-6 text-red-600 mt-1" />
                  )}
                </div>
              ))}

              <div>
                <h4 className="font-montserrat-bold text-gray-900 mb-2 flex items-center gap-2">
                  Qualifications
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </h4>
                <ul className="space-y-1">
                  <li className="text-gray-700 font-montserrat">CPR Certificate</li>
                  <li className="text-gray-700 font-montserrat">First Aid Certificate</li>
                </ul>
              </div>
            </TabsContent>

            {/* Ratings & Reviews Tab */}
            <TabsContent value="ratings" className="space-y-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Overall Rating */}
                <div>
                  <div className="text-5xl font-montserrat-bold text-gray-900 mb-2">
                    4.8
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-5 w-5 text-orange-500 fill-orange-500" />
                    ))}
                    <Star className="h-5 w-5 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-600 font-montserrat">4,981 reviews</p>
                </div>

                {/* Rating Breakdown */}
                <div className="col-span-2 space-y-2">
                  {[
                    { stars: 5, percentage: 70 },
                    { stars: 4, percentage: 60 },
                    { stars: 3, percentage: 20 },
                    { stars: 2, percentage: 10 },
                    { stars: 1, percentage: 5 },
                  ].map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <Star className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-montserrat">{item.stars}</span>
                      </div>
                      <Progress value={item.percentage} className="flex-1 h-2" />
                      <span className="text-sm text-gray-600 w-12">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">Reviews</h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "Joy Samuel",
                      role: "Participant",
                      date: "24 Sept, 2025 | 10:00am",
                      rating: 4,
                      comment:
                        "The providers are friendly and they respect my privacy, overall good staffing",
                    },
                    {
                      name: "Joy Samuel",
                      role: "Participant",
                      date: "24 Sept, 2025 | 10:00am",
                      rating: 4,
                      comment:
                        "The providers are friendly and they respect my privacy, overall good staffing",
                    },
                    {
                      name: "Joy Samuel",
                      role: "Support Coordinator",
                      date: "24 Sept, 2025 | 10:00am",
                      rating: 4,
                      comment:
                        "The providers are friendly and they respect my privacy, overall good staffing",
                    },
                  ].map((review, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-red-100 text-red-700 font-montserrat-semibold">
                              JS
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-montserrat-semibold text-gray-900">
                                {review.name}
                              </p>
                              <div className="flex items-center gap-0.5">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 text-orange-500 fill-orange-500"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 font-montserrat">
                              {review.role}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                      <p className="text-gray-700 font-montserrat">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* My Experience Tab would be shown separately if needed */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-3">
                  Private Note
                </h3>
                <p className="text-gray-700 font-montserrat leading-relaxed">
                  I've worked with Hope Care Service Limited before, and it was a really positive
                  experience. Their team made it easy to make referrals and followed through
                  effectively with every participant I assigned to them. They maintained good
                  communication and ensured participants were supported smoothly throughout their
                  plans.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                  Current Participants
                </h3>
                <div className="space-y-3">
                  {["Sarah Reyes", "Sarah Reyes", "Sarah Reyes"].map((name, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
                          SR
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-montserrat-semibold text-gray-900">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

