/**
 * Source for the CV builder (/cv). Every toggleable piece has a stable id; the
 * builder stores the ids a visitor switches OFF, so new items default to on.
 */

export type Bullet = { id: string; text: string };

export const cvName = "Kawser Ahmed Shovon";
export const cvHeadline = "Software Engineer";

// Mirrors the resume header: a plain line (location, email), then a line of labelled links.
export const cvContacts = [
  { id: "c-location", label: "Location", value: "Dhaka, Bangladesh" },
  { id: "c-email", label: "Email", value: "ahmedshovoncse13@gmail.com" },
  { id: "c-github", label: "GitHub", value: "github.com/dev-shovon13", href: "https://github.com/dev-shovon13" },
  {
    id: "c-linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/kawser-ahmed-shovon-601506216",
    href: "https://www.linkedin.com/in/kawser-ahmed-shovon-601506216/",
  },
  { id: "c-portfolio", label: "Portfolio", value: "kawser-ahmed-shovon.pages.dev", href: "https://kawser-ahmed-shovon.pages.dev/" },
];

export const cvSummary =
  "Software Engineer with 5+ years of experience building scalable, user-centric web applications with React.js, Next.js, TypeScript and Node.js. Proven track record delivering business-critical modules for enterprise ERP, government, and telecom systems while collaborating with globally distributed teams and mentoring junior developers.";

export const cvSkills = [
  { id: "s-frontend", label: "Frontend", text: "JavaScript (ES6+), TypeScript, React.js, Next.js, HTML5, CSS3, Responsive Design, React Hook Form, Yup" },
  { id: "s-ui", label: "UI & Styling", text: "Tailwind CSS, Shadcn UI, Material UI, Bootstrap" },
  { id: "s-state", label: "State Management", text: "Redux, Redux Toolkit, Redux Thunk" },
  { id: "s-backend", label: "Backend", text: "Node.js, Express.js, REST APIs, MongoDB, GraphQL (Apollo Client), WebSocket" },
  {
    id: "s-tools",
    label: "Tools & Practices",
    text: "Git, GitHub, Bitbucket, Jira, Figma, Vercel, Netlify, Firebase, Heroku, Agile/Scrum, Code Review, Technical Documentation",
  },
];

export const cvStrengths =
  "React.js • Next.js • TypeScript • Node.js • Frontend Architecture • Enterprise Applications • API Integration • Problem Solving • Code Review • Cross-Cultural Team Collaboration • Mentoring";

export const cvLanguages = "Bangla: Native | English: Professional Working Proficiency";

export type CvRole = {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  /** name prints on the CV; label only names the group in the builder. */
  groups: { id: string; name?: string; label?: string; tag?: string; bullets: Bullet[] }[];
};

export const cvExperience: CvRole[] = [
  {
    id: "r-penta",
    title: "Software Engineer",
    company: "Penta Global Limited",
    location: "Dhaka, Bangladesh",
    period: "Aug 2023 – Present",
    groups: [
      {
        id: "g-neustring",
        name: "Yaana Technologies (USA) — NeuString",
        tag: "Sep 2024 – Present",
        bullets: [
          {
            id: "b-neu-1",
            text: "Develop and maintain business-critical frontend modules for NeuString, Yaana Technologies' global wholesale telecom/roaming platform used by international telecom operators.",
          },
          {
            id: "b-neu-2",
            text: "Own and independently manage the Reconciliation, Billing & Charging Evaluation (BCE), and Amazon QuickSight (AQS) modules, covering feature development, enhancements, fixes, and delivery.",
          },
          {
            id: "b-neu-3",
            text: "Collaborate with distributed engineering teams across India, Ukraine, and Poland.",
          },
        ],
      },
      {
        id: "g-nip",
        name: "National Intelligence Platform (NIP)",
        bullets: [
          {
            id: "b-nip-1",
            text: "Contributed to a large-scale government intelligence/telecommunications monitoring system, working on enterprise application features and frontend development.",
          },
        ],
      },
      {
        id: "g-acc",
        name: "Anti-Corruption Commission (ACC) — ERP",
        bullets: [
          {
            id: "b-acc-1",
            text: "Contributed to an enterprise ERP system for the Anti-Corruption Commission, developing and maintaining frontend features and supporting business workflows.",
          },
        ],
      },
      {
        id: "g-nem",
        name: "National Election Management Project",
        bullets: [
          {
            id: "b-nem-1",
            text: "Contributed to a Bangladesh government national election management system, helping deliver frontend functionality for a large-scale public-sector application.",
          },
        ],
      },
      {
        id: "g-penta-mentor",
        label: "Code review & mentoring",
        bullets: [{ id: "b-penta-mentor", text: "Participate in code reviews and mentor junior developers across all Penta projects." }],
      },
    ],
  },
  {
    id: "r-bysl",
    title: "Frontend Developer (Executive)",
    company: "BYSL Global Technology Group",
    location: "Dhaka, Bangladesh",
    period: "Jun 2022 – Jul 2023",
    groups: [
      {
        id: "g-bysl",
        bullets: [
          { id: "b-bysl-1", text: "Built and maintained the company's main corporate website (byslglobal.com) and reusable frontend templates." },
          { id: "b-bysl-2", text: "Contributed to Intelli Digital, a marketplace project, collaborating with backend and QA teams through the SDLC." },
        ],
      },
    ],
  },
  {
    id: "r-techhack",
    title: "Junior Software Engineer",
    company: "TechHack Canada",
    location: "Dhaka, Bangladesh (on-site — company registered in Canada)",
    period: "Dec 2021 – May 2022",
    groups: [
      {
        id: "g-techhack",
        bullets: [
          { id: "b-th-1", text: "Developed frontend features for an employee hiring platform serving the Canadian market." },
          { id: "b-th-2", text: "Improved application responsiveness, UX, and overall stability." },
        ],
      },
    ],
  },
];

export const cvProjects = [
  {
    id: "p-traveezy",
    name: "Traveezy",
    meta: "React · Node.js · Express · MongoDB · Firebase Auth · traveezy.netlify.app",
    bullets: [
      { id: "b-tr-1", text: "Travel agency platform: browse services, book after sign-in, and manage bookings and services as an admin." },
      { id: "b-tr-2", text: "Express REST API over MongoDB with CRUD endpoints for services and bookings." },
    ],
  },
  {
    id: "p-users",
    name: "User Management",
    meta: "React · Node.js · Express · MongoDB",
    bullets: [{ id: "b-um-1", text: "Full CRUD on users from a React client against its own Express API." }],
  },
  {
    id: "p-helping",
    name: "Helping Hand",
    meta: "React · Node.js · Express · MongoDB · Firebase Auth · helping-hand-shovon.netlify.app",
    bullets: [{ id: "b-hh-1", text: "Volunteer events platform: join events with Google sign-in; admins create and manage events." }],
  },
  {
    id: "p-corify",
    name: "Corify",
    meta: "React · Node.js · Express · MongoDB · Firebase Auth · corify.netlify.app",
    bullets: [{ id: "b-co-1", text: "Car dealership storefront with orders, social sign-in and an admin console for products, orders and admins." }],
  },
];

export const cvEducation = {
  id: "e-diu",
  degree: "B.Sc. in Computer Science & Engineering",
  school: "Daffodil International University, Dhaka",
  period: "2015 – 2018",
  cgpa: { id: "e-cgpa", text: "CGPA: 3.51 / 4.00" },
};

/** Section toggles. */
export const cvSections = [
  { id: "sec-summary", label: "Summary" },
  { id: "sec-skills", label: "Technical skills" },
  { id: "sec-strengths", label: "Core strengths" },
  { id: "sec-languages", label: "Languages" },
  { id: "sec-experience", label: "Work experience" },
  { id: "sec-projects", label: "Projects" },
  { id: "sec-education", label: "Education" },
] as const;

/** Off by default: kept in the builder, left out of the standard one-page CV. */
export const cvDefaultOff = ["sec-projects", "p-users", "sec-strengths"];

// ---------------------------------------------------------------------------
// A normalised CV built from the visitor's choices: shared by the HTML
// preview, the plain-text export and the PDF.

export type CvModel = {
  name: string;
  headline: string;
  /** Plain header line: location, email. */
  details: string[];
  /** Labelled header links: GitHub | LinkedIn | Portfolio. */
  links: { label: string; value: string; href: string }[];
  sections: CvSection[];
};

export type CvSection =
  | { kind: "text"; title: string; text: string }
  | { kind: "pairs"; title: string; pairs: { label: string; text: string }[] }
  | {
      kind: "entries";
      title: string;
      entries: { heading: string; right?: string; sub?: string; groups: { name?: string; tag?: string; bullets: string[] }[] }[];
    };

export function buildCv(off: Set<string>, headline: string, summary: string): CvModel {
  const on = (id: string) => !off.has(id);
  const sections: CvSection[] = [];

  if (on("sec-summary") && summary.trim()) sections.push({ kind: "text", title: "Professional summary", text: summary.trim() });

  const skills = cvSkills.filter((s) => on(s.id));
  if (on("sec-skills") && skills.length) sections.push({ kind: "pairs", title: "Technical skills", pairs: skills.map((s) => ({ label: s.label, text: s.text })) });

  if (on("sec-experience")) {
    const entries = cvExperience
      .filter((r) => on(r.id))
      .map((r) => ({
        heading: `${r.title} — ${r.company}`,
        right: r.period,
        sub: r.location,
        groups: r.groups
          .filter((g) => on(g.id))
          .map((g) => ({ name: g.name, tag: g.tag, bullets: g.bullets.filter((b) => on(b.id)).map((b) => b.text) }))
          .filter((g) => g.bullets.length),
      }));
    if (entries.length) sections.push({ kind: "entries", title: "Professional experience", entries });
  }

  if (on("sec-projects")) {
    const entries = cvProjects
      .filter((p) => on(p.id))
      .map((p) => ({ heading: p.name, sub: p.meta, groups: [{ bullets: p.bullets.filter((b) => on(b.id)).map((b) => b.text) }] }));
    if (entries.length) sections.push({ kind: "entries", title: "Projects", entries });
  }

  if (on("sec-education")) {
    const e = cvEducation;
    sections.push({
      kind: "entries",
      title: "Education",
      entries: [{ heading: e.degree, right: e.period, sub: on(e.cgpa.id) ? `${e.school} | ${e.cgpa.text}` : e.school, groups: [] }],
    });
  }

  if (on("sec-strengths")) sections.push({ kind: "text", title: "Core strengths", text: cvStrengths });
  if (on("sec-languages")) sections.push({ kind: "text", title: "Languages", text: cvLanguages });

  return {
    name: cvName,
    headline: headline.trim() || cvHeadline,
    details: cvContacts.filter((c) => on(c.id) && !c.href).map((c) => c.value),
    links: cvContacts.filter((c) => on(c.id)).flatMap(({ label, value, href }) => (href ? [{ label, value, href }] : [])),
    sections,
  };
}

export function cvToText(cv: CvModel): string {
  const out: string[] = [cv.name.toUpperCase(), cv.headline];
  if (cv.details.length) out.push(cv.details.join(" | "));
  // Plain text can't carry hyperlinks, so spell out where each label points.
  if (cv.links.length) out.push(cv.links.map((l) => `${l.label}: ${l.value}`).join(" | "));
  for (const s of cv.sections) {
    out.push("", s.title.toUpperCase());
    if (s.kind === "text") out.push(s.text);
    if (s.kind === "pairs") s.pairs.forEach((p) => out.push(`${p.label}: ${p.text}`));
    if (s.kind === "entries")
      s.entries.forEach((e, i) => {
        if (i) out.push("");
        out.push(e.right ? `${e.heading} | ${e.right}` : e.heading);
        if (e.sub) out.push(e.sub);
        e.groups.forEach((g) => {
          if (g.name) out.push(g.tag ? `${g.name} | ${g.tag}` : g.name);
          g.bullets.forEach((b) => out.push(`- ${b}`));
        });
      });
  }
  return out.join("\n") + "\n";
}
