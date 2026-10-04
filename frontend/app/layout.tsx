import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Motion } from "@/components/Motion";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ScamShield — Before you click, check it.",
  description: "ScamShield uses AI to analyze suspicious messages and explain the warning signs in plain language.",
};
export const viewport: Viewport = { themeColor: "#050a1c", width: "device-width", initialScale: 1 };

const themeScript = `try{var t=localStorage.getItem('ss-theme');if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){document.documentElement.classList.add('dark')}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="grain min-h-dvh antialiased">
        <ThemeProvider><AuthProvider><Motion>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg">Skip to content</a>
          <Background />
          <Navbar />
          <main id="main" className="relative z-10 min-h-dvh pt-24">{children}</main>
          <Footer />
        </Motion></AuthProvider></ThemeProvider>
      </body>
    </html>
  );
}
