import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MusicWave | Music player by Kalyan",
  description: "MusicWave is a music player built by Kalyan: search songs, browse languages, and keep playing while you explore the portfolio.",
  alternates: { canonical: "/music" },
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
