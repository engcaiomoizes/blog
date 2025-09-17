import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Menu from "@/components/menu";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog - Caio Moizés Santos",
  description: "Blog de Caio Moizés Santos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} antialiased`}
      >
        <Menu />
        {children}
      </body>
    </html>
  );
}
