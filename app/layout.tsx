import type { Metadata } from "next";
import { ContextCursor } from "@/components/motion/ContextCursor";
import { SceneThemeController } from "@/components/motion/SceneThemeController";
import "./globals.css";
import "./motion.css";
import "./site.css";

export const metadata: Metadata = {
  title: {
    default: "BM Visuals — Digital Experience Division of BM",
    template: "%s — BM Visuals",
  },
  description:
    "BM Visuals is the digital experience division of BM, crafting brand websites, ecommerce and distinctive digital experiences.",
  metadataBase: new URL("https://bmvisuals.example.com"),
  openGraph: {
    title: "BM Visuals — Digital Experience Division of BM",
    description:
      "BM Visuals is the digital experience division of BM, crafting brand websites, ecommerce and distinctive digital experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground flex flex-col">
        <SceneThemeController />
        {children}
        <ContextCursor />
      </body>
    </html>
  );
}
