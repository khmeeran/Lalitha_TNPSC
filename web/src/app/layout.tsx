import type { Metadata, Viewport } from "next";
import { Cinzel, Plus_Jakarta_Sans, Nunito, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import { LearningProvider } from "../context/LearningContext";
import { LanguageProvider } from "../context/LanguageContext";
import { PwaManager } from "../components/pwa/PwaManager";
import { FrictionReporter } from "../components/feedback/FrictionReporter";
import { CleanSlateReset } from "../components/debug/CleanSlateReset";

const cinzel = Cinzel({
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cinzel",
});

const jakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const nunito = Nunito({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

const notoTamil = Noto_Sans_Tamil({
  weight: ["400", "600", "700"],
  subsets: ["tamil", "latin"],
  display: "swap",
  variable: "--font-tamil",
});

export const metadata: Metadata = {
  title: "TNPSC Wizard — High-Fantasy Educational RPG",
  description: "High-Fantasy Educational RPG for TNPSC civil service aspirants with Lalitha and Velan.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TNPSC Wizard",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6A0DAD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${jakarta.variable} ${nunito.variable} ${notoTamil.variable} h-full`}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TNPSC Wizard" />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased text-[#FFF8DC] bg-[#0F0320] selection:bg-[#6A0DAD] selection:text-[#FFD700] overflow-x-hidden">
        <LanguageProvider>
          <LearningProvider>
            {children}
            <PwaManager />
            <FrictionReporter />
            <CleanSlateReset />
          </LearningProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
