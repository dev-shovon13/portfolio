import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Choreography } from "@/components/Choreography";
import { CvBuilderClient } from "@/components/cv/CvBuilderClient";
import { ArrowLeft } from "@/components/icons";

export const metadata: Metadata = {
  title: "CV",
  description: "Build Kawser Ahmed Shovon's CV: pick the sections you need, preview it live, download PDF or text.",
};

export default function CvPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" data-accent="sun" className="mx-auto max-w-[1320px] px-4 pt-10 pb-24 sm:px-8 lg:pt-14">
        <Link href="/#cv" className="fig inline-flex items-center gap-2 text-[11px] text-ink-3 hover:text-accent pointer-coarse:min-h-10">
          <ArrowLeft size={13} /> Back to portfolio
        </Link>

        <header className="mt-8" data-ledger>
          <h1 className="stmt text-[clamp(2.8rem,8vw,6rem)] font-semibold" data-split>
            Curriculum <span className="text-accent">vitae.</span>
          </h1>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-2" data-line>
            Take it as it is, or untick what you don&apos;t need and reword the summary. The preview updates as you go,
            and the PDF is plain single-column text, so applicant tracking systems can read it.
          </p>
        </header>

        <div className="mt-14">
          <CvBuilderClient />
        </div>
      </main>
      <Choreography />
    </>
  );
}
