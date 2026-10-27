import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Archivo, Funnel_Display, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import MiniPlayer from "@/components/MiniPlayer";
import FloatingPlayButton from "@/components/FloatingPlayButton";
import ThemeToggle from "@/components/ThemeToggle";
import { SOCIALS } from "@/data/contact";
import { KEYWORDS, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s" },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: "Kalyan", url: SITE_URL }],
  creator: "Kalyan",
  publisher: "Kalyan",
  alternates: { canonical: "/" },
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Kalyan | Full Stack & AI Engineer",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  // After adding the site in Google Search Console, paste the verification code here:
  // verification: { google: "your-code" },
};

// Facts about the site and its owner, in the form search engines read (schema.org). Everything here is also visible on the page.
const GITHUB = SOCIALS.find((s) => s.label === "GitHub")?.href;
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: SITE_URL,
      name: SITE_TITLE,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Kalyan",
      url: SITE_URL,
      image: `${SITE_URL}/profile.png`,
      jobTitle: "Full Stack & AI Engineer",
      description: SITE_DESCRIPTION,
      address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
      knowsAbout: [
        "Full-stack web development",
        "Mobile app development",
        "Next.js",
        "React",
        "TypeScript",
        "Flutter",
        "Generative AI",
        "Large language models",
        "Retrieval-augmented generation",
        "AI agents",
        "AWS cloud infrastructure",
        "Shopify and ecommerce",
        "UI and UX design",
        "Open source software",
      ],
      sameAs: SOCIALS.map((s) => s.href).filter(Boolean),
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: "Kalyan | Web, mobile and AI development",
      url: SITE_URL,
      image: `${SITE_URL}/profile.png`,
      areaServed: "Worldwide",
      address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
      founder: { "@id": `${SITE_URL}/#person` },
      sameAs: GITHUB ? [GITHUB] : undefined,
      makesOffer: [
        "Web development and CMS",
        "Mobile app development",
        "AI solutions and agents",
        "Animations and microinteractions",
        "Shopify and ecommerce",
        "UI and UX design",
      ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
    },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efeeeb" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${funnelDisplay.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, "\\u003c") }}
        />
        {/* Sets the light or dark theme before the page paints (saved choice, otherwise the device setting), so there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('portfolio_theme');if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})();",
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <MusicPlayerProvider>
            <div className="bg-grid-ambient" />
            {children}
            <MiniPlayer />
            <FloatingPlayButton />
            <ThemeToggle />
          </MusicPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
