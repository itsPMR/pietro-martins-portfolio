import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { isPublicDeployment, site, siteUrl } from "@/lib/site";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-hanken",
});

const ibmPlexMono = IBM_Plex_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: "%s | Pietro Martins",
  },
  description: site.description,
  applicationName: "Portfólio de Pietro Martins",
  authors: [{ name: site.name, url: site.linkedin }],
  creator: site.name,
  category: "technology",
  keywords: [
    "Pietro Martins",
    "desenvolvedor backend",
    "Python",
    "Flask",
    "Desenvolvimento de Sistemas",
    "Guarulhos",
    "portfólio de tecnologia",
    "estágio em TI",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: site.title,
    description: site.description,
    locale: "pt_BR",
    siteName: "Pietro Martins — Portfólio",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    follow: isPublicDeployment,
    index: isPublicDeployment,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#08090b",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  email: `mailto:${site.email}`,
  homeLocation: {
    "@type": "Place",
    name: site.location,
  },
  jobTitle: "Estudante técnico em Desenvolvimento de Sistemas",
  sameAs: [site.github, site.linkedin],
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${hankenGrotesk.variable} ${ibmPlexMono.variable}`}
      lang="pt-BR"
    >
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
          type="application/ld+json"
        />
      </body>
    </html>
  );
}
