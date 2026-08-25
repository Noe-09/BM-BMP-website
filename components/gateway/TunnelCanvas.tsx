"use client";

import { useEffect, useRef } from "react";

import type { GatewayPose } from "@/lib/gateway/choreography";
import {
  createGatewayScene,
  type GatewaySceneController,
} from "@/lib/gateway/scene";

type TunnelCanvasProps = {
  pose: GatewayPose;
  coarsePointer: boolean;
  onReady(): void;
  onFailure(): void;
};

export function TunnelCanvas({
  pose,
  coarsePointer,
  onReady,
  onFailure,
}: TunnelCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<GatewaySceneController | null>(null);
  const poseRef = useRef(pose);
  const coarsePointerRef = useRef(coarsePointer);
  const readyRef = useRef(onReady);
  const failureRef = useRef(onFailure);
  const restartRef = useRef<() => void>(() => undefined);
  const resizeRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    readyRef.current = onReady;
    failureRef.current = onFailure;
  }, [onFailure, onReady]);

  useEffect(() => {
    poseRef.current = pose;
    controllerRef.current?.setTarget(pose);
    restartRef.current();
  }, [pose]);

  useEffect(() => {
    coarsePointerRef.current = coarsePointer;
    resizeRef.current();
  }, [coarsePointer]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let controller: GatewaySceneController;
    try {
      controller = createGatewayScene(canvas);
    } catch {
      failureRef.current();
      return;
    }

    controllerRef.current = controller;
    controller.setTarget(poseRef.current);

    let frame = 0;
    let disposed = false;
    let previousTime = performance.now();

    const resize = () => {
      if (disposed) return;
      const { width, height } = host.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        coarsePointerRef.current ? 1.25 : 1.5,
      );
      controller.resize(width, height, dpr);
    };

    const runFrame = (time: number) => {
      frame = 0;
      if (disposed || document.hidden) return;

      const deltaSeconds = Math.min(
        0.05,
        Math.max(0, (time - previousTime) / 1000),
      );
      previousTime = time;
      controller.tick(deltaSeconds);
      controller.render();
      // Continuous animation loop for living matter subtle breathing & pulsation
      frame = requestAnimationFrame(runFrame);
    };

    const restart = () => {
      if (disposed || document.hidden || frame) return;
      previousTime = performance.now();
      frame = requestAnimationFrame(runFrame);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        return;
      }

      // Hidden duration never contributes to the next damping delta.
      previousTime = performance.now();
      if (!frame) frame = requestAnimationFrame(runFrame);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (disposed || coarsePointerRef.current) return;
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const normX = (event.clientX / width) * 2 - 1;
      const normY = -(event.clientY / height) * 2 + 1;
      controller.setPointer?.(normX, normY);
    };

    resizeRef.current = resize;
    restartRef.current = restart;
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    resize();
    restart();
    readyRef.current();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeRef.current = () => undefined;
      restartRef.current = () => undefined;
      controllerRef.current = null;
      controller.dispose();
    };
  }, []);

  return (
    <div className="gateway-tunnel" ref={hostRef}>
      <canvas
        aria-hidden="true"
        className="gateway-tunnel__canvas"
        ref={canvasRef}
        tabIndex={-1}
      />
    </div>
  );
}
