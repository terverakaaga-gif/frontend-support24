import AdminsList from "@/components/admin/AdminManagement";

export default function AdminsManagementPage() {
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold">Admin Management</h1>
          <p className="text-muted-foreground">Manage all admin</p>
        </div>
      </div>

      <AdminsList />
    </div>
  );
}