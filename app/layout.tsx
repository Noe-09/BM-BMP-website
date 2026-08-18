import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BM Visuals — Independent Digital Studio",
    template: "%s — BM Visuals",
  },
  description:
    "Independent digital studio crafting brand websites, ecommerce and digital experiences built around ambitious brands.",
  metadataBase: new URL("https://bmvisuals.example.com"),
  openGraph: {
    title: "BM Visuals — Independent Digital Studio",
    description:
      "Independent digital studio crafting brand websites, ecommerce and digital experiences built around ambitious brands.",
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
        {children}
      </body>
    </html>
  );
}
