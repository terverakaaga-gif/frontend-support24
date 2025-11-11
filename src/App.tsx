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
import AdminDashboard from "./pages/AdminDashboard";
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
import CreateIncidentPage from "./pages/CreateIncidentPage";
import IncidentDetailsPage from "./pages/IncidentDetailsPage";
import ResolveIncidentPage from "./pages/ResolveIncidentPage";
import ProfileEditForm from "./components/layouts/ProfileEditForm";
import SupportWorkerProfilePreview from "./pages/SupportWorkerProfilePreview";
import SupportWorkerInvite from "./pages/SupportWorkerInvite";
import ParticipantOrganizationDetailsPage from "./pages/ParticipantOrganizationDetailsPage";
import { HowItWorks } from "./pages/HowItWorks";
import ComingSoon from "./pages/coming-soon";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();

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
      <Route
        path="/how-it-works"
        element={<HowItWorks />}
      />
      {/* Coming Soon Page */}
      <Route
        path="/coming-soon"
        element={<ComingSoon />}
      />
      {/* Terms of Use Page */}
      <Route
        path="/terms-of-use"
        element={<TermsOfUse />}
      />
      {/* Privacy Policy Page */}
      <Route
        path="/privacy-policy"
        element={<PrivacyPolicy />}
      />

      {/* Public routes */}
      <Route
        path="/login"
        element={user ? <Navigate to={getDefaultRoute()} replace /> : <Login />}
      />

      <Route
        path="/register"
        element={
          user && user.isEmailVerified ? (
            <Navigate to={getDefaultRoute()} replace />
          ) : (
            <Register />
          )
        }
      />

      {/* Password reset routes */}
      <Route
        path="/forgot-password"
        element={
          user ? (
            <Navigate to={getDefaultRoute()} replace />
          ) : (
            <ForgotPassword />
          )
        }
      />
      <Route
        path="/reset-password"
        element={
          user ? <Navigate to={getDefaultRoute()} replace /> : <ResetPassword />
        }
      />

      {/* Setup Choice Page - for newly registered support workers */}
      <Route
        path="/setup-choice"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.role !== "supportWorker" ? (
            <Navigate to={getDefaultRoute()} replace />
          ) : (user as SupportWorker).verificationStatus
              ?.profileSetupComplete ? (
            <Navigate to="/support-worker" replace />
          ) : (
            <SetupChoicePage />
          )
        }
      />

      {/* Support Worker Setup Route - accessible but not mandatory */}
      <Route
        path="/support-worker-setup"
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

      {/* Protected routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <Routes>
                {/* <Route path="/" element={<AdminDashboard />} /> */}
                <Route path="/" element={<AdminAnalyticsDashboard />} />
                {/* <Route
									path="/analytics"
									element={<AdminAnalyticsDashboard />}
								/> */}
                <Route path="/invites" element={<InviteManagementPage />} />
                <Route
                  path="/invites/:inviteId/details"
                  element={<InviteDetailsPage />}
                />
                <Route
                  path="/invites/:inviteId/confirm"
                  element={<InviteConfirmationPage />}
                />
                <Route
                  path="/rate-time-band"
                  element={<RateTimeBandManagementPage />}
                />
                <Route
                  path="/rate-time-band/create"
                  element={<RateTimeBandForm />}
                />
                <Route
                  path="/rate-time-band/:id/view"
                  element={<RateTimeBandDetailsPage />}
                />
                <Route
                  path="/rate-time-band/:id/edit"
                  element={<RateTimeBandForm />}
                />
                <Route path="/all-admin" element={<AdminsManagementPage />} />
                <Route
                  path="/participants"
                  element={<ParticipantsManagementPage />}
                />
                <Route
                  path="/support-workers"
                  element={<SupportWorkersManagementPage />}
                />
                <Route path="/shifts" element={<ShiftsManagement />} />
                <Route path="/shifts/:id" element={<ShiftDetailView />} />
                <Route path="/timesheets" element={<TimesheetsManagement />} />
                <Route path="/timesheets/:id" element={<TimesheetDetail />} />
                <Route path="/batch-invoices" element={<BatchInvoicesPage />} />
                <Route
                  path="/batch-invoices/:id"
                  element={<BatchInvoiceDetailPage />}
                />
                <Route
                  path="/service-types"
                  element={<ServiceTypesManagementPage />}
                />
                <Route
                  path="/service-types/:id"
                  element={<ServiceTypeDetailPage />}
                />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route
                  path="/incidents/:id/resolve"
                  element={<ResolveIncidentPage />}
                />
                <Route
                  path="/incidents/:id"
                  element={<IncidentDetailsPage />}
                />
                <Route path="/chats" element={<Converations />} />
                <Route path="/chat/:workerId" element={<ChatView />} />
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
                <Route
                  path="/incidents/:id"
                  element={<IncidentDetailsPage />}
                />
                <Route path="/chats" element={<Converations />} />
                <Route path="/chat/:workerId" element={<ChatView />} />
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
                  element={<OrganizationDetailsPage />}
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
                <Route
                  path="/incidents/:id"
                  element={<IncidentDetailsPage />}
                />
                <Route
                  path="/incidents/create"
                  element={<CreateIncidentPage />}
                />
                <Route path="/chats" element={<Converations />} />
                <Route path="/chat/:workerId" element={<ChatView />} />
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
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route
                  path="/incidents/:id"
                  element={<IncidentDetailsPage />}
                />
                <Route
                  path="/incidents/create"
                  element={<CreateIncidentPage />}
                />

                <Route path="/chats" element={<Converations />} />
                <Route path="/chat/:workerId" element={<ChatView />} />
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
