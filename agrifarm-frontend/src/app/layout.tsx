import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriFarmAssistant | Enterprise Agriculture, Fisheries & Poultry OS",
  description:
    "Autonomous Precision Agriculture, Fisheries and Poultry Operating System validated by ICAR-CIFA and ICAR-CARI protocols.",
  icons: {
    icon: "/picandvideo/logo.png",
    apple: "/picandvideo/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F5132",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col font-sans selection:bg-emerald-500 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
