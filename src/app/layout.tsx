import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { PROFILE } from "@/config/profile";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${PROFILE.name} — Full Stack Engineer | AI Engineer | System Architect`,
  description: PROFILE.supportingStatement,
  keywords: [
    "Full Stack Engineer",
    "AI Engineer",
    "System Architect",
    "Agentic AI",
    "RAG",
    "LangGraph",
    "Spring Boot",
    "Next.js",
    "TypeScript",
    "Distributed Systems",
    "Kubernetes",
    "Cloud-Native Architecture",
  ],
  openGraph: {
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description: PROFILE.supportingStatement,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description: PROFILE.supportingStatement,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#07080D",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} bg-[#07080D] text-[#F5F7FF] antialiased selection:bg-[#5B8CFF]/30 selection:text-[#F5F7FF]`}
      >
        {children}
      </body>
    </html>
  );
}
