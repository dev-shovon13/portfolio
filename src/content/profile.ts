export const profile = {
  name: "Kawser Ahmed Shovon",
  nameLines: ["Kawser", "Ahmed", "Shovon"],
  role: "Software engineer",
  stack: "React · Next.js · TypeScript · Node.js",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  since: "Dec 2021",
  email: "ahmedshovoncse13@gmail.com",
  resume: "/Kawser_Ahmed_Shovon_Resume.pdf",
  resumeFile: "Kawser_Ahmed_Shovon_Resume.pdf",
  links: {
    github: "https://github.com/dev-shovon13",
    linkedin: "https://www.linkedin.com/in/kawser-ahmed-shovon-601506216/",
  },
  summary:
    "I build the interfaces that sit on top of systems that can't afford to be wrong: roaming settlements between telecom operators, a national election, an anti-corruption ERP. Five years in, I own modules end to end, from the first ticket to the release, and I work with teams spread across four time zones. On my own projects I build the other side too: REST APIs in Node.js and Express over MongoDB.",
  education: {
    degree: "B.Sc. in Computer Science & Engineering",
    school: "Daffodil International University, Dhaka",
    period: "2015 – 2018",
  },
  languages: "Bangla (native) · English (professional)",
} as const;

/** Hero copy. Also drawn into the generated share image (app/opengraph-image.tsx), so edit it here. */
export const hero = {
  years: 5,
  yearsLabel: "Years of experience",
  yearsNote: "Shipping software since Dec 2021",
  /** Words cycled in the highlighted pill; the share image shows the first. */
  stack: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB"],
  /** Follows "<role> building <stack word>". */
  pitch: "systems for telecom settlement, government and enterprise.",
};

export type Status = "matched" | "pending";

/** The eight items reconciled in the hero board. */
export const ledgerItems = [
  { code: "REC", item: "Roaming reconciliation", client: "NeuString", period: "2024–" },
  { code: "BCE", item: "Billing & charging evaluation", client: "NeuString", period: "2024–" },
  { code: "AQS", item: "QuickSight analytics", client: "NeuString", period: "2024–" },
  { code: "ACC", item: "Anti-Corruption Commission ERP", client: "Penta Global", period: "2023–" },
  { code: "NEM", item: "National election management", client: "Penta Global", period: "2023–" },
  { code: "NIP", item: "National Intelligence Platform", client: "Penta Global", period: "2023–" },
  { code: "WEB", item: "Corporate site & templates", client: "BYSL Global", period: "2022–23" },
  { code: "HIR", item: "Hiring platform, Canada", client: "TechHack", period: "2021–22" },
] as const;

export type Role = {
  company: string;
  title: string;
  location: string;
  period: string;
  note?: string;
  entries: { code: string; name: string; tag?: string; link?: { label: string; href: string }; lines: string[] }[];
};

export const experience: Role[] = [
  {
    company: "Penta Global Limited",
    title: "Software Engineer",
    location: "Dhaka, Bangladesh",
    period: "Aug 2023 – Present",
    note: "Across all Penta projects: review code and mentor junior developers.",
    entries: [
      {
        code: "NEU",
        name: "Yaana Technologies (USA): NeuString",
        tag: "Sep 2024 – present",
        lines: [
          "Develop and maintain business-critical frontend modules for NeuString, Yaana Technologies' global wholesale telecom and roaming platform used by international operators.",
          "Own and independently run the Reconciliation, Billing & Charging Evaluation (BCE) and Amazon QuickSight (AQS) modules: features, enhancements, fixes and delivery.",
          "Work with engineering teams in India, Ukraine and Poland.",
        ],
      },
      {
        code: "NIP",
        name: "National Intelligence Platform (NIP)",
        lines: [
          "Enterprise application features and frontend development for a large-scale telecommunications monitoring system.",
        ],
      },
      {
        code: "ACC",
        name: "Anti-Corruption Commission: ERP",
        lines: [
          "Developed and maintained frontend features supporting the Commission's business workflows.",
        ],
      },
      {
        code: "NEM",
        name: "National election management",
        lines: [
          "Delivered frontend functionality for Bangladesh's national election management system, a large-scale public-sector application.",
        ],
      },
    ],
  },
  {
    company: "BYSL Global Technology Group",
    title: "Frontend Developer (Executive)",
    location: "Dhaka, Bangladesh",
    period: "Jun 2022 – Jul 2023",
    entries: [
      {
        code: "WEB",
        name: "Corporate website",
        link: { label: "byslglobal.com", href: "https://www.byslglobal.com/" },
        lines: ["Built and maintained the company's main corporate website and its reusable frontend templates."],
      },
      {
        code: "IDM",
        name: "Intelli Digital marketplace",
        lines: ["Worked with backend and QA teams across the full delivery cycle of a marketplace product."],
      },
    ],
  },
  {
    company: "TechHack Canada",
    title: "Junior Software Engineer",
    location: "Dhaka, on-site · company registered in Canada",
    period: "Dec 2021 – May 2022",
    entries: [
      {
        code: "HIR",
        name: "Employee hiring platform",
        lines: [
          "Developed frontend features for a hiring platform serving the Canadian market.",
          "Improved the application's responsiveness, UX and overall stability.",
        ],
      },
    ],
  },
];

export const toolkit = [
  { code: "1010", account: "Frontend", entries: ["TypeScript", "JavaScript (ES6+)", "React.js", "Next.js", "HTML5", "CSS3", "Responsive design", "React Hook Form", "Yup"] },
  { code: "1020", account: "UI & styling", entries: ["Tailwind CSS", "shadcn/ui", "Material UI", "Bootstrap"] },
  { code: "1030", account: "State", entries: ["Redux", "Redux Toolkit", "Redux Thunk"] },
  { code: "2010", account: "Backend", entries: ["Node.js", "Express.js", "REST APIs", "MongoDB", "GraphQL (Apollo Client)", "WebSocket"] },
  { code: "3010", account: "Practice", entries: ["Git", "GitHub", "Bitbucket", "Jira", "Figma", "Agile / Scrum", "Code review", "Technical documentation"] },
  { code: "3020", account: "Shipping", entries: ["Vercel", "Netlify", "Firebase", "Heroku"] },
];

/** Places on the collaboration strip. Ranges are for countries that span several zones. */
export const network = [
  { id: "us", label: "USA", detail: "Yaana Technologies", offset: [-8, -5] as [number, number] },
  { id: "ca", label: "Canada", detail: "TechHack", offset: [-8, -3.5] as [number, number] },
  { id: "pl", label: "Poland", detail: "NeuString team", tz: "Europe/Warsaw", offset: [1, 1] as [number, number] },
  { id: "ua", label: "Ukraine", detail: "NeuString team", tz: "Europe/Kyiv", offset: [2, 2] as [number, number] },
  { id: "in", label: "India", detail: "NeuString team", tz: "Asia/Kolkata", offset: [5.5, 5.5] as [number, number] },
  { id: "bd", label: "Dhaka", detail: "Home desk", tz: "Asia/Dhaka", offset: [6, 6] as [number, number], home: true },
];

export type Endpoint = { method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; path: string };

/** Shorthand for a run of routes on one resource: [method, path] pairs. */
const routes = (...list: [Endpoint["method"], string][]): Endpoint[] =>
  list.map(([method, path]) => ({ method, path }));

/** Personal full-stack projects and the REST routes each server exposes (shown in kebab-case). */
export const fullstack: {
  name: string;
  what: string;
  stack: string[];
  /** When set, the card shows two labelled lines: `stack` as front end, this as back end. */
  backend?: string[];
  live?: string;
  client?: string;
  server?: string;
  /** Short tag beside the name, e.g. how the project was built. */
  tag?: string;
  highlights?: string[];
  /** Who can open which part of the app; each area lists the roles allowed in. */
  access?: { roles: string[]; note?: string; areas: { area: string; pages: string; roles: string[] }[] };
  /** Caption over the routes panel; defaults to "<server repo> · Express". */
  apiLabel?: string;
  api?: Endpoint[];
}[] = [
  {
    name: "Hajira",
    what: "HR attendance and leave system for a whole company: staff check in and request leave, managers approve, and HR runs departments, shifts, policy and reports.",
    tag: "Built with agentic coding",
    highlights: [
      "Four roles (employee, manager, HR, admin), each with its own dashboard, and the API rejects anything a role can't open.",
      "Check-in and check-out on office time, with shifts, an optional office-IP restriction, a late policy that turns late marks into deducted days, and correction requests.",
      "Leave with a day-count preview before submitting, half days, yearly balances with carry-forward, attachments, and approve or reject with a comment.",
      "Monthly, late and leave reports that export to Excel and PDF.",
      "HR-approved sign-up, invites, email verification, notifications and an audit log.",
      "Secure sessions: JWT access and refresh tokens in HttpOnly cookies, renewed silently, plus Helmet security headers and rate limiting.",
      "Command palette (Ctrl K), charts, Zod-validated forms, TanStack Query caching, light and dark themes.",
    ],
    stack: ["Next.js", "TanStack Query", "Zod", "Radix UI", "Recharts", "Framer Motion"],
    backend: ["Node.js", "Express", "REST API", "JWT (HttpOnly cookies)", "Helmet", "Rate limiting", "Vercel"],
    live: "https://hajira-hrms.vercel.app/login",
    access: {
      roles: ["Employee", "Manager", "HR", "Admin"],
      note: "enforced by the API",
      areas: [
        {
          area: "My work",
          pages: "Dashboard, attendance, leave, team calendar, holidays",
          roles: ["Employee", "Manager", "HR", "Admin"],
        },
        { area: "Team", pages: "Approvals, team attendance, reports", roles: ["Manager", "HR", "Admin"] },
        {
          area: "Company",
          pages: "Employees, departments, designations, shifts, leave types, settings, audit log",
          roles: ["HR", "Admin"],
        },
      ],
    },
    apiLabel: "hajira · /api/v1",
    api: [
      ...routes(
        ["POST", "/auth/register"],
        ["POST", "/auth/login"],
        ["POST", "/auth/refresh"],
        ["POST", "/auth/logout"],
        ["GET", "/auth/me"],
        ["POST", "/auth/verify-email"],
        ["POST", "/auth/resend-verification"],
        ["POST", "/auth/forgot-password"],
        ["POST", "/auth/reset-password"],
        ["POST", "/auth/accept-invite"],
        ["POST", "/auth/change-password"],
      ),
      ...routes(["GET", "/dashboard/employee"], ["GET", "/dashboard/manager"], ["GET", "/dashboard/admin"]),
      ...routes(
        ["POST", "/attendance/check-in"],
        ["POST", "/attendance/check-out"],
        ["GET", "/attendance"],
        ["GET", "/attendance/month"],
        ["PATCH", "/attendance/:id"],
      ),
      ...routes(
        ["GET", "/regularizations"],
        ["POST", "/regularizations"],
        ["POST", "/regularizations/:id/cancel"],
        ["POST", "/regularizations/:id/approve"],
        ["POST", "/regularizations/:id/reject"],
      ),
      ...routes(
        ["GET", "/leave/balances"],
        ["GET", "/leave/requests"],
        ["POST", "/leave/requests"],
        ["POST", "/leave/requests/preview"],
        ["POST", "/leave/requests/:id/cancel"],
        ["POST", "/leave/requests/:id/approve"],
        ["POST", "/leave/requests/:id/reject"],
        ["POST", "/leave/attachments"],
      ),
      ...routes(["GET", "/leave-types"], ["POST", "/leave-types"], ["PUT", "/leave-types/:id"], ["DELETE", "/leave-types/:id"]),
      ...routes(["GET", "/holidays"], ["POST", "/holidays"], ["PUT", "/holidays/:id"], ["DELETE", "/holidays/:id"]),
      ...routes(
        ["GET", "/departments"],
        ["GET", "/departments/options"],
        ["POST", "/departments"],
        ["PUT", "/departments/:id"],
        ["DELETE", "/departments/:id"],
      ),
      ...routes(
        ["GET", "/designations"],
        ["GET", "/designations/options"],
        ["POST", "/designations"],
        ["PUT", "/designations/:id"],
        ["DELETE", "/designations/:id"],
      ),
      ...routes(
        ["GET", "/shifts"],
        ["POST", "/shifts"],
        ["PUT", "/shifts/:id"],
        ["DELETE", "/shifts/:id"],
        ["POST", "/shifts/:id/assign"],
      ),
      ...routes(
        ["GET", "/users"],
        ["GET", "/users/options"],
        ["GET", "/users/me"],
        ["PATCH", "/users/me"],
        ["POST", "/users/me/avatar"],
        ["POST", "/users/invite"],
        ["POST", "/users/:id/approve"],
        ["POST", "/users/:id/reject"],
      ),
      ...routes(["GET", "/reports/monthly"], ["GET", "/reports/late"], ["GET", "/reports/leave"]),
      ...routes(["GET", "/settings"], ["PUT", "/settings"]),
      ...routes(
        ["GET", "/notifications"],
        ["GET", "/notifications/unread-count"],
        ["POST", "/notifications/:id/read"],
        ["POST", "/notifications/read-all"],
      ),
      ...routes(["GET", "/audit-logs"]),
    ],
  },
  {
    name: "Helping Hand",
    what: "Volunteer events platform: join events with Google sign-in; admins create and manage events.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Firebase Auth"],
    live: "https://helping-hand-shovon.netlify.app/",
    client: "https://github.com/dev-shovon13/helping-hand-client-react",
    server: "https://github.com/dev-shovon13/helping-hand-server",
  },
  {
    name: "Corify",
    what: "Car dealership storefront with orders, social sign-in and an admin console for products, orders and admins.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Firebase Auth"],
    live: "https://corify.netlify.app/home",
    client: "https://github.com/dev-shovon13/corify-client-react",
  },
];

/** Places for the hero globe: home plus every team and client country (country markers, not offices). */
export const workPlaces = [
  { name: "Dhaka", lat: 23.81, lon: 90.41, color: "#ffd23f", origin: true },
  { name: "India", lat: 22.5, lon: 79, color: "#62f9d5" },
  { name: "Ukraine", lat: 49, lon: 31.5, color: "#6ec8ff", labelBelow: true },
  { name: "Poland", lat: 52, lon: 19.4, color: "#6ec8ff" },
  { name: "USA", lat: 39.5, lon: -98.4, color: "#ffd23f" },
  { name: "Canada", lat: 56, lon: -106, color: "#6ec8ff" },
];

export const travel = {
  districts: { visited: 46, total: 64 },
  site: "https://miles-and-moments.vercel.app/",
  countries: [
    { country: "Bangladesh", places: ["46 of 64 districts"] },
    { country: "India", places: ["Kolkata", "Agra", "Delhi", "Manali"] },
    { country: "Singapore", places: ["Singapore"] },
    {
      country: "Malaysia",
      places: ["Johor Bahru", "Malacca", "Kuala Lumpur", "Genting Highlands", "Penang", "Langkawi"],
    },
  ],
};

/** Travel globe: flights out of Dhaka. Only a few labels, so the Malay peninsula stays readable. */
export const travelPlaces = [
  { name: "Dhaka", lat: 23.81, lon: 90.41, color: "#ffd23f", origin: true },
  { name: "Kolkata", lat: 22.57, lon: 88.36, color: "#62f9d5", label: false },
  { name: "Agra", lat: 27.18, lon: 78.01, color: "#62f9d5", label: false },
  { name: "Delhi", lat: 28.61, lon: 77.21, color: "#62f9d5" },
  { name: "Manali", lat: 32.24, lon: 77.19, color: "#62f9d5" },
  { name: "Singapore", lat: 1.35, lon: 103.82, color: "#6ec8ff" },
  { name: "Johor Bahru", lat: 1.49, lon: 103.74, color: "#6ec8ff", label: false },
  { name: "Malacca", lat: 2.19, lon: 102.25, color: "#6ec8ff", label: false },
  { name: "Kuala Lumpur", lat: 3.14, lon: 101.69, color: "#6ec8ff" },
  { name: "Genting Highlands", lat: 3.42, lon: 101.79, color: "#6ec8ff", label: false },
  { name: "Penang", lat: 5.41, lon: 100.33, color: "#6ec8ff" },
  { name: "Langkawi", lat: 6.35, lon: 99.8, color: "#6ec8ff", label: false },
];
