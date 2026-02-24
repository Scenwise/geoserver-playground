import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from './_components/admin-sidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <main className="grow">{children}</main>
    </SidebarProvider>
  );
}
