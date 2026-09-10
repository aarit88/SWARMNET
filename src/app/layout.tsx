import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SWARMNET — AI Emergency Response Platform",
  description:
    "Real-time AI swarm coordination system for emergency and disaster response. Autonomous multi-agent platform for incident detection, resource allocation, and public safety.",
  keywords: [
    "emergency response",
    "AI agents",
    "disaster management",
    "swarm intelligence",
    "real-time coordination",
  ],
  authors: [{ name: "SWARMNET Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ background: "var(--surface-base)", color: "var(--text-primary)" }}
      >
        {children}
      </body>
    </html>
  );
}
