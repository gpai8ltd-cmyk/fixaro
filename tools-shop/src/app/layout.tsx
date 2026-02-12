import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OrganizationJsonLd, LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixaro.bg';

export const metadata: Metadata = {
  title: {
    default: "Fixaro - Качествени инструменти на достъпни цени",
    template: "%s | Fixaro",
  },
  description: "Fixaro - онлайн магазин за инструменти. Електроинструменти, ръчни инструменти, винтоверти, бормашини, ъглошлайфи, циркуляри и аксесоари на достъпни цени. Бърза доставка с Еконт и Спиди. Наложен платеж.",
  keywords: ["инструменти", "електроинструменти", "ръчни инструменти", "винтоверт", "бормашина", "ъглошлайф", "циркуляр", "онлайн магазин инструменти", "магазин за инструменти", "купи инструменти", "инструменти онлайн", "евтини инструменти", "професионални инструменти", "инструменти София", "инструменти България", "Fixaro"],
  authors: [{ name: "Fixaro" }],
  creator: "Fixaro",
  publisher: "Fixaro",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      "bg-BG": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: siteUrl,
    siteName: "Fixaro",
    title: "Fixaro - Онлайн магазин за инструменти | Електроинструменти и ръчни инструменти",
    description: "Fixaro - онлайн магазин за инструменти. Електроинструменти, ръчни инструменти, винтоверти, бормашини и аксесоари на достъпни цени. Бърза доставка в цяла България.",
    images: [
      {
        url: "/images/logo-icon.jpeg",
        width: 512,
        height: 512,
        alt: "Fixaro - Онлайн магазин за инструменти",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixaro - Онлайн магазин за инструменти",
    description: "Електроинструменти и ръчни инструменти на достъпни цени. Бърза доставка с Еконт и Спиди в цяла България.",
    images: ["/images/logo-icon.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/logo-icon.jpeg", type: "image/jpeg" },
    ],
    apple: "/images/logo-icon.jpeg",
    shortcut: "/images/logo-icon.jpeg",
  },
  verification: {
    google: "AsM_4v2ZCeAntq3XklrBmmcsL9ZWNawchXmRP3D_EfM",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <head>
        <OrganizationJsonLd />
        <LocalBusinessJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
