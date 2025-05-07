import { ParticipantsList } from "@/components/admin/ParticipantsManagement";
import { SupportWorkersList } from "@/components/admin/SupportWorkersManagement";

export default function SupportWorkersManagementPage() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Worker Management</h1>
          <p className="text-muted-foreground">Manage all support workers</p>
        </div>
      </div>

      <SupportWorkersList />
    </div>
  );
}