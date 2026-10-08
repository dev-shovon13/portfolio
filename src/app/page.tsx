import { SiteHeader } from "@/components/SiteHeader";
import { Choreography } from "@/components/Choreography";
import { Hero } from "@/components/sections/Hero";
import { Reconcile } from "@/components/sections/Reconcile";
import { CvSection } from "@/components/sections/CvSection";
import { Travel } from "@/components/sections/Travel";
import { getWorldMap } from "@/lib/worldMap";
import { Summary } from "@/components/sections/Summary";
import { LineItems } from "@/components/sections/LineItems";
import { FullStack } from "@/components/sections/FullStack";
import { Marquee } from "@/components/sections/Marquee";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Network } from "@/components/sections/Network";
import { Toolkit } from "@/components/sections/Toolkit";
import { Close } from "@/components/sections/Close";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Reconcile />
        <Summary />
        <CaseStudies />
        <LineItems />
        <Marquee />
        <FullStack />
        <Network />
        <Toolkit />
        <Travel map={getWorldMap()} />
        <CvSection />
        <Close />
      </main>
      <Choreography />
    </>
  );
}
