import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";

import { FocusModality } from "@/components/focus-modality";
import { PreferencesProvider } from "@/components/preferences/preferences-provider";
import { getLocale } from "@/i18n/server";

import "./globals.css";

const interfaceFont = Inter({
  variable: "--font-interface",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

const utility = IBM_Plex_Mono({
  variable: "--font-utility",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "HIVE OS",
  description:
    "Provenance-preserving operating system for Human-AI research, engineering, and decision-making.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${interfaceFont.variable} ${utility.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <PreferencesProvider initialLocale={locale}>
          <FocusModality />
          {children}
        </PreferencesProvider>
      </body>
    </html>
  );
}
