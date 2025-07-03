import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import AdminChat from "./pages/AdminChat";
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
import AdminsManagementPage from "./pages/AdminsManagementPage";
import OrganizationsPage from "./pages/OrganizationsPage";
import ParticipantOrganizationsPage from "./pages/ParticipantOrganizationsPage";
import OrganizationDetailsPage from "./pages/OrganizationDetailsPage";

import ParticipantTimesheets from "./pages/ParticipantTimesheets";
import ParticipantTimesheetDetails from "./pages/ParticipantTimesheetDetails";
import SupportWorkerTimesheets from "./pages/SupportWorkerTimesheets";
import SupportWorkerTimesheetDetails from "./pages/SupportWorkerTimesheetDetails";
import AdminAnalyticsDashboard from "./pages/AdminAnalyticsDashboard";
import LandingPage from "./pages/LandingPage";


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
        element={user ? <Navigate to={getDefaultRoute()} replace /> : <LandingPage />}
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
                {/* <Route path="/analytics" element={<AdminAnalyticsDashboard />} /> */}
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
                <Route path="/chat/:workerId" element={<AdminChat />} />
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
                <Route path="/timesheets" element={<ParticipantTimesheets />} />
                <Route
                  path="/timesheets/:id"
                  element={<ParticipantTimesheetDetails />}
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
                <Route
                  path="/timesheets"
                  element={<SupportWorkerTimesheets />}
                />
                <Route
                  path="/timesheets/:id"
                  element={<SupportWorkerTimesheetDetails />}
                />
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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
