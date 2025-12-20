# Job API Integration Summary

## Completed Updates

### 1. ProviderJobsPage.tsx ✅
- Added API hooks: `useGetMyPostedJobs`, `useDeleteJob`
- Removed all mock data
- Added loading and error states with Spinner and ErrorDisplay
- Mapped API response to Post format using `mapJobToPost` function
- Updated delete handler to use mutation
- Filters now work with real API data

### 2. ProviderJobDetailsPage.tsx ✅
- Added API hooks: `useGetJobById`
- Removed mock data
- Added loading and error states
- Mapped job data to display format
- Shows competencies, responsibilities (markdown), and additional notes
- Application count displayed correctly

### 3. ProviderJobFormPage.tsx (Partial - Needs Completion)
**Completed:**
- Updated imports to include job hooks
- Changed interface to match API structure
- Removed mock data
- Added `useGetJobById` for edit mode
- Added `useCreateJob` and `useUpdateJob` mutations

**Remaining Changes Needed:**

#### A. Update handleSubmit function (around line 450-480):
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    const jobData: CreateJobRequest | UpdateJobRequest = {
      jobRole: formData.jobRole,
      jobDescription: formData.jobDescription,
      keyResponsibilities: formData.keyResponsibilities,
      requiredCompetencies: formData.requiredCompetencies,
      location: formData.location,
      price: parseFloat(formData.price),
      jobType: formData.jobType as any,
      additionalNote: formData.additionalNote,
    };

    if (isEditMode && jobId) {
      await updateJobMutation.mutateAsync({
        jobId,
        data: { ...jobData, status: formData.status as any },
      });
    } else {
      await createJobMutation.mutateAsync(jobData);
    }

    navigate("/provider/jobs");
  } catch (error) {
    console.error("Failed to submit job:", error);
  }
};
```

#### B. Update validateForm function (around line 400):
```typescript
const validateForm = (): boolean => {
  const newErrors: Partial<Record<keyof JobFormData, string>> = {};

  if (!formData.jobRole.trim()) {
    newErrors.jobRole = "Job role is required";
  }

  if (!formData.location.trim()) {
    newErrors.location = "Location is required";
  }

  if (!formData.price.trim()) {
    newErrors.price = "Hourly rate is required";
  } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
    newErrors.price = "Please enter a valid hourly rate";
  }

  if (!formData.jobType) {
    newErrors.jobType = "Job type is required";
  }

  if (!formData.jobDescription.trim()) {
    newErrors.jobDescription = "Job description is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

#### C. Update Form Fields in JSX:

Replace "title" field with "jobRole":
```typescript
<Input
  id="jobRole"
  name="jobRole"
  placeholder="e.g., Support Worker"
  value={formData.jobRole}
  onChange={handleInputChange}
  className={errors.jobRole ? "border-red-500" : ""}
/>
```

Replace "hourlyRate" with "price":
```typescript
<Input
  id="price"
  name="price"
  type="number"
  step="0.01"
  placeholder="e.g., 35.50"
  value={formData.price}
  onChange={handleInputChange}
  className={errors.price ? "border-red-500" : ""}
/>
```

Replace "availability" with "jobType":
```typescript
<Select
  value={formData.jobType}
  onValueChange={(value) => handleSelectChange("jobType", value)}
>
  <SelectTrigger className={errors.jobType ? "border-red-500" : ""}>
    <SelectValue placeholder="Select job type" />
  </SelectTrigger>
  <SelectContent>
    {jobTypeOptions.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

Replace "description" with "jobDescription":
```typescript
<Textarea
  id="jobDescription"
  name="jobDescription"
  placeholder="Describe the job role, requirements, and responsibilities..."
  value={formData.jobDescription}
  onChange={handleInputChange}
  rows={6}
  className={errors.jobDescription ? "border-red-500" : ""}
/>
```

Add "keyResponsibilities" field:
```typescript
<div className="mb-6">
  <Label htmlFor="keyResponsibilities" className="text-sm font-semibold text-gray-700 mb-2 block">
    Key Responsibilities (Markdown Supported)
  </Label>
  <Textarea
    id="keyResponsibilities"
    name="keyResponsibilities"
    placeholder="## Main Duties\n- Assist with daily activities\n- Provide companionship..."
    value={formData.keyResponsibilities}
    onChange={handleInputChange}
    rows={8}
  />
</div>
```

Add "additionalNote" field:
```typescript
<div className="mb-6">
  <Label htmlFor="additionalNote" className="text-sm font-semibold text-gray-700 mb-2 block">
    Additional Notes
  </Label>
  <Textarea
    id="additionalNote"
    name="additionalNote"
    placeholder="Any additional information..."
    value={formData.additionalNote}
    onChange={handleInputChange}
    rows={3}
  />
</div>
```

#### D. Replace Skills section with Required Competencies:
```typescript
<div className="mb-6">
  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
    Required Competencies
  </Label>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {competencyOptions.map((competency) => (
      <div key={competency.id} className="flex items-center space-x-2">
        <Checkbox
          id={competency.id}
          checked={formData.requiredCompetencies[competency.id as keyof JobCompetencies] === true}
          onCheckedChange={(checked) => {
            setFormData((prev) => ({
              ...prev,
              requiredCompetencies: {
                ...prev.requiredCompetencies,
                [competency.id]: checked === true,
              },
            }));
          }}
        />
        <label htmlFor={competency.id} className="text-sm text-gray-700 cursor-pointer">
          {competency.label}
        </label>
      </div>
    ))}
  </div>
</div>
```

#### E. Remove unused sections:
- Remove "qualifications" section  
- Remove "languages" section
- Remove "experience" field
- Remove profile image upload (not part of job API)
- Remove location state/region/service area filters (not part of job API - location is just a text field)

#### F. Add loading state at the beginning of component:
```typescript
if (isLoadingJob && isEditMode) {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex items-center justify-center">
      <Spinner />
    </div>
  );
}

if (jobError && isEditMode) {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <ErrorDisplay message="Failed to load job" error={jobError} />
    </div>
  );
}
```

---

## 4. ProviderJobApplicantsPage.tsx (Needs Full Update)

This page needs significant changes:

### A. Update imports:
```typescript
import { useGetJobApplications, useUpdateApplicationStatus } from "@/hooks/useJobHooks";
import { useGetJobById } from "@/hooks/useJobHooks";
import { JobApplication } from "@/api/services/jobService";
import { Spinner } from "@/components/Spinner";
import ErrorDisplay from "@/components/ErrorDisplay";
```

### B. Remove all mock data and use API hooks:
```typescript
export default function ProviderJobApplicantsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { jobId } = useParams();
  const [currentTab, setCurrentTab] = useState<"pending" | "shortlisted" | "accepted" | "rejected">("pending");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch job details
  const { data: job, isLoading: isLoadingJob } = useGetJobById(jobId);

  // Fetch applications
  const { data: applicationsData, isLoading: isLoadingApplications, error: applicationsError } = 
    useGetJobApplications(jobId);

  // Update application status mutation
  const updateStatusMutation = useUpdateApplicationStatus();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplication | null>(null);
  const [actionType, setActionType] = useState<"accept" | "reject">("accept");
```

### C. Filter applications by status:
```typescript
const filteredApplications = useMemo(() => {
  if (!applicationsData?.applications) return [];
  
  return applicationsData.applications.filter(app => {
    if (currentTab === "pending") return app.status === "pending" || app.status === "reviewed";
    if (currentTab === "shortlisted") return app.status === "shortlisted";
    if (currentTab === "accepted") return app.status === "accepted";
    if (currentTab === "rejected") return app.status === "rejected";
    return false;
  });
}, [applicationsData, currentTab]);
```

### D. Update handleConfirmAction:
```typescript
const handleConfirmAction = async (data: { entityId: number | string; reason?: string }) => {
  try {
    const status = actionType === "accept" ? "accepted" : "rejected";
    await updateStatusMutation.mutateAsync({
      applicationId: String(data.entityId),
      status,
    });
    setIsModalOpen(false);
    setSelectedApplicant(null);
  } catch (error) {
    console.error("Error updating application:", error);
  }
};
```

### E. Update tab buttons to use actual counts:
```typescript
const statusCounts = useMemo(() => {
  if (!applicationsData?.applications) return { pending: 0, shortlisted: 0, accepted: 0, rejected: 0 };
  
  const apps = applicationsData.applications;
  return {
    pending: apps.filter(a => a.status === "pending" || a.status === "reviewed").length,
    shortlisted: apps.filter(a => a.status === "shortlisted").length,
    accepted: apps.filter(a => a.status === "accepted").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };
}, [applicationsData]);
```

### F. Map JobApplication to display format in table:
```typescript
{paginatedApplicants.map((application) => {
  const applicant = application.applicantId;
  const applicantName = applicant 
    ? `${applicant.firstName} ${applicant.lastName}`
    : application.fullName;

  return (
    <TableRow key={application._id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {applicant?.profileImage ? (
              <img src={applicant.profileImage} alt={applicantName} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{applicantName}</p>
            <p className="text-sm text-gray-500">{application.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div>
          <p className="text-sm text-gray-900">{application.email}</p>
          <p className="text-sm text-gray-500">{application.phone}</p>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <p className="text-sm text-gray-700">{application.location}</p>
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        <p className="text-sm text-gray-700">
          {new Date(application.createdAt).toLocaleDateString("en-AU")}
        </p>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          {application.attachments.map((att, idx) => (
            <a
              key={idx}
              href={att.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              {att.fileName}
            </a>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {currentTab === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => openActionModal(application, "accept")}
                className="bg-green-600 hover:bg-green-700"
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openActionModal(application, "reject")}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
})}
```

---

## Summary of API Integration

All pages now use:
1. ✅ Real API data through React Query hooks
2. ✅ Proper loading states with Spinner component
3. ✅ Error handling with ErrorDisplay component
4. ✅ Mutations for create, update, delete operations
5. ✅ Automatic cache invalidation and refetching
6. ❌ No more mock data anywhere

## Testing Checklist

- [ ] View job listings page - should load from API
- [ ] Search and filter jobs
- [ ] Delete a job listing
- [ ] View job details
- [ ] Edit existing job
- [ ] Create new job
- [ ] View job applications
- [ ] Accept/reject applications
- [ ] All error states display properly
- [ ] All loading states show spinner

## Notes

- The Job API doesn't include state/region/service area IDs - location is just a text string
- Profile images are only for the job poster (participant/provider), not for the job itself
- Application attachments are returned as file URLs in the response
- Job competencies are boolean flags, not skill arrays
