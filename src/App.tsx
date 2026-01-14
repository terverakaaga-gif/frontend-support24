import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SolarProvider } from "@solar-icons/react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SetupChoicePage from "./pages/SetupChoicePage";
import GuardianDashboard from "./pages/GuardianDashboard";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import SupportWorkerDashboard from "./pages/SupportWorkerDashboard";
import SupportWorkerSetupPage from "./pages/SupportWorkerSetupPage";
import ShiftsPage from "./pages/ShiftsPage";
import ShiftDetails from "./pages/ShiftDetails";
import NotFound from "./pages/NotFound";
import ParticipantProfile from "./pages/ParticipantProfile";
import ParticipantShifts from "./pages/ParticipantShifts";
import ParticipantShiftDetails from "./pages/ParticipantShiftDetails";
import SupportWorkerProfile from "./pages/SupportWorkerProfile";
import InviteManagementPage from "./pages/InviteManagementPage";
import ChatView from "./pages/ChatView";
import { SupportWorker } from "./types/user.types";
import ParticipantsManagementPage from "./pages/ParticipantsManagementPage";
import SupportWorkersManagementPage from "./pages/SupportWorkersManagementPage";
import InviteDetailsPage from "./pages/InviteDetailsPage";
import InviteConfirmationPage from "./pages/InviteConfirmationPage";
import RateTimeBandManagementPage from "./pages/RateTimeBandManagementPage";
import { RateTimeBandDetailsPage } from "./components/admin/RateTimeBandDetails";
import { RateTimeBandForm } from "./components/admin/RateTimeBandForm";
import { ShiftDetailView } from "./components/admin/ShiftDetails";
import { ShiftsManagement } from "./components/admin/ShiftsManagement";
import TimesheetsManagement from "./components/admin/TimesheetsManagement";
import TimesheetDetail from "./components/admin/TimesheetDetail";
import BatchInvoicesPage from "./pages/BatchInvoicesPage";
import BatchInvoiceDetailPage from "./pages/BatchInvoiceDetailPage";
import AdminsManagementPage from "./pages/AdminsManagementPage";
import ServiceTypesManagementPage from "./pages/ServiceTypesManagementPage";
import ServiceTypeDetailPage from "./pages/ServiceTypeDetailPage";
import OrganizationsPage from "./pages/OrganizationsPage";
import ParticipantOrganizationsPage from "./pages/ParticipantOrganizationsPage";
import OrganizationDetailsPage from "./pages/OrganizationDetailsPage";

import ParticipantTimesheets from "./pages/ParticipantTimesheets";
import ParticipantTimesheetDetails from "./pages/ParticipantTimesheetDetails";
import SupportWorkerTimesheets from "./pages/SupportWorkerTimesheets";
import SupportWorkerTimesheetDetails from "./pages/SupportWorkerTimesheetDetails";
import AdminAnalyticsDashboard from "./pages/AdminAnalyticsDashboard";

import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Converations from "./pages/Conversations";
import { ChatProvider } from "./contexts/ChatContext";
import IncidentsPage from "./pages/IncidentsPage";
import ProfileEditForm from "./components/layouts/ProfileEditForm";
import SupportWorkerProfilePreview from "./pages/SupportWorkerProfilePreview";
import SupportWorkerInvite from "./pages/SupportWorkerInvite";
import ParticipantOrganizationDetailsPage from "./pages/ParticipantOrganizationDetailsPage";
import { HowItWorks } from "./pages/HowItWorks";
import OTPVerification from "./pages/OTPVerificationPage";
import ComingSoon from "./pages/coming-soon";
import PlatformTerms from "./pages/PlatformTerms";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import IncidentManagementPolicy from "./pages/IncidentManagementPolicy";
import ComplaintsResolutionPolicy from "./pages/ComplaintsResolutionPolicy";
import SupportWorkersSearch from "./pages/SupportWorkersSearch";
import ParticipantSetupPage from "./pages/ParticipantSetupPage";
import ResendEmail from "./pages/ResendEmail";
import ServiceCategoriesManagementPage from "./pages/ServiceCategoriesManagementPage";

import ProviderAccommodationsPage from "./pages/ProviderAccommodationsPage";
import ProviderAccommodationDetailsPage from "./pages/ProviderAccommodationDetailsPage";
import ProviderAccommodationFormPage from "./pages/ProviderAccommodationFormPage";
import ProviderAccommodationInterestedUsersPage from "./pages/ProviderAccommodationInterestedUsersPage";
import ProviderRegisterPage from "./pages/ProviderRegisterPage";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderEventsPage from "./pages/ProviderEventsPage";
import ProviderEventDetailsPage from "./pages/ProviderEventDetailsPage";
import ProviderEventFormPage from "./pages/ProviderEventFormPage";
import ProviderRegisteredEventParticipantsPage from "./pages/ProviderRegisteredEventParticipantsPage";
import ProviderJobsPage from "./pages/ProviderJobsPage";
import ProviderJobDetailsPage from "./pages/ProviderJobDetailsPage";
import ProviderJobFormPage from "./pages/ProviderJobFormPage";
import ProviderJobApplicantsPage from "./pages/ProviderJobApplicantsPage";

import SupportJobListingPage from "./pages/SupportJobListingPage";
import SupportSavedJobsPage from "./pages/SupportSavedJobsPage";
import SupportJobDetailsPage from "./pages/SupportJobDetailsPage";

import ComplianceCheckPage from "./pages/ComplianceCheckPage";
import ComplianceFormPage from "./pages/ComplianceFormPage";

import ParticipantJobsPage from "./pages/ParticipantJobsPage";
import ParticipantJobFormPage from "./pages/ParticipantJobFormPage";
import ParticipantJobApplicantsPage from "./pages/ParticipantJobApplicantsPage";
import ParticipantJobDetailsPage from "./pages/ParticipantJobDetailsPage";
import SupportCoordinatorDashboard from "./pages/SupportCoordinatorDashboard";
import TenderPage from "./pages/TenderPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import ProvidersPage from "./pages/ProvidersPage";
import NotificationsPage from "./pages/NotificationsPage";
import NotificationDetailPage from "./pages/NotificationDetailPage";
import CoordinatorSupportWorkersPage from "./pages/CoordinatorSupportWorkersPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import MyPanelPage from "./pages/MyPanelPage";
import ComparisonPage from "./pages/ComparisonPage";
import DraftPage from "./pages/DraftPage";
// import CoordinatorDashboard from "./pages/CoordinatorDashboard";
// import CoordinatorParticipants from "./pages/CoordinatorParticipants";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  // Helper to redirect to the appropriate dashboard based on user role
  const getDefaultRoute = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "admin":
        return "/admin";
      case "guardian":
        return "/guardian";
      case "participant":
        return "/participant";
      case "supportWorker":
        return "/support-worker";
      case "coordinator":
        return "/support-coordinator";
      case "provider":
        return "/provider";
      default:
        return "/login";
    }
  };

  return (
    <Routes>
      {/* Landing Page - root route */}
      <Route
        path="/"
        element={
          user ? <Navigate to={getDefaultRoute()} replace /> : <LandingPage />
        }
      />

      {/* How It Works Page */}
      <Route path="/how-it-works" element={<HowItWorks />} />
      {/* Coming Soon Page */}
      <Route path="/coming-soon" element={<ComingSoon />} />
      {/* Terms of Use Page */}
      <Route path="/platform-terms" element={<PlatformTerms />} />
      {/* Privacy Policy Page */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      {/* Incident Management Policy Page */}
      <Route
        path="/incident-management-policy"
        element={<IncidentManagementPolicy />}
      />
      {/* Terms of Use Page */}
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      {/* Complaints Resolution Policy Page */}
      <Route
        path="/complaints-resolution-policy"
        element={<ComplaintsResolutionPolicy />}
      />

      {/* Public routes - these handle their own logout logic */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-provider" element={<ProviderRegisterPage />} />
      <Route path="/otp-verify" element={<OTPVerification />} />
      <Route path="/resend-email" element={<ResendEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Setup Choice Page - for newly registered support workers */}
      <Route
        path="/setup-choice"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.role !== "supportWorker" ? (
            <Navigate to={getDefaultRoute()} replace />
          ) : !(user as SupportWorker).verificationStatus
              ?.profileSetupComplete ? (
            <Navigate to="/support-worker" replace />
          ) : (
            <SetupChoicePage />
          )
        }
      />

      {/* Protected routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <Routes>
                {/* <Route path="/" element={<AdminDashboard />} /> */}
                <Route path="" element={<AdminAnalyticsDashboard />} />
                {/* <Route
									path="/analytics"
									element={<AdminAnalyticsDashboard />}
								/> */}
                <Route path="invites" element={<InviteManagementPage />} />
                <Route
                  path="invites/:inviteId/details"
                  element={<InviteDetailsPage />}
                />
                <Route
                  path="invites/:inviteId/confirm"
                  element={<InviteConfirmationPage />}
                />
                <Route
                  path="rate-time-band"
                  element={<RateTimeBandManagementPage />}
                />
                <Route
                  path="rate-time-band/create"
                  element={<RateTimeBandForm />}
                />
                <Route
                  path="rate-time-band/:id/view"
                  element={<RateTimeBandDetailsPage />}
                />
                <Route
                  path="rate-time-band/:id/edit"
                  element={<RateTimeBandForm />}
                />
                <Route path="/all-admin" element={<AdminsManagementPage />} />
                <Route
                  path="participants"
                  element={<ParticipantsManagementPage />}
                />

                <Route
                  path="support-workers"
                  element={<SupportWorkersManagementPage />}
                />
                <Route path="shifts" element={<ShiftsManagement />} />
                <Route path="shifts/:id" element={<ShiftDetailView />} />
                <Route path="timesheets" element={<TimesheetsManagement />} />
                <Route path="timesheets/:id" element={<TimesheetDetail />} />
                <Route path="batch-invoices" element={<BatchInvoicesPage />} />
                <Route
                  path="batch-invoices/:id"
                  element={<BatchInvoiceDetailPage />}
                />
                <Route
                  path="service-categories"
                  element={<ServiceCategoriesManagementPage />}
                />
                <Route
                  path="service-types"
                  element={<ServiceTypesManagementPage />}
                />
                
                <Route
                  path="service-types/:id"
                  element={<ServiceTypeDetailPage />}
                />
                <Route path="incidents" element={<IncidentsPage />} />

                <Route path="chats" element={<Converations />} />
                <Route path="chat/:conversationId" element={<ChatView />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/guardian/*"
        element={
          <ProtectedRoute allowedRoles={["guardian", "admin"]}>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<GuardianDashboard />} />
                <Route path="/incidents" element={<IncidentsPage />} />

                <Route path="/chats" element={<Converations />} />
                <Route path="/chat/:conversationId" element={<ChatView />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/participant/*"
        element={
          <ProtectedRoute allowedRoles={["participant", "admin"]}>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<ParticipantDashboard />} />
                <Route
                  path="/find-support-workers"
                  element={<SupportWorkersSearch />}
                />
                <Route path="/profile" element={<ParticipantProfile />} />
                <Route
                  path="/profile/:id"
                  element={<SupportWorkerProfilePreview />}
                />
                <Route path="/invite/:id" element={<SupportWorkerInvite />} />
                <Route path="/profile/edit" element={<ProfileEditForm />} />
                <Route path="/shifts" element={<ParticipantShifts />} />
                <Route
                  path="/shifts/:shiftId"
                  element={<ParticipantShiftDetails />}
                />
                <Route
                  path="/organizations"
                  element={<ParticipantOrganizationsPage />}
                />
                <Route
                  path="/organizations/:id"
                  element={<ParticipantOrganizationDetailsPage />}
                />

                <Route path="/jobs" element={<ParticipantJobsPage />} />
                <Route path="jobs/:jobId" element={<ParticipantJobDetailsPage />} />
                <Route
                  path="/jobs/:jobId/applicants"
                  element={<ParticipantJobApplicantsPage />}
                />
                <Route
                  path="/jobs/create"
                  element={<ParticipantJobFormPage />}
                />
                <Route
                  path="/jobs/:jobId/edit"
                  element={<ParticipantJobFormPage />}
                />

                {/* <Route
                  path="/organizations/:id"
                  element={<ParticipantOrganizationDetailsPage />}
                /> */}
                <Route path="/timesheets" element={<ParticipantTimesheets />} />
                <Route
                  path="/timesheets/:id"
                  element={<ParticipantTimesheetDetails />}
                />
                <Route path="/incidents" element={<IncidentsPage />} />

                <Route path="/chats" element={<Converations />} />
                <Route path="/chat/:conversationId" element={<ChatView />} />
                {/* Participant Setup Route - accessible (mandatory) */}
                <Route
                  path="/setup"
                  element={
                    !user ? (
                      <Navigate to="/login" replace />
                    ) : user.role !== "participant" ? (
                      <Navigate to={getDefaultRoute()} replace />
                    ) : (
                      <ParticipantSetupPage />
                    )
                  }
                />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/support-worker/*"
        element={
          <ProtectedRoute allowedRoles={["supportWorker", "admin"]}>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<SupportWorkerDashboard />} />
                <Route path="/shifts" element={<ShiftsPage />} />
                <Route path="/shifts/:shiftId" element={<ShiftDetails />} />
                <Route path="/organizations" element={<OrganizationsPage />} />
                <Route
                  path="/organizations/:id"
                  element={<OrganizationDetailsPage />}
                />
                <Route path="/profile" element={<SupportWorkerProfile />} />
                <Route path="/profile/edit" element={<ProfileEditForm />} />
                <Route
                  path="/timesheets"
                  element={<SupportWorkerTimesheets />}
                />
                <Route
                  path="/timesheets/:id"
                  element={<SupportWorkerTimesheetDetails />}
                />
                <Route path="/compliance" element={<ComplianceCheckPage />} />
                <Route
                  path="/compliance/verify"
                  element={<ComplianceFormPage />}
                />
                <Route path="/incidents" element={<IncidentsPage />} />

                <Route path="/chats" element={<Converations />} />
                <Route path="/chat/:conversationId" element={<ChatView />} />
                {/* Support Worker Setup Route - accessible (mandatory) */}
                <Route
                  path="/setup"
                  element={
                    !user ? (
                      <Navigate to="/login" replace />
                    ) : user.role !== "supportWorker" ? (
                      <Navigate to={getDefaultRoute()} replace />
                    ) : (
                      <SupportWorkerSetupPage />
                    )
                  }
                />
                {/* Jobs */}
                <Route path="/jobs" element={<SupportJobListingPage />} />
                <Route
                  path="/jobs/:jobId"
                  element={<SupportJobDetailsPage />}
                />
                <Route path="/saved-jobs" element={<SupportSavedJobsPage />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/coordinator/*"
        element={
          <ProtectedRoute allowedRoles={["coordinator", "admin"]}>
            <DashboardLayout>
              <Routes>
                {/* <Route path="/" element={<CoordinatorDashboard />} />
                <Route path="/participants" element={<CoordinatorParticipants />} /> */}
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/chats" element={<Converations />} />
                <Route path="/chat/:conversationId" element={<ChatView />} />
                {/* Add other coordinator-specific routes */}
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Support Coordinator Routes - Accessible by all roles (temporary) */}
      <Route
        path="/support-coordinator/*"
        element={
          <ProtectedRoute allowedRoles={["admin", "participant", "supportWorker", "guardian", "coordinator", "provider"]}>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<SupportCoordinatorDashboard />} />
                <Route path="/tender" element={<TenderPage />} />
                <Route path="/draft" element={<DraftPage />} />
                <Route path="/participants" element={<ParticipantsPage />} />
                <Route path="/providers" element={<ProvidersPage />} />
                <Route path="/support-workers" element={<CoordinatorSupportWorkersPage />} />
                <Route path="/my-panel" element={<MyPanelPage />} />
                <Route path="/comparison" element={<ComparisonPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/notifications/:id" element={<NotificationDetailPage />} />
                <Route path="/account-settings" element={<AccountSettingsPage />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/chats" element={<Converations />} />
                <Route path="/chat/:conversationId" element={<ChatView />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/*"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<ProviderDashboard />} />
                <Route path="/events" element={<ProviderEventsPage />} />
                <Route
                  path="/events/:eventId/participants"
                  element={<ProviderRegisteredEventParticipantsPage />}
                />
                <Route
                  path="/events/:eventId"
                  element={<ProviderEventDetailsPage />}
                />
                <Route
                  path="/events/:eventId/edit"
                  element={<ProviderEventFormPage />}
                />
                <Route
                  path="/events/create"
                  element={<ProviderEventFormPage />}
                />
                <Route
                  path="/accommodations"
                  element={<ProviderAccommodationsPage />}
                />
                <Route
                  path="/accommodations/create"
                  element={<ProviderAccommodationFormPage />}
                />
                <Route
                  path="/accommodations/:accommodationId"
                  element={<ProviderAccommodationDetailsPage />}
                />
                <Route
                  path="/accommodations/:accommodationId/edit"
                  element={<ProviderAccommodationFormPage />}
                />
                <Route
                  path="/accommodations/:accommodationId/interested"
                  element={<ProviderAccommodationInterestedUsersPage />}
                />
                <Route path="/jobs" element={<ProviderJobsPage />} />
                <Route
                  path="/jobs/:jobId"
                  element={<ProviderJobDetailsPage />}
                />
                <Route
                  path="/jobs/:jobId/applicants"
                  element={<ProviderJobApplicantsPage />}
                />
                <Route
                  path="/jobs/create"
                  element={<ProviderJobFormPage />}
                />
                <Route
                  path="/jobs/:jobId/edit"
                  element={<ProviderJobFormPage />}
                />
                <Route path="/chats" element={<Converations />} />
                <Route path="/chat/:conversationId" element={<ChatView />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <SolarProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <ChatProvider>
                <AppRoutes />
              </ChatProvider>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </SolarProvider>
  );
}
