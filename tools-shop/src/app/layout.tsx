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
  description: "Онлайн магазин за електроинструменти и ръчни инструменти. Бърза доставка с Еконт и Спиди. Наложен платеж.",
  keywords: ["инструменти", "електроинструменти", "ръчни инструменти", "винтоверт", "бормашина", "онлайн магазин", "България"],
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
    title: "Fixaro - Качествени инструменти на достъпни цени",
    description: "Онлайн магазин за електроинструменти и ръчни инструменти. Бърза доставка с Еконт и Спиди. Наложен платеж.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixaro - Качествени инструменти на достъпни цени",
    description: "Онлайн магазин за електроинструменти и ръчни инструменти. Бърза доставка в цяла България.",
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
