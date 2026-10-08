import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ArrowLeft } from "@/components/icons";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto flex min-h-[70dvh] max-w-[1320px] flex-col justify-center px-4 sm:px-8">
        <h1 className="stmt text-[clamp(3rem,10vw,6rem)] font-semibold">No such entry</h1>
        <p className="fig mt-4 text-xs text-sun">404 · Unmatched record</p>
        <p className="mt-4 max-w-[46ch] text-lg text-ink-2">
          This address doesn&apos;t reconcile with anything on the statement. It may have moved, or never existed.
        </p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 text-accent hover:underline">
          <ArrowLeft /> Back to the statement
        </Link>
      </main>
    </>
  );
}
