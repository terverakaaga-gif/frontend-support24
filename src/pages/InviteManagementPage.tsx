import { InviteManagement } from "@/components/admin/InviteManagement";

export default function InviteManagementPage() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold">Invitation Management</h1>
          <p className="text-muted-foreground">Manage connection requests between participants and support workers</p>
        </div>
      </div>

      <InviteManagement />
    </div>
  );
}