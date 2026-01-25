// app/layout.tsx
"use client";
import "@/styles/globals.css";
import "@/styles/index.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-0">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
