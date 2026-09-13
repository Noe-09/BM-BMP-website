import type { Metadata } from "next";
import { GatewayPrototype } from "@/components/gateway/GatewayPrototype";
import "./gateway.css";

export const metadata: Metadata = {
  title: "BM Gateway — Three Worlds",
  description: "Choose between BM Visual, BM Tech, and BMP Creator.",
  robots: { index: false, follow: false },
};

export default function GatewayPrototypePage() {
  return <GatewayPrototype />;
}
