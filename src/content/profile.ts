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

export type Endpoint = { method: "GET" | "POST" | "PUT" | "DELETE"; path: string };

const crud = (resource: string): Endpoint[] => [
  { method: "GET", path: `/${resource}` },
  { method: "GET", path: `/${resource}/:id` },
  { method: "POST", path: `/${resource}` },
  { method: "PUT", path: `/${resource}/:id` },
  { method: "DELETE", path: `/${resource}/:id` },
];

/** Personal full-stack projects and the REST routes each server exposes (shown in kebab-case). */
export const fullstack: {
  name: string;
  what: string;
  stack: string[];
  live?: string;
  client: string;
  server?: string;
  api?: Endpoint[];
}[] = [
  {
    name: "Traveezy",
    what: "Travel agency platform: browse services, book after sign-in, and manage bookings and services as an admin.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Firebase Auth"],
    live: "https://traveezy.netlify.app/",
    client: "https://github.com/dev-shovon13/traveezy-client-react",
    server: "https://github.com/dev-shovon13/traveezy-server",
    api: [
      { method: "GET", path: "/services" },
      { method: "GET", path: "/services/:id" },
      { method: "POST", path: "/services" },
      { method: "GET", path: "/user-services" },
      { method: "GET", path: "/user-services/:id" },
      { method: "POST", path: "/user-services" },
      { method: "PUT", path: "/user-services/:id" },
      { method: "DELETE", path: "/user-services/:id" },
    ],
  },
  {
    name: "User Management",
    what: "Create, read, update and delete users from a React client against its own Express API.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    client: "https://github.com/dev-shovon13/user-management-client-react",
    server: "https://github.com/dev-shovon13/user-management-server",
    api: crud("users"),
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
