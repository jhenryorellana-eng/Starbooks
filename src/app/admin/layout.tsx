import { AdminSidebar } from "./AdminSidebar";

export const metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin Starbooks",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 pt-20 lg:pt-6 pb-24 lg:pb-6 px-4 sm:px-6 lg:px-8 lg:ml-64">
        {children}
      </div>
    </div>
  );
}
