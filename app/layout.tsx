import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AgentConfigProvider } from "@/components/AgentConfigProvider";

export const metadata: Metadata = {
  title: "AI Command Center",
  description: "AI Agent Task Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-void">
        {/* Minimal background layer */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 circuit-bg opacity-20" />
        </div>

        {/* Main content */}
        <div className="relative flex flex-col h-screen z-10">
          <AgentConfigProvider>
            <Navbar />
            <main className="flex-1 overflow-hidden">{children}</main>
          </AgentConfigProvider>
        </div>
      </body>
    </html>
  );
}
