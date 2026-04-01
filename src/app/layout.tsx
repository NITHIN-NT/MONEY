import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});
export const metadata: Metadata = {
  title: "MONEY",
  description: "High-end, private financial management",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MONEY",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2F4F7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

import PWARegistration from "@/components/PWARegistration";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link href="https://fonts.cdnfonts.com/css/conthrax" rel="stylesheet" />
      </head>
      <body className="h-full bg-[#F2F4F7] text-[#0F172A]">
        <PWARegistration />
        {children}
      </body>
    </html>
  );
}
