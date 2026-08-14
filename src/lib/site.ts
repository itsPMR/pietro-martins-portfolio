const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (productionHost ? `https://${productionHost}` : "http://localhost:3000");

export const isPublicDeployment =
  process.env.VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_INDEXABLE === "true";

export const site = {
  name: "Pietro Martins Ramos",
  shortName: "Pietro Martins",
  title: "Pietro Martins | Desenvolvedor em formação",
  description:
    "Portfólio de Pietro Martins, estudante técnico em Desenvolvimento de Sistemas com foco em backend, Python e aplicações web.",
  email: "pietrosempre22@gmail.com",
  location: "Guarulhos — SP",
  github: "https://github.com/itsPMR",
  linkedin: "https://www.linkedin.com/in/pietropmr/",
  resume: "/downloads/curriculo-pietro-martins.pdf",
} as const;

export const navigation = [
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Tecnologias", href: "#tecnologias" },
  { label: "Formação", href: "#formacao" },
  { label: "Contato", href: "#contato" },
] as const;

export const skillGroups = [
  {
    index: "01",
    title: "Backend",
    items: ["Python", "Flask", "FastAPI", "APIs"],
  },
  {
    index: "02",
    title: "Dados",
    items: ["SQL", "PostgreSQL", "Supabase", "RLS"],
  },
  {
    index: "03",
    title: "Web",
    items: ["HTML", "CSS", "TypeScript", "React", "Next.js"],
  },
  {
    index: "04",
    title: "Ferramentas",
    items: ["Git", "GitHub", "Vercel", "Playwright", "Excel"],
  },
] as const;

export const certifications = [
  {
    name: "Python",
    issuer: "Santander Open Academy",
    date: "Abr. 2026",
  },
  {
    name: "Introdução à Programação",
    issuer: "EBAC",
    date: "Set. 2024",
  },
  {
    name: "Excel 2016 — Intermediário",
    issuer: "Fundação Bradesco",
    date: "Mai. 2026",
  },
] as const;
