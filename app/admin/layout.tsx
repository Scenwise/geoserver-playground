import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from './_components/admin-sidebar';
import React from 'react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={{ '--sidebar-width': '20rem' } as React.CSSProperties}
    >
      <AdminSidebar />

      <main className="grow">{children}</main>
    </SidebarProvider>
  );
}
