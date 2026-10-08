"use client";

import dynamic from "next/dynamic";

// The builder reads saved choices from localStorage, so it renders on the client only.
export const CvBuilderClient = dynamic(() => import("@/components/cv/CvBuilder"), {
  ssr: false,
  loading: () => <div className="h-[70dvh] animate-pulse border border-rule bg-paper-2" aria-label="Loading CV builder" />,
});
