import { useRef } from "react";
import { ScrambleText } from "../ui/ScrambleText";
import { motion } from "framer-motion";
import { DeferredParticleGalaxy } from "../ui/DeferredParticleGalaxy";

const portalImage = new URL("../../../portal, ultima tela.png", import.meta.url).href;

const finalSignals = [
  "diagnóstico gratuito",
  "resposta em até 24h",
  "operação confidencial",
];

function LockIcon() {
  return (
    <svg viewBox="0 0 34 34" aria-hidden="true">
      <path d="M10.5 15.2v-3.4c0-4.1 2.7-6.9 6.5-6.9s6.5 2.8 6.5 6.9v3.4" />
      <path d="M8.4 15.2h17.2v13.5H8.4z" />
      <path d="M17 20.2v3.8" />
    </svg>
  );
}
export type MissionFinalProps = {
  onStartDiagnostic?: () => void;
  isPortalActivating?: boolean;
};

export function MissionFinal({ onStartDiagnostic, isPortalActivating = false }: MissionFinalProps) {
  const ctaRef = useRef<HTMLAnchorElement>(null);

  return (
    <section
      className="mission-007"
      id="diagnostico"
      aria-labelledby="mission-007-title"
      data-orbital-sector="007"
    >
      <div className="mission-007-space" aria-hidden="true" />
      <DeferredParticleGalaxy
        className="mission-007-galaxy"
        particleCount={13000}
        particleSize={0.026}
        rotationSpeed={0.00055}
        spiralArms={4}
        colors={["#6f5cff", "#b764ff", "#f7efff"]}
        mouseInfluence={0.12}
        spread={2.45}
        density={0.96}
        glow={88}
        centerConcentration={0.42}
        verticalSpread={5.5}
        pulsateSpeed={0.5}
        cameraMovement={false}
        enableZoom={false}
        enableDrag={false}
        enableTouch={false}
        orientation="vertical"
        minRadius={1.15}
      />

      <motion.div
        className="mission-007-copy"
        initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="mission-007-label">MISSÃO 007</p>
        <h2 id="mission-007-title">
          <ScrambleText text="Sua operação está pronta" scrambleOnScroll />
          <br />
          <span>
            <ScrambleText text="para sair da órbita comum?" scrambleOnScroll />
          </span>
        </h2>
        <p className="mission-007-subtitle">
          <span>
            <ScrambleText text="Algumas empresas apenas acompanham mudanças." scrambleOnScroll />
          </span>
          <span className="mission-007-subtitle-line">
            <ScrambleText text="Outras iniciam " scrambleOnScroll />
            <strong>
              <ScrambleText text="novas eras." scrambleOnScroll />
            </strong>
          </span>
        </p>
      </motion.div>

      <div className={`mission-007-portal ${isPortalActivating ? "is-activating" : ""}`} aria-hidden="true">
        <img src={portalImage} alt="" />
      </div>

      <motion.div
        className="mission-007-console"
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
      >
        <a
          ref={ctaRef}
          className="mission-007-cta"
          href="#diagnostico-iniciado"
          onClick={(e) => {
            e.preventDefault();
            onStartDiagnostic?.();
          }}
        >
          <span className="mission-007-scan">
            <LockIcon />
          </span>
          <ScrambleText text="Iniciar diagnóstico estratégico" triggerRef={ctaRef} />
        </a>

        <div className="mission-007-signals" aria-label="Informacoes do diagnostico">
          {finalSignals.map((signal, index) => (
            <span key={signal} className={index === 0 ? "is-primary" : undefined}>
              {signal}
            </span>
          ))}
        </div>
      </motion.div>

    </section>
  );
}
