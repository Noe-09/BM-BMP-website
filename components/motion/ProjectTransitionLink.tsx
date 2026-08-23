"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";
import { shouldEnhanceProjectNavigation } from "@/lib/work/interaction";

type ProjectTransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  projectSlug: string;
};

function createTransitionOverlay(projectSlug: string) {
  const source = document.querySelector<HTMLElement>(
    `[data-project-transition-source="${projectSlug}"]`,
  );
  const sourceImage = source?.querySelector<HTMLImageElement>("img");
  if (!source || !sourceImage) return null;

  const rect = source.getBoundingClientRect();
  const overlay = document.createElement("div");
  const image = sourceImage.cloneNode(true) as HTMLImageElement;
  overlay.className = "project-transition-overlay";
  overlay.dataset.project = projectSlug;
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.setProperty("--transition-left", `${rect.left}px`);
  overlay.style.setProperty("--transition-top", `${rect.top}px`);
  overlay.style.setProperty("--transition-width", `${rect.width}px`);
  overlay.style.setProperty("--transition-height", `${rect.height}px`);
  overlay.style.setProperty("--transition-x", `${-rect.left}px`);
  overlay.style.setProperty("--transition-y", `${-rect.top}px`);
  overlay.style.setProperty(
    "--transition-scale-x",
    `${window.innerWidth / Math.max(1, rect.width)}`,
  );
  overlay.style.setProperty(
    "--transition-scale-y",
    `${window.innerHeight / Math.max(1, rect.height)}`,
  );
  image.alt = "";
  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
  overlay.append(image);
  document.body.append(overlay);
  return overlay;
}

export function ProjectTransitionLink({
  href,
  projectSlug,
  onClick,
  onPointerEnter,
  children,
  ...props
}: ProjectTransitionLinkProps) {
  const router = useRouter();
  const profile = useInteractionProfile();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    const anchor = event.currentTarget;
    const enhance = shouldEnhanceProjectNavigation({
      button: event.button,
      detail: event.detail,
      defaultPrevented: event.defaultPrevented,
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      target: anchor.target || undefined,
      download: anchor.hasAttribute("download"),
      reducedMotion: profile.reducedMotion,
    });
    if (!enhance) return;

    const overlay = createTransitionOverlay(projectSlug);
    if (!overlay) return;

    event.preventDefault();
    try {
      router.push(href);
    } catch {
      overlay.remove();
      window.location.assign(href);
      return;
    }

    requestAnimationFrame(() => {
      overlay.dataset.active = "true";
    });
    window.setTimeout(() => {
      overlay.dataset.complete = "true";
    }, 820);
    window.setTimeout(() => overlay.remove(), 1200);
    window.setTimeout(() => {
      if (window.location.pathname !== href) window.location.assign(href);
    }, 1500);
  };

  return (
    <Link
      href={href}
      {...props}
      onClick={handleClick}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        router.prefetch(href);
      }}
    >
      {children}
    </Link>
  );
}
