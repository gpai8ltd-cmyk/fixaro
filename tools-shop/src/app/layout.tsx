import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolsshop.bg';

export const metadata: Metadata = {
  title: {
    default: "ToolsShop - Качествени инструменти на достъпни цени",
    template: "%s | ToolsShop",
  },
  description: "Онлайн магазин за електроинструменти и ръчни инструменти. Бърза доставка с Еконт и Спиди. Наложен платеж.",
  keywords: ["инструменти", "електроинструменти", "ръчни инструменти", "винтоверт", "бормашина", "онлайн магазин", "България"],
  authors: [{ name: "ToolsShop" }],
  creator: "ToolsShop",
  publisher: "ToolsShop",
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
    siteName: "ToolsShop",
    title: "ToolsShop - Качествени инструменти на достъпни цени",
    description: "Онлайн магазин за електроинструменти и ръчни инструменти. Бърза доставка с Еконт и Спиди. Наложен платеж.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ToolsShop - Магазин за инструменти",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolsShop - Качествени инструменти на достъпни цени",
    description: "Онлайн магазин за електроинструменти и ръчни инструменти. Бърза доставка в цяла България.",
    images: ["/og-image.jpg"],
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
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
