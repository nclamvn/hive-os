import type { Metadata } from "next";
import { Be_Vietnam_Pro, IBM_Plex_Mono, Literata } from "next/font/google";
import Script from "next/script";

import { FocusModality } from "@/components/focus-modality";
import { PreferencesProvider } from "@/components/preferences/preferences-provider";
import { getLocale } from "@/i18n/server";

import "./globals.css";

const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

const display = Literata({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
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

const appearanceBootstrap = `
(() => {
  try {
    const preference = localStorage.getItem("hive-appearance") || "system";
    const resolved = preference === "system"
      ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : preference;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  } catch (_) {}
})();
`;

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
      className={`${body.variable} ${display.variable} ${utility.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="appearance-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: appearanceBootstrap }}
        />
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
