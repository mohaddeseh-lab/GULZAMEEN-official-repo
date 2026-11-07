import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gul Zameen - A Living Digital Culture of Balochistan",
  description:
    "Gulzameen is a digital archive and cultural platform dedicated to recording, preserving, and celebrating the oral epics, music, needlework patterns, and recipes of Balochistan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cinzel.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="bg-[#F5E6D3] text-[#1A120E] antialiased selection:bg-[#D4AF37] selection:text-[#2D1E18]">
        {children}
      </body>
    </html>
  );
}