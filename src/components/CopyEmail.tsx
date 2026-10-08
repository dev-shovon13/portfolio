"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/icons";

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <div>
      <a
        href={`mailto:${email}`}
        data-cursor="Write"
        className="block py-1 text-[clamp(1.15rem,2.6vw,1.9rem)] font-semibold tracking-[-0.01em] break-all text-ink underline decoration-accent/50 decoration-1 underline-offset-[0.2em] transition-[color,text-decoration-color] hover:text-accent hover:decoration-accent"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        data-cursor="Copy"
        className="fig mt-3 inline-flex items-center gap-2 pointer-coarse:min-h-10 text-[11px] text-ink-3 transition-colors hover:text-accent"
      >
        {state === "copied" ? <Check size={13} /> : <Copy size={13} />}
        {state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy. Select the address above." : "Copy address"}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Email address copied" : ""}
      </span>
    </div>
  );
}
