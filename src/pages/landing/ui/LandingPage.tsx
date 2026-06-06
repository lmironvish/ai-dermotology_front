import { useRef } from "react";
import { Advantages } from "@/widgets/advantages";
import { AnalysisWorkspace } from "@/widgets/analysis-workspace";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { HeroSection } from "@/widgets/hero";
import { HowItWorks } from "@/widgets/how-it-works";
import { PrivacySection } from "@/widgets/privacy-section";

export function LandingPage() {
  const workspaceRef = useRef<HTMLElement | null>(null);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#f8fafc", overflowX: "hidden" }}
    >
      <Header onStartAnalysis={scrollToWorkspace} />
      <HeroSection onStartAnalysis={scrollToWorkspace} onHowItWorks={scrollToHowItWorks} />
      <HowItWorks />
      <Advantages />
      <AnalysisWorkspace workspaceRef={workspaceRef} />
      <PrivacySection />
      <Footer />
    </div>
  );
}
