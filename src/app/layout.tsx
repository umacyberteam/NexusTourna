import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Nexus Tournament — Bikin & Ikut Turnamen",
  description:
    "Daftar turnamen resmi, iseng-iseng, sampai berhadiah — semua dalam satu papan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8 pb-20">{children}</main>
        <footer className="fixed bottom-0 inset-x-0 z-50 bg-[#3a3a3a] text-white/80 text-xs text-center py-2.5">
          © 2026 DevRulzz Copyright Reserved
        </footer>
      </body>
    </html>
  );
}
