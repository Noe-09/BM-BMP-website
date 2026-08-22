"use client";

import { useEffect, useState } from "react";

import {
  resolveInteractionProfile,
  type InteractionProfile,
} from "./physics";

type ResolvedProfile = InteractionProfile & { ready: boolean };

const INITIAL_PROFILE: ResolvedProfile = {
  ...resolveInteractionProfile({
    finePointer: false,
    coarsePointer: false,
    reducedMotion: true,
  }),
  ready: false,
};

export function useInteractionProfile() {
  const [profile, setProfile] = useState<ResolvedProfile>(INITIAL_PROFILE);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const coarse = window.matchMedia("(pointer: coarse), (hover: none)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setProfile({
        ...resolveInteractionProfile({
          finePointer: fine.matches,
          coarsePointer: coarse.matches,
          reducedMotion: reduced.matches,
        }),
        ready: true,
      });
    };

    update();
    fine.addEventListener("change", update);
    coarse.addEventListener("change", update);
    reduced.addEventListener("change", update);

    return () => {
      fine.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return profile;
}
