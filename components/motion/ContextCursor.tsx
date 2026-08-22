"use client";

import { useEffect, useRef, useState } from "react";

import { damp, MOTION } from "@/lib/motion/physics";
import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";

type CursorMode = "default" | "view" | "explore";

const CURSOR_LABEL: Record<CursorMode, string> = {
  default: "",
  view: "View ↗",
  explore: "Explore →",
};

function readCursorMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default";
  const value = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
  return value === "view" || value === "explore" ? value : "default";
}

export function ContextCursor() {
  const profile = useInteractionProfile();
  const cursorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [mode, setMode] = useState<CursorMode>("default");

  useEffect(() => {
    if (!profile.ready || profile.pointer !== "fine" || profile.reducedMotion) return;

    document.documentElement.dataset.customCursor = "active";

    const tick = (time: number) => {
      const delta = Math.min(0.05, (time - lastTimeRef.current) / 1000 || 1 / 60);
      lastTimeRef.current = time;
      const current = currentRef.current;
      const target = targetRef.current;

      current.x = damp(current.x, target.x, MOTION.damping.cursor, delta);
      current.y = damp(current.y, target.y, MOTION.damping.cursor, delta);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      }

      const distance = Math.abs(target.x - current.x) + Math.abs(target.y - current.y);
      frameRef.current = distance > 0.1 ? requestAnimationFrame(tick) : null;
    };

    const move = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      if (!frameRef.current) {
        lastTimeRef.current = performance.now();
        frameRef.current = requestAnimationFrame(tick);
      }
      cursorRef.current?.setAttribute("data-active", "true");
    };

    const over = (event: PointerEvent) => setMode(readCursorMode(event.target));
    const leave = () => cursorRef.current?.setAttribute("data-active", "false");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      delete document.documentElement.dataset.customCursor;
    };
  }, [profile.pointer, profile.ready, profile.reducedMotion]);

  if (!profile.ready || profile.pointer !== "fine" || profile.reducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      className="context-cursor"
      data-mode={mode}
      data-active="false"
      aria-hidden="true"
    >
      <span>{CURSOR_LABEL[mode]}</span>
    </div>
  );
}
