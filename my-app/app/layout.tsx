import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import "./globals.css";
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
      </body>
    </html>
  );
}
