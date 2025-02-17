import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jacks or Better Video Poker",
  description: "A simple video poker game with Google authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
