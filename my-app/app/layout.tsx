import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminPanelLayout>{children}</AdminPanelLayout>
        <Toaster />
      </body>
    </html>
  );
}
