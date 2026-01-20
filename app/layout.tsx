import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { TelegramThemeSync } from "@/components/telegram/telegram-theme-sync";
import { SafeAreaProvider } from "@/components/shared/safe-area-provider";
import { Header } from "@/components/shared/header";
import { BottomNav } from "@/components/shared/bottom-nav";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Goose AI - AI Assistant in Telegram",
  description: "Chat with AI models powered by Groq LLaMA 3.3 70B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${raleway.variable} dark`} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <TelegramProvider>
          <TelegramThemeSync />
          <SafeAreaProvider>
            <Header />
            <main className="flex flex-1 flex-col min-h-0">
              {children}
            </main>
            <BottomNav />
          </SafeAreaProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
