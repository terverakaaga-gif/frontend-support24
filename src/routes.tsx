import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { Navbar } from './components/Navbar';
import AdminDashboard from '@/pages/AdminDashboard';
import GuardianDashboard from '@/pages/GuardianDashboard';
import ParticipantDashboard from '@/pages/ParticipantDashboard';
import SupportWorkerDashboard from '@/pages/SupportWorkerDashboard';
import ShiftsPage from './pages/ShiftsPage';
import ShiftDetails from './pages/ShiftDetails';
import NotFound from '@/pages/NotFound';

// Define routes with role-based protection
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Navbar />
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/guardian",
    element: (
      <ProtectedRoute allowedRoles={['guardian']}>
        <Navbar />
        <GuardianDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/participant",
    element: (
      <ProtectedRoute allowedRoles={['participant']}>
        <Navbar />
        <ParticipantDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/support-worker",
    element: (
      <ProtectedRoute allowedRoles={['support-worker']}>
        <Navbar />
        <SupportWorkerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}