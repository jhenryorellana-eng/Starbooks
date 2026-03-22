import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Starbooks — Aprende viviendo cada libro",
    template: "%s | Starbooks",
  },
  description:
    "La primera plataforma multimodal que convierte libros de crecimiento personal en aventuras de aprendizaje inmersivas de 7 pasos.",
  keywords: [
    "starbooks",
    "aprendizaje",
    "libros",
    "crecimiento personal",
    "micro-learning",
    "starbiz academy",
  ],
  authors: [{ name: "Starbiz Academy" }],
  openGraph: {
    title: "Starbooks — Aprende viviendo cada libro",
    description:
      "La primera plataforma multimodal que convierte libros de crecimiento personal en aventuras de aprendizaje inmersivas.",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1117",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <div className="grain" />
        <Navbar />
        <main>{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
