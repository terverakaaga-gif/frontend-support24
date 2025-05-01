// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { SupportWorkerSetup } from "@/components/auth/SupportWorkerSetup";
// import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner";

// export default function SupportWorkerSetupPage() {
//   const navigate = useNavigate();
//   const { user, completeOnboarding } = useAuth();

//   useEffect(() => {
//     // If no user is logged in, redirect to login
//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     // If user is not a support worker, redirect to their dashboard
//     if (user.role !== 'support-worker') {
//       redirectToDashboard(user.role);
//       return;
//     }

//     // If support worker has already completed onboarding, redirect to their dashboard
//     if (user.isOnboarded) {
//       navigate('/support-worker');
//       return;
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, navigate]);

//   const handleSetupComplete = () => {
//     if (!user) return;
    
//     completeOnboarding();
//     toast.success('Profile setup completed successfully!');
//     navigate('/support-worker');
//   };

//   const redirectToDashboard = (role: string) => {
//     switch (role) {
//       case 'admin':
//         navigate('/admin');
//         break;
//       case 'guardian':
//         navigate('/guardian');
//         break;
//       case 'participant':
//         navigate('/participant');
//         break;
//       case 'support-worker':
//         navigate('/support-worker');
//         break;
//       default:
//         navigate('/');
//     }
//   };

//   // Only render the setup component if user is a support worker who needs setup
//   if (!user || user.role !== 'support-worker' || user.isOnboarded) {
//     return null; // Return null during the redirect, the useEffect will handle navigation
//   }

//   return (
//     <div className="w-full">
//       <SupportWorkerSetup onComplete={handleSetupComplete} />
//     </div>
//   );
// }