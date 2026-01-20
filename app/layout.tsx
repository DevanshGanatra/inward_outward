import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Sidebar from "./components/Sidebar";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Inward-Outward Management System",
  description: "A digital logbook for organizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased text-slate-900`}>
        <div className="flex min-h-screen bg-white">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden bg-[#fafafa]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
