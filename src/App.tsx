import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
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
import { TimesheetManagement } from "./components/admin/TimesheetsManagement";
import { TimesheetDetail } from "./components/admin/TimesheetDetail";
import ApartmentRentalUI from "./components/admin/ApartmentRenntalUI";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Helper to redirect to the appropriate dashboard based on user role
  const getDefaultRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'guardian':
        return '/guardian';
      case 'participant':
        return '/participant';
      case 'supportWorker':
        return '/support-worker';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        user ? <Navigate to={getDefaultRoute()} replace /> : <Login />
      } />
      
      <Route path="/register" element={
        user && user.isEmailVerified 
          ? <Navigate to={getDefaultRoute()} replace /> 
          : <Register />
      } />
      
      {/* Setup Choice Page - for newly registered support workers */}
      <Route path="/setup-choice" element={
        !user ? <Navigate to="/login" replace /> :
        user.role !== 'supportWorker' ? <Navigate to={getDefaultRoute()} replace /> :
        // user.isOnboarded ? <Navigate to="/support-worker" replace /> :
        (user as SupportWorker).verificationStatus?.profileSetupComplete ? <Navigate to="/support-worker" replace /> :
        <SetupChoicePage />
      } />
      
      {/* Support Worker Setup Route - accessible but not mandatory */}
      <Route path="/support-worker-setup" element={
        !user ? <Navigate to="/login" replace /> :
        user.role !== 'supportWorker' ? <Navigate to={getDefaultRoute()} replace /> :
        <SupportWorkerSetupPage />
      } />
      
      {/* Protected routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/invites" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <InviteManagementPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/invites/:inviteId/details" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <InviteDetailsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/invites/:inviteId/confirm" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <InviteConfirmationPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/rate-time-band" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <RateTimeBandManagementPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/rate-time-band/create" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <RateTimeBandForm />
        </ProtectedRoute>
      } />

      <Route path="/admin/rate-time-band/:id/view" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <RateTimeBandDetailsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/rate-time-band/:id/edit" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <RateTimeBandForm />
        </ProtectedRoute>
      } />

      <Route path="/admin/participants" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <ParticipantsManagementPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/support-workers" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <SupportWorkersManagementPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/shifts" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <ShiftsManagement />
        </ProtectedRoute>
      } />

      <Route path="/admin/shifts/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <ShiftDetailView />
        </ProtectedRoute>
      } />

      <Route path="/admin/timesheets" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <TimesheetManagement />
        </ProtectedRoute>
      } />

      <Route path="/admin/timesheets/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <TimesheetDetail />
        </ProtectedRoute>
      } />

      <Route path="/admin/chat/:workerId" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Navbar />
          <AdminChat />
        </ProtectedRoute>
      } />

      <Route path="/guardian" element={
        <ProtectedRoute allowedRoles={['guardian', 'admin']}>
          <Navbar />
          <GuardianDashboard />
        </ProtectedRoute>
      } />

      <Route path="/participant" element={
        <ProtectedRoute allowedRoles={['participant', 'admin']}>
          <Navbar />
          <ParticipantDashboard />
        </ProtectedRoute>
      } />

      <Route path="/support-worker" element={
        <ProtectedRoute allowedRoles={['supportWorker', 'admin']}>
          <Navbar />
          <SupportWorkerDashboard />
        </ProtectedRoute>
      } />

      {/* Shift management routes */}
      <Route path="/support-worker/shifts" element={
        <ProtectedRoute allowedRoles={['supportWorker', 'admin']}>
          <Navbar />
          <ShiftsPage />
        </ProtectedRoute>
      } />

      <Route path="/support-worker/shifts/:shiftId" element={
        <ProtectedRoute allowedRoles={['supportWorker', 'admin']}>
          <Navbar />
          <ShiftDetails />
        </ProtectedRoute>
      } />

      {/* Profile routes */}
      <Route path="/participant/profile" element={
        <ProtectedRoute allowedRoles={['participant', 'admin']}>
          <Navbar />
          <ParticipantProfile />
        </ProtectedRoute>
      } />

      <Route path="/support-worker/profile" element={
        <ProtectedRoute allowedRoles={['supportWorker', 'admin']}>
          <Navbar />
          <SupportWorkerProfile />
        </ProtectedRoute>
      } />
      
      {/* Support worker profile view for participants */}
      <Route path="/support-worker/profile/:workerId" element={
        <ProtectedRoute allowedRoles={['participant', 'guardian', 'admin']}>
          <Navbar />
          <SupportWorkerProfile />
        </ProtectedRoute>
      } />

      {/* Default route */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;