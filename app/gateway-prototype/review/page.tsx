import { notFound } from "next/navigation";
import { GatewaySceneReview } from "@/components/gateway/GatewaySceneReview";
import "../gateway.css";

export default function GatewayReviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <GatewaySceneReview />;
}
