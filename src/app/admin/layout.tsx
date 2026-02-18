import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/queries/admin";
import { AdminSidebar } from "./_components/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard - PerfectGhar.in",
  description: "Manage properties and inquiries",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login?redirect=/admin");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar user={admin} />
      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
