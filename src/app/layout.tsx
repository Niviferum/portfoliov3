import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { DEFAULT_LOCALE, dictionaries } from "@/lib/i18n/dictionary";
import { PROFILE } from "@/lib/profile";
import "./globals.css";

// Polices auto-hébergées par `next/font` : aucun appel à un domaine tiers au
// chargement, donc aucun traceur et une CSP sans `font-src` externe.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Le HTML statique est généré dans la langue par défaut : c'est celle que
// voient les moteurs d'indexation et les générateurs d'aperçus de liens.
const base = dictionaries[DEFAULT_LOCALE];

export const metadata: Metadata = {
  metadataBase: new URL(PROFILE.siteUrl),
  title: base.meta.title,
  description: base.meta.description,
  applicationName: base.shell.orgName,
  authors: [{ name: PROFILE.name, url: PROFILE.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: base.shell.orgName,
    title: base.meta.title,
    description: base.meta.description,
    locale: "fr_FR",
    alternateLocale: ["en_GB"],
  },
  twitter: {
    card: "summary_large_image",
    title: base.meta.title,
    description: base.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
