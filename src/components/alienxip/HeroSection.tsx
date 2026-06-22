import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ScrambleText } from "../ui/ScrambleText";
import liquidGlassLogo from "../../assets/alienxip-liquid-glass-logo.webp";
import { HeroImageSequence } from "./HeroImageSequence";
import { ScrollCue } from "./ScrollCue";
import { getDiagnosticUrl } from "../../config/diagnosticUrl";

export function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, -18]);

  const btnPrimaryRef = useRef<HTMLAnchorElement>(null);
  const btnSecondaryRef = useRef<HTMLAnchorElement>(null);
  const diagnosticUrl = getDiagnosticUrl();

  return (
    <section className="hero-shell" id="top" ref={heroRef}>
      <div className="hero-sticky">
        <HeroImageSequence progress={scrollYProgress} />
        <img className="hero-watermark-cover" src={liquidGlassLogo} alt="" aria-hidden="true" draggable="false" />

        <motion.div className="hero-content" style={{ opacity: 1, y: copyY }}>
          <motion.p
            className="hero-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.1 }}
          >
            ASSESSORIA EM TRANSFORMAÇÃO DIGITAL
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
          >
            <ScrambleText text="Tecnologia para empresas" scrambleOnScroll />
            <br />
            <ScrambleText text="que operam " scrambleOnScroll />
            <span>
              <ScrambleText text="além" scrambleOnScroll />
            </span>
            <ScrambleText text=" da" scrambleOnScroll />
            <br />
            <ScrambleText text="órbita comum." scrambleOnScroll />
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.46 }}
          >
            <ScrambleText text="Transformamos operações em sistemas inteligentes" scrambleOnScroll />
            <br />
            <ScrambleText text="através de automação, IA e desenvolvimento estratégico." scrambleOnScroll />
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.7 }}
          >
            <a ref={btnPrimaryRef} className="button button-primary" href={diagnosticUrl}>
              <ScrambleText text="Iniciar diagnóstico estratégico" triggerRef={btnPrimaryRef} />
              <span aria-hidden="true"> →</span>
            </a>
            <a ref={btnSecondaryRef} className="button button-secondary" href="#missao-001">
              <ScrambleText text="Explorar missão" triggerRef={btnSecondaryRef} />
            </a>
          </motion.div>


          <motion.p
            className="hero-note"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.94 }}
          >
            Ao final da análise inicial, sua empresa recebe
            <br />
            um diagnóstico estratégico gratuito.
          </motion.p>
        </motion.div>

        <ScrollCue progress={scrollYProgress} />
      </div>
    </section>
  );
}
