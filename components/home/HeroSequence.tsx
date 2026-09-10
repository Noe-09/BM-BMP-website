"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import { clamp01, getSceneProgress } from "@/lib/motion/physics";
import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((module) => module.HeroCanvas),
  { ssr: false },
);

type HeroSequenceProps = {
  headline: string;
  supportingCopy: string;
  action: {
    label: string;
    href: string;
  };
};

export function HeroSequence({
  headline,
  supportingCopy,
  action,
}: HeroSequenceProps) {
  const heroRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const profile = useInteractionProfile();
  const [canvasReady, setCanvasReady] = useState(false);
  const headlineWords = headline.trim().split(/\s+/);
  const headlineLines = [
    headlineWords.slice(0, 2).join(" "),
    headlineWords.slice(2, -1).join(" "),
    headlineWords.at(-1) ?? "",
  ];

  const handleCanvasReady = useCallback(() => setCanvasReady(true), []);
  const handleCanvasUnavailable = useCallback(() => setCanvasReady(false), []);

  useEffect(() => {
    const hero = heroRef.current;
    const manifesto = manifestoRef.current;
    if (!hero || !manifesto || !profile.ready) return;

    if (profile.reducedMotion) {
      hero.style.setProperty("--hero-progress", "0");
      manifesto.style.setProperty("--manifesto-progress", "1");
      return;
    }

    let previousScrollY = window.scrollY;

    const update = () => {
      frameRef.current = null;
      const viewportHeight = window.innerHeight;
      const heroRect = hero.getBoundingClientRect();
      const manifestoRect = manifesto.getBoundingClientRect();
      const heroProgress = getSceneProgress({
        top: heroRect.top,
        height: heroRect.height,
        viewportHeight,
      });
      const manifestoProgress = clamp01(
        (viewportHeight * 0.82 - manifestoRect.top) / (viewportHeight * 0.62),
      );
      const velocity = Math.max(-1, Math.min(1, (window.scrollY - previousScrollY) / 48));

      previousScrollY = window.scrollY;
      hero.style.setProperty("--hero-progress", heroProgress.toFixed(4));
      hero.style.setProperty("--hero-velocity", velocity.toFixed(4));
      hero.style.setProperty("--hero-shift", `${(-heroProgress * 10).toFixed(3)}vh`);
      hero.style.setProperty(
        "--hero-opacity",
        Math.max(0, 1 - heroProgress * 1.28).toFixed(4),
      );
      hero.style.setProperty("--fallback-shift", `${(-heroProgress * 72).toFixed(2)}px`);
      hero.style.setProperty("--thread-scale", Math.max(0.001, heroProgress).toFixed(4));
      hero.style.setProperty(
        "--object-opacity",
        Math.max(0.24, 1 - heroProgress * 0.76).toFixed(4),
      );
      hero.style.setProperty(
        "--hero-wipe",
        `${(clamp01((heroProgress - 0.55) / 0.45) * 100).toFixed(3)}%`,
      );
      manifesto.style.setProperty("--manifesto-progress", manifestoProgress.toFixed(4));
      manifesto.style.setProperty(
        "--manifesto-shift",
        `${((1 - manifestoProgress) * 105).toFixed(3)}%`,
      );
      manifesto.style.setProperty("--manifesto-opacity", manifestoProgress.toFixed(4));
    };

    const schedule = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [profile.ready, profile.reducedMotion]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !profile.allowPointerDepth) return;

    const move = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / Math.min(rect.height, window.innerHeight)) * 2 - 1;
      const normalizedX = Math.max(-1, Math.min(1, x));
      const normalizedY = Math.max(-1, Math.min(1, y));
      hero.style.setProperty("--pointer-x", normalizedX.toFixed(4));
      hero.style.setProperty("--pointer-y", normalizedY.toFixed(4));
      hero.style.setProperty("--pointer-title-x", `${(normalizedX * 7).toFixed(2)}px`);
      hero.style.setProperty("--pointer-title-y", `${(normalizedY * 5).toFixed(2)}px`);
    };

    const reset = () => {
      hero.style.setProperty("--pointer-x", "0");
      hero.style.setProperty("--pointer-y", "0");
      hero.style.setProperty("--pointer-title-x", "0px");
      hero.style.setProperty("--pointer-title-y", "0px");
    };

    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
    };
  }, [profile.allowPointerDepth]);

  return (
    <div
      className="flagship-sequence"
      data-bm-visual-section="hero"
      data-motion-ready={profile.ready && !profile.reducedMotion ? "true" : undefined}
    >
      <section
        ref={heroRef}
        className="flagship-hero"
        data-hero-root
        data-scene-theme="paper"
        data-cursor="explore"
        aria-labelledby="flagship-hero-title"
      >
        <div className="flagship-hero__sticky">
          <div className="flagship-hero__field" aria-hidden="true">
            <span className="flagship-hero__axis flagship-hero__axis--x" />
            <span className="flagship-hero__axis flagship-hero__axis--y" />
            <span className="flagship-hero__coordinate">BMP / BM Visual</span>
          </div>

          <div
            className="flagship-hero__object"
            data-canvas-ready={canvasReady ? "true" : "false"}
            aria-hidden="true"
          >
            <div className="flagship-hero__fallback">
              <span className="flagship-hero__fold flagship-hero__fold--one" />
              <span className="flagship-hero__fold flagship-hero__fold--two" />
              <span className="flagship-hero__fold flagship-hero__fold--three" />
            </div>
            {profile.ready && !profile.reducedMotion ? (
              <HeroCanvas
                allowAmbientMotion={profile.allowAmbientMotion}
                allowPointerDepth={profile.allowPointerDepth}
                onReady={handleCanvasReady}
                onUnavailable={handleCanvasUnavailable}
              />
            ) : null}
          </div>

          <Container className="flagship-hero__content">
            <div className="flagship-hero__topline">
              <span>Creative and visual division of BMP</span>
              <span>Brand / Presence / Motion</span>
            </div>

            <h1 id="flagship-hero-title" className="flagship-hero__title">
              <span className="bm-visually-hidden">{headline}</span>
              <span className="flagship-hero__line flagship-hero__line--one">
                <span aria-hidden="true">{headlineLines[0]}</span>
              </span>
              <span className="flagship-hero__line flagship-hero__line--two">
                <span aria-hidden="true">{headlineLines[1]}</span>
              </span>
              <span className="flagship-hero__line flagship-hero__line--three">
                <span aria-hidden="true">{headlineLines[2]}</span>
              </span>
            </h1>

            <div className="flagship-hero__footer bm-grid">
              <p className="flagship-hero__copy">{supportingCopy}</p>
              <div className="flagship-hero__actions">
                <a href="#work" className="flagship-link" data-cursor="view">
                  View Selected Work <span aria-hidden>↓</span>
                </a>
                <Link href={action.href} className="flagship-link" data-cursor="view">
                  {action.label} <span aria-hidden>↗</span>
                </Link>
              </div>
            </div>

            <div className="flagship-hero__scroll-cue" aria-hidden="true">
              <span>Scroll to unfold</span>
              <i />
            </div>
          </Container>

          <div className="flagship-hero__exit-thread" aria-hidden="true" />
        </div>
      </section>

      <section
        ref={manifestoRef}
        className="flagship-manifesto"
        data-scene-theme="graphite"
        aria-labelledby="flagship-manifesto-title"
      >
        <Container className="flagship-manifesto__inner">
          <div className="flagship-manifesto__meta">
            <span>01 / Point of view</span>
            <span>Strategy before style</span>
          </div>
          <h2 id="flagship-manifesto-title" className="flagship-manifesto__title">
            <span className="flagship-manifesto__mask">
              <span>We don&apos;t decorate</span>
            </span>
            <span className="flagship-manifesto__mask flagship-manifesto__mask--offset">
              <span>digital spaces.</span>
            </span>
            <span className="flagship-manifesto__mask flagship-manifesto__mask--accent">
              <span>We build visual systems</span>
            </span>
            <span className="flagship-manifesto__mask">
              <span>people notice.</span>
            </span>
          </h2>
          <p className="flagship-manifesto__note">
            Art direction, content systems and lightweight motion—composed as one clearer presence.
          </p>
        </Container>
      </section>
    </div>
  );
}
