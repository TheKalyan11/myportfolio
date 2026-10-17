import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import SelectedProjects from "@/components/SelectedProjects";
import ServicesSection from "@/components/ServicesSection";
import TechStackSection from "@/components/TechStackSection";
import CertificationsSection from "@/components/CertificationsSection";
import ExploreSection from "@/components/ExploreSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  return (
    // The page's own background matches the light sections, so a sub-pixel seam between two sections
    // blends in instead of letting the dark site background show through as a thin line.
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#efeeeb",
      }}
    >
      <SplashScreen />
      <main style={{ flex: 1 }}>
        <Hero />
        <IntroSection />
        <SelectedProjects />
        <ServicesSection />
        <TechStackSection />
        <CertificationsSection />
        <ExploreSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
}
