export type CaseStudy = {
  slug: string;
  code: string;
  title: string;
  client: string;
  oneLine: string;
  role: string;
  period: string;
  team: string;
  stack: string[];
  /** Minimal entries are listed but withhold detail. */
  withheld?: boolean;
  sections: { heading: string; body: string[] }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "neustring",
    code: "NEU",
    title: "NeuString: reconciliation, billing & analytics",
    client: "Yaana Technologies (USA), via Penta Global",
    oneLine:
      "Owning three business-critical modules on a wholesale roaming platform used by international telecom operators.",
    role: "Software engineer, module owner",
    period: "Sep 2024 – present",
    team: "Distributed: Bangladesh, India, Ukraine, Poland",
    stack: ["React", "TypeScript", "Redux Toolkit", "Amazon QuickSight"],
    sections: [
      {
        heading: "Context",
        body: [
          "When a subscriber roams onto a partner's network, two operators end up holding two versions of the same usage. Each month those versions have to agree before money moves. NeuString is Yaana Technologies' platform for that wholesale roaming business, and its users are the operators' own settlement and finance teams.",
        ],
      },
      {
        heading: "My role",
        body: [
          "I own the frontend of three modules end to end: Reconciliation, Billing & Charging Evaluation (BCE) and the Amazon QuickSight (AQS) analytics module. That covers new features, enhancements, fixes and delivery. I review code with teams in India, Ukraine and Poland and mentor junior developers.",
        ],
      },
      {
        heading: "The problem",
        body: [
          "Settlement data is dense, numeric and unforgiving. A screen that rounds the wrong way, hides a filter state, or makes two records look alike costs real money and real time to untangle. The interfaces have to make large tables legible and discrepancies impossible to miss.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "Reconciliation views that compare records and surface what doesn't match. BCE screens for evaluating billing and charging. The AQS module that brings QuickSight analytics into the product. Each one is built for people who read tables all day and need to trust what they see.",
        ],
      },
      {
        heading: "Constraints",
        body: [
          "Client work under NDA: no screenshots or real data appear here. The interactive table on this page is an illustrative recreation running on synthetic data.",
        ],
      },
    ],
  },
  {
    slug: "acc-erp",
    code: "ACC",
    title: "Anti-Corruption Commission ERP",
    client: "Anti-Corruption Commission, Bangladesh, via Penta Global",
    oneLine: "Frontend features for the enterprise system behind the Commission's day-to-day workflows.",
    role: "Software engineer",
    period: "Penta Global · 2023 – present",
    team: "Penta Global engineering",
    stack: ["React", "TypeScript"],
    sections: [
      {
        heading: "Context",
        body: [
          "The Anti-Corruption Commission runs on an enterprise ERP that carries its internal business workflows. Work like this lives or dies on whether each step is clear to the person at that step.",
        ],
      },
      {
        heading: "My role",
        body: [
          "I developed and maintained frontend features in the ERP, supporting the Commission's business workflows alongside the wider Penta Global team. I also review code and mentor junior developers.",
        ],
      },
      {
        heading: "Constraints",
        body: [
          "Government work under NDA. The illustration is a generic recreation of a workflow screen, not the real system.",
        ],
      },
    ],
  },
  {
    slug: "election",
    code: "NEM",
    title: "National election management",
    client: "Government of Bangladesh, via Penta Global",
    oneLine: "Frontend functionality for a national-scale public-sector system.",
    role: "Software engineer",
    period: "Penta Global · 2023 – present",
    team: "Penta Global engineering",
    stack: ["React", "TypeScript"],
    sections: [
      {
        heading: "Context",
        body: [
          "A national election management system serves a very large number of officials, many of them using it under deadline and not by choice. Clarity and correctness outrank everything else.",
        ],
      },
      {
        heading: "My role",
        body: ["I contributed frontend functionality to the system as part of the Penta Global delivery team, reviewing code and mentoring junior developers."],
      },
      {
        heading: "Constraints",
        body: [
          "Government work under NDA. The illustration is a generic recreation built on synthetic data.",
        ],
      },
    ],
  },
  {
    slug: "intel-platform",
    code: "NIP",
    title: "National Intelligence Platform (NIP)",
    client: "Withheld",
    oneLine: "Enterprise features for a large-scale telecommunications monitoring system.",
    role: "Software engineer",
    period: "Penta Global · 2023 – present",
    team: "Withheld",
    stack: ["Withheld"],
    withheld: true,
    sections: [
      {
        heading: "What I can say",
        body: [
          "I worked on enterprise application features and frontend development for the National Intelligence Platform, a large-scale telecommunications monitoring system, and mentored junior developers on the team. Further detail stays with the client.",
        ],
      },
    ],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
