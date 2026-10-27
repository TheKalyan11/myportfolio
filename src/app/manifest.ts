import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: "Kalyan",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#121211",
    theme_color: "#16379c",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/apple-icon.png", sizes: "any", type: "image/png" },
    ],
  };
}
