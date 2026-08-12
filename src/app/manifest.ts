import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#090a0b",
    description:
      "Portfólio de Pietro Martins, estudante técnico em Desenvolvimento de Sistemas.",
    display: "standalone",
    name: "Pietro Martins — Portfólio",
    short_name: "Pietro Martins",
    start_url: "/",
    theme_color: "#090a0b",
  };
}
