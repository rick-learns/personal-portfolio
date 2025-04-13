export type Skill = {
  name: string;
  percentage: number;
};

export type SkillCategory = {
  title: string;
  fileName: string;
  skills: Skill[];
};

export type TechBadge = {
  name: string;
};

export type AboutCard = {
  title: string;
  description: string;
  icon: string;
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  fileType: string;
  technologies: string[];
};

export const frontendSkills: Skill[] = [
  { name: "JavaScript", percentage: 95 },
  { name: "TypeScript", percentage: 90 },
  { name: "React", percentage: 85 },
  { name: "SvelteKit", percentage: 80 },
  { name: "TailwindCSS", percentage: 90 },
];

export const backendSkills: Skill[] = [
  { name: "Node.js", percentage: 85 },
  { name: "Express", percentage: 80 },
  { name: "PostgreSQL", percentage: 75 },
  { name: "MongoDB", percentage: 70 },
  { name: "GraphQL", percentage: 65 },
];

export const toolsSkills: Skill[] = [
  { name: "Git & GitHub", percentage: 90 },
  { name: "Docker", percentage: 75 },
  { name: "AWS", percentage: 70 },
  { name: "CI/CD", percentage: 80 },
  { name: "Vercel/Netlify", percentage: 85 },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend Development",
    fileName: "~/skills/frontend.json",
    skills: frontendSkills,
  },
  {
    title: "Backend Development",
    fileName: "~/skills/backend.json",
    skills: backendSkills,
  },
  {
    title: "Tools & Deployment",
    fileName: "~/skills/tools.json",
    skills: toolsSkills,
  },
];

export const techBadges: TechBadge[] = [
  { name: "JavaScript" },
  { name: "TypeScript" },
  { name: "React" },
  { name: "SvelteKit" },
  { name: "Node.js" },
  { name: "TailwindCSS" },
  { name: "GraphQL" },
  { name: "Docker" },
];

export const aboutCards: AboutCard[] = [
  {
    title: "Web Development",
    description: "Building responsive and accessible web applications using modern frameworks.",
    icon: "Code2",
  },
  {
    title: "UI/UX Design",
    description: "Creating intuitive interfaces with a focus on user experience and accessibility.",
    icon: "LayoutDashboard",
  },
  {
    title: "Backend Systems",
    description: "Developing robust APIs and backend services that power complex applications.",
    icon: "Database",
  },
  {
    title: "Problem Solving",
    description: "Finding efficient solutions to complex technical challenges through logical thinking.",
    icon: "Lightbulb",
  },
];

export const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "A fully responsive e-commerce platform with product filtering, user authentication, and payment processing.",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    fileType: "[React, Node.js, MongoDB]",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
  },
  {
    title: "Weather Dashboard",
    description: "A sleek weather dashboard application with location-based forecasts, interactive maps, and historical data.",
    tags: ["SvelteKit", "TypeScript", "OpenWeatherAPI", "Tailwind"],
    fileType: "[SvelteKit, TypeScript, API]",
    technologies: ["SvelteKit", "TypeScript", "OpenWeatherAPI", "Tailwind"],
  },
  {
    title: "Taskify Pro",
    description: "A collaborative task management application with real-time updates, team workspaces, and productivity analytics.",
    tags: ["React", "Redux", "Firebase", "Material UI"],
    fileType: "[React, Redux, Firebase]",
    technologies: ["React", "Redux", "Firebase", "Material UI"],
  },
];

export const developerInfo = {
  name: "John Doe",
  title: "Software Developer & UI/UX Enthusiast",
  email: "hello@johndev.com",
  location: "San Francisco, CA",
  availability: "Available for freelance projects",
  socials: [
    { name: "GitHub", url: "#" },
    { name: "LinkedIn", url: "#" },
    { name: "Twitter", url: "#" },
    { name: "Dribbble", url: "#" },
  ],
};
