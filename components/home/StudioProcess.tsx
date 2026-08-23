"use client";

import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import { PROCESS_STEPS, getProcessStepIndex } from "@/lib/home/ending";
import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";
import { getViewportSceneProgress } from "@/lib/work/interaction";

export function StudioProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const profile = useInteractionProfile();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !profile.ready || !profile.allowAmbientMotion) return;

    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      if (!visible) return;
      const rect = section.getBoundingClientRect();
      const progress = getViewportSceneProgress({
        top: rect.top,
        height: rect.height,
        viewportHeight: window.innerHeight,
      });
      setActiveIndex(getProcessStepIndex(progress, PROCESS_STEPS.length));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
    });

    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [profile.allowAmbientMotion, profile.ready]);

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="studio-process bm-rule"
      data-scene-theme="studio"
      aria-labelledby="studio-title"
    >
      <Container>
        <div className="studio-process__intro">
          <p className="section-label">BM Visuals / Studio</p>
          <div>
            <h2 id="studio-title">A digital experience<br /><span>division of BM.</span></h2>
            <p className="studio-process__across">We work across</p>
            <ul className="studio-disciplines" aria-label="Studio disciplines">
              <li>Design</li>
              <li>Interaction</li>
              <li>Commerce</li>
              <li>Creative development</li>
            </ul>
          </div>
        </div>

        <div className="studio-process__body">
          <ol className="process-list">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.number} data-active={index === activeIndex}>
                <button type="button" onFocus={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)}>
                  <span>{step.number}</span>
                  <strong>{step.title}</strong>
                  <small>{step.detail}</small>
                </button>
              </li>
            ))}
          </ol>

          <aside className="studio-principles" aria-label="Working principles">
            <p className="section-label">Operating principles</p>
            <div>
              <h3>Strategy before style</h3>
              <p>Design should serve the brand and experience.</p>
            </div>
            <div>
              <h3>Motion with purpose</h3>
              <p>Interaction should improve meaning and experience, not simply increase animation count.</p>
            </div>
            <div>
              <h3>Craft in every state</h3>
              <p>Desktop, mobile, hover, loading and transition states are all designed.</p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
