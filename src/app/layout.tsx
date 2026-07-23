import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { FocusModality } from "@/components/focus-modality";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HIVE OS",
  description:
    "Provenance-preserving operating system for Human-AI research, engineering, and decision-making.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <FocusModality />
        {children}
      </body>
    </html>
  );
}
