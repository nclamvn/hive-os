import type { Metadata } from "next";

import { FocusModality } from "@/components/focus-modality";
import { PreferencesProvider } from "@/components/preferences/preferences-provider";
import { getLocale } from "@/i18n/server";

import "./globals.css";
import "./fonts.css";

// The same retained font bytes and subset CSS, now deterministic offline.
// Keep the preceding next/font latin/Vietnamese preload selection (eight files).
const fontPreloads = [
  "/fonts/hive/inter-latin.woff2",
  "/fonts/hive/inter-vietnamese.woff2",
  "/fonts/hive/ibm-plex-mono-400-latin.woff2",
  "/fonts/hive/ibm-plex-mono-400-vietnamese.woff2",
  "/fonts/hive/ibm-plex-mono-500-latin.woff2",
  "/fonts/hive/ibm-plex-mono-500-vietnamese.woff2",
  "/fonts/hive/ibm-plex-mono-600-latin.woff2",
  "/fonts/hive/ibm-plex-mono-600-vietnamese.woff2",
];

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
      className="font-interface-variable font-utility-variable h-full antialiased"
    >
      <head>
        {fontPreloads.map(href=><link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous"/>)}
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <PreferencesProvider initialLocale={locale}>
          <FocusModality />
          {children}
        </PreferencesProvider>
      </body>
    </html>
  );
}
