import type { Metadata } from "next";
import { displayFont, bodyFont, monoFont } from "@/styles/fonts";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cj Nnemeka — Product Designer",
  description: "Senior product designer for AI-native SaaS. I use AI tooling to take the products I design all the way to production. Available for opportunities.",
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
