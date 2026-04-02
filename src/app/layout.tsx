import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akshay Kumar Studios | Halifax Fine Art Photography",
  description: "A boutique photography and film studio specializing in high-end editorial storytelling and maritime heritage documentation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${manrope.variable} antialiased`}
    >
      <body className="bg-surface text-on-surface">
        <Navbar />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
