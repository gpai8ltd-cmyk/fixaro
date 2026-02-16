import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { OrganizationJsonLd, LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fixaro.bg';

export const metadata: Metadata = {
  title: {
    default: "Fixaro - Онлайн магазин за инструменти | Бърза доставка в България",
    template: "%s | Fixaro",
  },
  description: "Купи електроинструменти и ръчни инструменти онлайн от Fixaro. Винтоверти, бормашини, ъглошлайфи, циркуляри на достъпни цени. Безплатна доставка над 100 €. Наложен платеж. Гаранция 2 години.",
  keywords: [
    // Общи
    "онлайн магазин за инструменти",
    "инструменти онлайн",
    "купи инструменти онлайн",
    "електроинструменти и ръчни инструменти",
    "магазин за инструменти България",
    // По категории
    "електроинструменти онлайн",
    "професионални електроинструменти",
    "ръчни инструменти купи",
    "градински инструменти",
    "авто инструменти",
    "измервателни уреди",
    // Long-tail
    "къртач 2400w цена",
    "ъглошлайф 1200w",
    "звездогаечни ключове комплект",
    "професионален къртач с патронник",
    "безплатна доставка инструменти над 100 лева",
    "инструменти с гаранция 2 години",
    "строителни инструменти онлайн България",
    "инструменти за майстори",
    "градински инструменти косачки тримери",
    "лазерни нивелири цена",
    // Локални
    "инструменти София",
    "електроинструменти Пловдив",
    "къде да купя инструменти България",
    "доставка на инструменти цяла България",
    // Транзакционни
    "купи електроинструменти",
    "поръчай инструменти онлайн",
    "инструменти с наложен платеж",
    "промоции инструменти",
    "намаления на електроинструменти до 40%",
    // Информационни
    "как да избера бормашина",
    "най-добрите електроинструменти за дома",
    "какво е нужно за работилница",
    "професионални инструменти за строителство",
    "Fixaro",
  ],
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixaro - Онлайн магазин за инструменти",
    description: "Електроинструменти и ръчни инструменти на достъпни цени. Бърза доставка с Еконт и Спиди в цяла България.",
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
        {/* Meta Pixel */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1250887987007295');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1250887987007295&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {children}
        <Analytics />
      </body>
    </html>
  );
}
