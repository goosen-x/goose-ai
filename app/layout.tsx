import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { TelegramThemeSync } from "@/components/telegram/telegram-theme-sync";
import { ErudaDebugger } from "@/components/shared/eruda-debugger";

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
  description: "Chat with AI models powered by Cocoon Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={raleway.variable}>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErudaDebugger />
        <TelegramProvider>
          <TelegramThemeSync />
          <main className="min-h-screen">{children}</main>
        </TelegramProvider>
      </body>
    </html>
  );
}
