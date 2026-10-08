import Link from "next/link";
import { profile } from "@/content/profile";
import { Download } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";

const nav = [
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#fullstack", label: "Full stack" },
  { href: "/#travel", label: "Travel" },
  { href: "/cv", label: "CV" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div
        aria-hidden="true"
        data-page-progress
        className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-[linear-gradient(90deg,var(--color-sun),var(--color-mint),var(--color-sky))]"
      />
      <div className="mx-auto flex h-14 max-w-[1320px] items-center gap-3 px-4 sm:gap-6 sm:px-8">
        <Logo />
        <span className="fig hidden text-[11px] text-ink-3 xl:inline">5+ years · Dec 2021 → present</span>

        <nav aria-label="Primary" className="ml-auto flex items-center gap-0.5 sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden px-2.5 py-1.5 text-sm text-ink-2 transition-colors hover:text-accent lg:inline-block pointer-coarse:py-2.5"
            >
              {item.label}
            </Link>
          ))}
          {/* Below lg the CV builder stays one tap away; everything else lives in the menu. */}
          <Link href="/cv" className="inline-flex h-10 items-center px-2.5 text-sm text-ink hover:text-accent lg:hidden">
            CV
          </Link>
          <a
            href={profile.resume}
            download={profile.resumeFile}
            data-magnetic
            aria-label="Download résumé (PDF)"
            className="ml-1 inline-flex h-10 items-center gap-2 border border-accent/70 px-3 text-sm text-accent transition-colors hover:bg-accent hover:text-paper lg:h-auto lg:py-1.5 pointer-coarse:lg:h-10"
          >
            <Download size={14} />
            <span className="hidden min-[400px]:inline">Résumé</span>
          </a>
          <MobileMenu items={nav} />
        </nav>
      </div>
    </header>
  );
}
