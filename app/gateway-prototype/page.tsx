import type { Metadata } from "next";
import { GatewayFallback } from "@/components/gateway/GatewayFallback";
import "./gateway.css";

export const metadata: Metadata = {
  title: "BM Gateway Prototype",
  description: "Prototype gateway between BM Visuals and BMP Technical.",
  robots: { index: false, follow: false },
};

export default function GatewayPrototypePage() {
  return <GatewayFallback />;
}
