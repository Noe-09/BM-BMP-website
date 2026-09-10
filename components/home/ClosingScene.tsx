"use client";

import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";

import { Container } from "@/components/ui/Container";
import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";

type ClosingSceneProps = {
  action: {
    label: string;
    href: string;
  };
};

export function ClosingScene({ action }: ClosingSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const profile = useInteractionProfile();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !profile.ready || !profile.allowAmbientMotion || profile.allowPointerDepth) return;

    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      if (!visible) return;
      const rect = section.getBoundingClientRect();
      const range = window.innerHeight + rect.height;
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / range));
      section.style.setProperty("--closing-scroll", String(progress));
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) scheduleUpdate();
    });

    observer.observe(section);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [profile.allowAmbientMotion, profile.allowPointerDepth, profile.ready]);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!profile.allowPointerDepth) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--closing-x", `${x * 18}px`);
    event.currentTarget.style.setProperty("--closing-y", `${y * 14}px`);
  };

  return (
    <section
      ref={sectionRef}
      className="closing-scene bm-rule"
      data-bm-visual-section="closing"
      data-scene-theme="closing"
      aria-labelledby="closing-title"
      onPointerMove={handlePointerMove}
    >
      <div className="closing-scene__motif" aria-hidden>
        <i /><i /><i /><i />
      </div>
      <Container className="closing-scene__inner">
        <p className="section-label">BM Visual / Next step</p>
        <h2 id="closing-title"><span>Make the brand</span><span>worth noticing.</span></h2>
        <Link href={action.href} className="closing-scene__link" data-cursor="explore" data-cursor-label="Start →">
          <span>{action.label}</span>
          <i aria-hidden>↗</i>
        </Link>
      </Container>
    </section>
  );
}
