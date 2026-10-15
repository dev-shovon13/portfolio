"use client";

import type { ComponentProps } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** A <details> that re-measures scroll triggers when it opens or closes, so pinned sections below stay in place. */
export function Disclosure(props: ComponentProps<"details">) {
  return <details {...props} onToggle={() => ScrollTrigger.refresh()} />;
}
