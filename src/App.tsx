import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HeroSection } from "./components/alienxip/HeroSection";
import { ClientsMarquee } from "./components/alienxip/ClientsMarquee";
import { CraterField } from "./components/alienxip/CraterField";
import { MissionStackContainer } from "./components/alienxip/MissionStackContainer";
import { MissionMonitoring } from "./components/alienxip/MissionMonitoring";
import { MissionPortfolio } from "./components/alienxip/MissionPortfolio";
import { MissionProtocols } from "./components/alienxip/MissionProtocols";
import { MissionFinal } from "./components/alienxip/MissionFinal";
import { MissionTestimonials } from "./components/alienxip/MissionTestimonials";
import { Navbar } from "./components/alienxip/Navbar";
import { OrbitalSectorIndicator } from "./components/alienxip/OrbitalSectorIndicator";
import { Starfield } from "./components/alienxip/Starfield";
import { TrajectoryProgress } from "./components/alienxip/TrajectoryProgress";
import { Footer } from "./components/alienxip/Footer";
import { Preloader } from "./components/alienxip/Preloader";
import { isDiagnosticEntry } from "./config/diagnosticUrl";
const DiagnosticSystem = lazy(() =>
  import("./components/diagnostic/DiagnosticSystem").then((module) => ({
    default: module.DiagnosticSystem,
  })),
);

export function App() {
  const diagnosticEntry = isDiagnosticEntry();
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window !== "undefined") {
      return !diagnosticEntry && !sessionStorage.getItem("alienxip_preloader_shown");
    }
    return true;
  });

  useEffect(() => {
    if (showPreloader) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      sessionStorage.setItem("alienxip_preloader_shown", "true");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPreloader]);

  if (diagnosticEntry) {
    return (
      <Suspense fallback={<div className="diagnostic-loading-fallback" />}>
        <DiagnosticSystem
          onClose={() => {
            window.location.href = "/";
          }}
        />
      </Suspense>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showPreloader && (
          <Preloader key="preloader" onComplete={() => setShowPreloader(false)} />
        )}
      </AnimatePresence>

      <Navbar showMark />
      <main className="alienxip-app">
        <HeroSection />
        <div className="post-hero-stage">
          <Starfield
            className="post-hero-starfield"
            starColor="rgba(255,255,255,1)"
            bgColor="rgba(0,0,0,1)"
            mouseAdjust
            easing={1}
            opacity={0.1}
            speed={1}
            quantity={512}
          />
          <CraterField />
          <ClientsMarquee />
          <MissionStackContainer />
          <MissionMonitoring />
          <MissionTestimonials />
          <MissionPortfolio />
          <MissionProtocols />
          <MissionFinal />
          <Footer />
        </div>
        <OrbitalSectorIndicator />
        <TrajectoryProgress />
      </main>
    </>
  );
}
