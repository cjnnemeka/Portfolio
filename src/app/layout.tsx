import type { Metadata } from "next";
import { displayFont, bodyFont, monoFont } from "@/styles/fonts";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Michael Ihenacho — Product Designer",
  description: "Product Designer who builds. I ship AI-powered SaaS products from concept to production. EU citizen, available for opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
