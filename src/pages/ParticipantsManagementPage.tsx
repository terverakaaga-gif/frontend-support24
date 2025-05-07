import { ParticipantsList } from "@/components/admin/ParticipantsManagement";

export default function ParticipantsManagementPage() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Participants Management</h1>
          <p className="text-muted-foreground">Manage all participants</p>
        </div>
      </div>

      <ParticipantsList />
    </div>
  );
}