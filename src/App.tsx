import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
const DiagnosticSystem = lazy(() =>
  import("./components/diagnostic/DiagnosticSystem").then((module) => ({
    default: module.DiagnosticSystem,
  })),
);

export function App() {
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("alienxip_preloader_shown");
    }
    return true;
  });

  const [isPortalActivating, setIsPortalActivating] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const portalTimersRef = useRef<number[]>([]);

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

  useEffect(() => {
    return () => {
      portalTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      portalTimersRef.current = [];
    };
  }, []);

  const handleStartDiagnostic = () => {
    portalTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    setIsPortalActivating(true);

    portalTimersRef.current = [
      window.setTimeout(() => {
        setShowDiagnostic(true);
      }, 1200),
      window.setTimeout(() => {
        setIsPortalActivating(false);
      }, 2500),
    ];
  };

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
          <MissionFinal 
            onStartDiagnostic={handleStartDiagnostic}
            isPortalActivating={isPortalActivating}
          />
          <Footer />
        </div>
        <OrbitalSectorIndicator />
        <TrajectoryProgress />
      </main>

      <AnimatePresence>
        {isPortalActivating && (
          <motion.div
            key="portal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999998,
              background: "#030206",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDiagnostic && (
          <motion.div
            key="diagnostic-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
            }}
          >
            <Suspense fallback={<div className="diagnostic-loading-fallback" />}>
              <DiagnosticSystem
                onClose={() => {
                  setShowDiagnostic(false);
                  setIsPortalActivating(false);
                }}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
