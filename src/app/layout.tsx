import type { Metadata, Viewport } from "next";
import { Black_Ops_One, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Loader } from "@/components/Loader";
import { BackToTop } from "@/components/BackToTop";
import { ClickSpark } from "@/components/reactbits/ClickSpark";
import { profile } from "@/content/profile";
import { THEME_KEY } from "@/lib/theme";
import "./globals.css";

// Clash Display and General Sans are served by Fontshare's own CDN (ITF Free Font License), so the
// font files never live in this public repo. One variable font per request: the API returns only the first.
const FONTSHARE = [
  "https://api.fontshare.com/v2/css?f[]=clash-display@1&display=swap",
  "https://api.fontshare.com/v2/css?f[]=general-sans@1&display=swap",
];

// Only for the "5+" experience figure: a bold stencil face, chosen by Kawser.
const stat = Black_Ops_One({
  variable: "--font-blackops",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kawser-ahmed-shovon.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name}: Software Engineer`,
    template: `%s · ${profile.name}`,
  },
  description:
    "Software engineer in Dhaka with 5+ years building React, Next.js and Node.js systems for telecom settlement, government and enterprise.",
  authors: [{ name: profile.name, url: profile.links.github }],
  openGraph: {
    type: "website",
    title: `${profile.name}: Software Engineer`,
    description: "5+ years building systems that can't afford to be wrong.",
    siteName: profile.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a192f" },
    { media: "(prefers-color-scheme: light)", color: "#f6f4ee" },
  ],
  colorScheme: "dark light",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Software Engineer",
  address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
  email: `mailto:${profile.email}`,
  sameAs: [profile.links.github, profile.links.linkedin],
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${stat.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        {FONTSHARE.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <script
          // Gate entrance animations on JS before first paint.
          // Also skip the loader on repeat visits in this browser session (set before paint, so it never flashes).
          // The theme comes from the saved choice, else the system preference, also before paint.
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('kas-intro-seen'))d.classList.add('loader-skip')}catch(e){}" +
              `var t;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}d.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-dvh text-ink">
        <a
          href="#main"
          className="fig sr-only z-50 bg-mint px-3 py-2 text-xs text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Loader />
        <SmoothScroll />
        <Cursor />
        {children}
        <BackToTop />
        <ClickSpark />
      </body>
    </html>
  );
}
