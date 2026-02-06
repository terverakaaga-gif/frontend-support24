import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bookmark } from "lucide-react";
import { ApplyJobModal } from "./ApplyJobModal";

// Extended mock data for jobs with full detail content
const mockJobs = [
  {
    id: 1,
    title: "Support Worker",
    company: "Stream Healthcare",
    location: "Albion Park, AU",
    payRate: "$50/hr",
    jobType: "Full-time",
    isEarlyApplicant: true,
    description: "Opportunities for ongoing training and professional development......",
    postedDate: "19th Nov, 2025",
    icon: "S",
    iconColor: "bg-green-500",
    aboutUs:
      "Stream Healthcare is a leading provider of mental health and community support services. Our mission is to empower individuals and families through compassionate, evidence-based care. We specialize in youth mental health, disability support, and community outreach programs.",
    qualifications: [
      "Minimum Certificate IV or Diploma in Youth Work, Community Services, Social Work, or a related field.",
      "Experience working with young people aged 12-25 in a mental health, community, or support setting.",
      "Knowledge of trauma-informed and strength-based approaches to care.",
      "Current First Aid Certificate, Working With Children Check, and National Police Clearance (or willingness to obtain).",
    ],
    tasks: [
      "Providing one-on-one and group support to young people.",
      "Developing and implementing individual support plans.",
      "Facilitating recreational, educational, and wellbeing activities.",
      "Collaborating with families, schools, and community organizations.",
      "Maintaining accurate case notes and documentation.",
      "Responding effectively to crisis situations.",
    ],
    benefits: [
      "Competitive salary with superannuation and penalty rates.",
      "Flexible working hours and supportive team environment.",
      "Access to ongoing training and career development opportunities.",
      "Opportunity to make a real impact in the lives of young people.",
      "Employee assistance program (EAP) and wellbeing support services.",
    ],
  },
  {
    id: 2,
    title: "Support Worker",
    company: "Stream Healthcare",
    location: "Albion Park, AU",
    payRate: "$50/hr",
    jobType: "Full-time",
    isEarlyApplicant: true,
    description: "Opportunities for ongoing training and professional development......",
    postedDate: "19th Nov, 2025",
    icon: "S",
    iconColor: "bg-green-500",
    aboutUs:
      "Stream Healthcare is a leading provider of mental health and community support services. Our mission is to empower individuals and families through compassionate, evidence-based care.",
    qualifications: [
      "Minimum Certificate IV or Diploma in Youth Work, Community Services, or related field.",
      "Experience working with young people in a support setting.",
      "Current First Aid and WWCC.",
    ],
    tasks: [
      "Providing one-on-one and group support.",
      "Developing and implementing support plans.",
      "Collaborating with families and community organizations.",
    ],
    benefits: [
      "Competitive salary with superannuation.",
      "Flexible working hours.",
      "Ongoing training and development.",
    ],
  },
  {
    id: 3,
    title: "Support Worker",
    company: "Stream Healthcare",
    location: "Albion Park, AU",
    payRate: "$50/hr",
    jobType: "Full-time",
    isEarlyApplicant: true,
    description: "Opportunities for ongoing training and professional development......",
    postedDate: "19th Nov, 2025",
    icon: "S",
    iconColor: "bg-green-500",
    aboutUs:
      "Stream Healthcare is a leading provider of mental health and community support services.",
    qualifications: ["Certificate IV or Diploma in relevant field.", "First Aid and WWCC."],
    tasks: ["One-on-one and group support.", "Support plans and documentation."],
    benefits: ["Competitive salary.", "Training and development."],
  },
  {
    id: 4,
    title: "Support Worker",
    company: "Stream Healthcare",
    location: "Albion Park, AU",
    payRate: "$50/hr",
    jobType: "Full-time",
    isEarlyApplicant: true,
    description: "Opportunities for ongoing training and professional development......",
    postedDate: "19th Nov, 2025",
    icon: "S",
    iconColor: "bg-green-500",
    aboutUs: "Stream Healthcare provides mental health and community support services.",
    qualifications: ["Relevant qualification.", "First Aid and checks."],
    tasks: ["Support delivery.", "Documentation."],
    benefits: ["Salary and super.", "Development opportunities."],
  },
  {
    id: 5,
    title: "Support Worker",
    company: "Stream Healthcare",
    location: "Albion Park, AU",
    payRate: "$50/hr",
    jobType: "Full-time",
    isEarlyApplicant: true,
    description: "Opportunities for ongoing training and professional development......",
    postedDate: "19th Nov, 2025",
    icon: "S",
    iconColor: "bg-green-500",
    aboutUs: "Stream Healthcare - mental health and community support.",
    qualifications: ["Certificate IV or equivalent.", "WWCC and Police Check."],
    tasks: ["Support to young people.", "Case notes."],
    benefits: ["Competitive pay.", "EAP support."],
  },
  {
    id: 6,
    title: "Support Worker",
    company: "Stream Healthcare",
    location: "Albion Park, AU",
    payRate: "$50/hr",
    jobType: "Full-time",
    isEarlyApplicant: true,
    description: "Opportunities for ongoing training and professional development......",
    postedDate: "19th Nov, 2025",
    icon: "S",
    iconColor: "bg-green-500",
    aboutUs: "Stream Healthcare - empowering individuals through care.",
    qualifications: ["Diploma in Youth Work or related.", "First Aid, WWCC, Police Clearance."],
    tasks: ["One-on-one and group support.", "Support plans.", "Crisis response."],
    benefits: ["Salary with penalty rates.", "Flexible hours.", "Training.", "EAP."],
  },
];

type Job = (typeof mockJobs)[0];

interface JobListCardProps {
  job: Job;
  isSelected: boolean;
  onSelect: () => void;
}

function JobListCard({ job, isSelected, onSelect }: JobListCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <Card
      className={`overflow-hidden transition-all cursor-pointer border-2 ${
        isSelected ? "border-primary shadow-md ring-2 ring-primary/20" : "border-transparent hover:border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex gap-3">
          <div className="shrink-0">
            <div
              className={`w-12 h-12 ${job.iconColor} rounded-lg flex items-center justify-center text-white font-montserrat-bold text-lg`}
            >
              {job.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-montserrat-semibold text-gray-900">{job.company}</p>
                <p className="text-base font-montserrat-semibold text-gray-900">{job.title}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
                className="shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Bookmark
                  className={`h-5 w-5 ${isBookmarked ? "text-primary fill-primary" : "text-gray-400"}`}
                />
              </button>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{job.location}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.isEarlyApplicant && (
                <Badge className="bg-primary/10 text-primary border-0 text-xs font-montserrat-semibold">
                  Be an early applicant
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs font-montserrat-semibold">
                {job.jobType}
              </Badge>
              <Badge variant="secondary" className="text-xs font-montserrat-semibold">
                {job.payRate}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
            <p className="text-xs text-gray-500 mt-2">Posted on {job.postedDate}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function JobDetailPanel({ job, onApply }: { job: Job; onApply: () => void }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-12 h-12 ${job.iconColor} rounded-lg flex items-center justify-center text-white font-montserrat-bold text-lg shrink-0`}
          >
            {job.icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-montserrat-semibold text-gray-700">{job.company}</p>
            <h2 className="text-xl font-montserrat-bold text-gray-900">{job.title}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {job.isEarlyApplicant && (
            <Badge className="bg-primary/10 text-primary border-0 text-xs font-montserrat-semibold">
              Be an early applicant
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs font-montserrat-semibold">
            {job.jobType}
          </Badge>
          <Badge variant="secondary" className="text-xs font-montserrat-semibold">
            {job.payRate}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={onApply}
            className="bg-primary hover:bg-primary-700 text-white font-montserrat-semibold px-6 py-6 flex-1 sm:flex-none"
          >
            Apply Now
          </Button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Bookmark
              className={`h-5 w-5 ${isBookmarked ? "text-primary fill-primary" : "text-gray-500"}`}
            />
          </button>
        </div>
      </div>
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <section>
          <h3 className="text-base font-montserrat-bold text-gray-900 mb-2">About Us</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{job.aboutUs}</p>
        </section>
        <section>
          <h3 className="text-base font-montserrat-bold text-gray-900 mb-2">
            Qualification and Experience
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {job.qualifications.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-base font-montserrat-bold text-gray-900 mb-2">
            Tasks and Responsibilities
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {job.tasks.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-base font-montserrat-bold text-gray-900 mb-2">Benefits</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {job.benefits.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function OpportunitiesListingSection() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(mockJobs[0] ?? null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  return (
    <section id="opportunities-listings" className="relative py-16 md:py-24 px-4 md:px-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column - Job list */}
          <div className="lg:col-span-5 flex flex-col">
            <p className="text-sm text-gray-600 mb-4 font-montserrat-medium">
              {mockJobs.length} results
            </p>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-20rem)] pr-1">
              {mockJobs.map((job) => (
                <JobListCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onSelect={() => setSelectedJob(job)}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button className="bg-primary hover:bg-primary-700 text-white px-8 py-6 text-base font-montserrat-semibold rounded-xl">
                See More
              </Button>
            </div>
          </div>

          {/* Right column - Job detail */}
          <div className="lg:col-span-7 min-h-[32rem]">
            {selectedJob ? (
              <JobDetailPanel job={selectedJob} onApply={() => setApplyModalOpen(true)} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 h-full min-h-[32rem] flex items-center justify-center text-gray-500 font-montserrat-medium">
                Select a job to view details
              </div>
            )}
          </div>
        </div>
      </div>
      <ApplyJobModal
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        jobTitle={selectedJob?.title}
        companyName={selectedJob?.company}
      />
    </section>
  );
}
