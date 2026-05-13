import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Credex | AI Spend Audit",
    template: "%s | Credex",
  },
  description: "Stop paying for redundant AI. Identify wasted spend and right-size your stack in 2 minutes.",
  openGraph: {
    title: "Credex | Stop Overpaying for AI",
    description: "Identify wasted AI spend, right-size seats, and get wholesale pricing.",
    url: "https://credex.com",
    siteName: "Credex",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased scroll-smooth dark`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
