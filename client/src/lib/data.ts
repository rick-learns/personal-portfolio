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
  { name: "Go", percentage: 85 },
  { name: "Swift", percentage: 80 },
  { name: "PowerShell", percentage: 90 },
  { name: "Bash", percentage: 95 },
  { name: "React", percentage: 75 },
  { name: "TypeScript", percentage: 70 },
];

export const backendSkills: Skill[] = [
  { name: "Exploratory Testing", percentage: 95 },
  { name: "Test Automation", percentage: 85 },
  { name: "API Testing", percentage: 90 },
  { name: "Test Case Development", percentage: 95 },
  { name: "UAT", percentage: 85 },
];

export const toolsSkills: Skill[] = [
  { name: "Git & GitHub", percentage: 90 },
  { name: "Docker", percentage: 80 },
  { name: "AWS", percentage: 75 },
  { name: "Tailwind CSS", percentage: 70 },
  { name: "JIRA/Confluence", percentage: 95 },
  { name: "Virtualization", percentage: 85 },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    fileName: "~/skills/languages.json",
    skills: frontendSkills,
  },
  {
    title: "Quality Engineering",
    fileName: "~/skills/quality.json",
    skills: backendSkills,
  },
  {
    title: "Tools & Platforms",
    fileName: "~/skills/tools.json",
    skills: toolsSkills,
  },
];

export const techBadges: TechBadge[] = [
  { name: "Go" },
  { name: "Swift" },
  { name: "PowerShell" },
  { name: "Bash" },
  { name: "SQL" },
  { name: "React" },
  { name: "TypeScript" },
  { name: "Tailwind CSS" },
  { name: "Docker" },
  { name: "AWS" },
  { name: "TestAutomation" },
  { name: "CompTIA Network+" },
];

export const aboutCards: AboutCard[] = [
  {
    title: "Quality Engineering",
    description: "Ensuring software reliability through comprehensive testing, edge case validation, and continuous improvement processes.",
    icon: "ShieldCheck",
  },
  {
    title: "Automation & Tools",
    description: "Developing diagnostic tools and scripts that improve workflow efficiency and solve complex technical challenges.",
    icon: "Code2",
  },
  {
    title: "Virtualization",
    description: "Working with VMWare, Hyper-V, and other virtualization platforms to replicate environments and diagnose issues.",
    icon: "Server",
  },
  {
    title: "Technical Support",
    description: "Resolving complex technical issues with a methodical approach and clear documentation for future reference.",
    icon: "Headphones",
  },
];

export const projects: Project[] = [
  {
    title: "macOS Roaming Client Diagnostic Utility",
    description: "Developed a comprehensive diagnostic tool for macOS, automating data collection and S3 uploads to drastically reduce troubleshooting time for the support team.",
    tags: ["GoLang", "Swift", "AWS S3", "Diagnostics"],
    fileType: "[GoLang, Swift, AWS]",
    technologies: ["GoLang", "Swift", "AWS S3", "macOS"],
  },
  {
    title: "Support Diagnostic Script Suite",
    description: "Created a collection of PowerShell and Bash diagnostic scripts deployed to 350,000+ devices globally, improving support resolution times by 63%.",
    tags: ["PowerShell", "Bash", "Diagnostics", "Troubleshooting"],
    fileType: "[PowerShell, Bash, Scripts]",
    technologies: ["PowerShell", "Bash", "Diagnostics", "Troubleshooting"],
  },
  {
    title: "Quality Assurance Test Framework",
    description: "Designed and implemented comprehensive test suites that reduced post-release defects by 32% and improved release cycle efficiency by 19%.",
    tags: ["Test Automation", "Exploratory Testing", "JIRA", "Confluence"],
    fileType: "[Testing, Automation, CI/CD]",
    technologies: ["Test Automation", "Exploratory Testing", "JIRA", "Confluence"],
  },
  {
    title: "Developer Portfolio Website",
    description: "Built a modern, responsive portfolio website using React, TypeScript, and Tailwind CSS with a terminal-inspired aesthetic to showcase technical skills and projects.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Responsive Design"],
    fileType: "[React, TypeScript, Web]",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Responsive Design"],
  },
];

export const developerInfo = {
  name: "Rick Cohen",
  title: "Quality Engineer & Diagnostic Tools Developer",
  email: "rickykcohen@gmail.com",
  location: "Remote",
  availability: "Currently working at DNSFilter",
  socials: [
    { name: "GitHub", url: "https://github.com/rick-learns" },
    { name: "LinkedIn", url: "https://linkedin.com/in/rickykcohen" },
  ],
};
