import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Archivo, Funnel_Display, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import MiniPlayer from "@/components/MiniPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel",
  subsets: ["latin"],
});

// The typeface of the MusicWave player.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Runs before the page paints: repeat visits and reduced-motion visitors skip the opening screen with no flash of red.
const SPLASH_SKIP = `(function(){try{var seen=sessionStorage.getItem("splash-seen");var calm=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(seen||calm){document.documentElement.dataset.splash="seen"}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://kalyan-portfolio.vercel.app"),
  title: "Kalyan | Senior Full-Stack Engineer & AI Solutions Architect",
  description:
    "Senior Full-Stack Engineer and Systems Architect specializing in modern Next.js 16, React 19, scalable cloud microservices, and AI-driven web architectures.",
  keywords: [
    "Kalyan",
    "Full-Stack Engineer",
    "Systems Architect",
    "Next.js Developer",
    "React 19",
    "TypeScript",
    "AI Agent Platforms",
    "Cloud Architecture",
    "Hyderabad Software Engineer",
  ],
  authors: [{ name: "Kalyan" }],
  openGraph: {
    title: "Kalyan | Senior Full-Stack Engineer & AI Solutions Architect",
    description:
      "Explore mission-critical projects, production architectures, and technical expertise by Kalyan.",
    url: "https://kalyan-portfolio.vercel.app",
    siteName: "Kalyan Portfolio",
    images: [
      {
        url: "/profile.png",
        width: 800,
        height: 800,
        alt: "Kalyan - Senior Full-Stack Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${funnelDisplay.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body>
        {/* Marks visitors who already saw the opening screen (or prefer reduced motion), before the page paints. */}
        <Script id="splash-skip" strategy="beforeInteractive">{SPLASH_SKIP}</Script>
        <ThemeProvider>
          <MusicPlayerProvider>
            <div className="bg-grid-ambient" />
            {children}
            <MiniPlayer />
          </MusicPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
