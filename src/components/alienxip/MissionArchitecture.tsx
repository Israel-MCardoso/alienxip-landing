import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ScrambleText } from "../ui/ScrambleText";
import mission002Background from "../../assets/mission-002-background.webp";
import { BorderBeam } from "../ui/border-beam";

type ArchitectureStep = {
  title: string;
  status: string;
  items: string[];
  footer: string;
};

const architectureSteps: ArchitectureStep[] = [
  {
    title: "Diagnostico",
    status: "ACTIVE",
    items: ["Processos", "Operacoes", "Gargalos", "Oportunidades"],
    footer: "ANALISE EM ANDAMENTO",
  },
  {
    title: "Arquitetura",
    status: "COMPLETE",
    items: ["Mapeamento", "CRM", "Fluxos", "Integracoes", "Banco de dados"],
    footer: "ARQUITETURA DEFINIDA",
  },
  {
    title: "Automacao",
    status: "WAITING",
    items: ["IA", "WhatsApp", "Processos", "Follow-up"],
    footer: "AGUARDANDO ATIVACAO",
  },
  {
    title: "Desenvolvimento",
    status: "LOCKED",
    items: ["Sites", "ERP", "Aplicativos", "Plataformas"],
    footer: "BLOQUEADO",
  },
  {
    title: "Escala",
    status: "LOCKED",
    items: ["BI", "Metricas", "Retencao", "Performance"],
    footer: "BLOQUEADO",
  },
];

type MissionArchitectureStepProps = {
  step: ArchitectureStep;
  index: number;
  scrollProgress: MotionValue<number>;
};

function CheckIcon() {
  return (
    <svg className="step-status-icon" viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="step-status-icon" viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

function MissionArchitectureStep({ step, index, scrollProgress }: MissionArchitectureStepProps) {
  const start = 0.06 + index * 0.11;
  const end = start + 0.13;
  const opacity = useTransform(scrollProgress, [start, end], [0, 1]);
  const y = useTransform(scrollProgress, [start, end], [24, 0]);
  const blur = useTransform(scrollProgress, [start, end], [9, 0]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  const statusLower = step.status.toLowerCase();

  return (
    <motion.article
      className={`mission-002-step-container step-${statusLower}`}
      style={{ opacity, y, filter }}
    >
      <div className="mission-002-timeline-node" aria-hidden="true">
        <div className="node-outer">
          <div className="node-inner" />
        </div>
        <div className="node-connector-line" />
      </div>

      <div className="mission-002-card">
        {step.status === "ACTIVE" && (
          <>
            <div className="active-card-glow" />
            <BorderBeam
              size={140}
              duration={10}
              borderWidth={1.2}
              colorFrom="#b764ff"
              colorTo="#a9d5ff"
            />
          </>
        )}

        <header className="card-header">
          <div className="card-title-group">
            <span className="card-number">0{index + 1}</span>
            <h3>{step.title}</h3>
          </div>
          <span className={`status-badge badge-${statusLower}`}>
            {step.status === "COMPLETE" && <CheckIcon />}
            {step.status === "LOCKED" && <LockIcon />}
            {step.status === "ACTIVE" && <span className="pulse-dot" />}
            {step.status}
          </span>
        </header>

        <ul className="card-items">
          {step.items.map((item) => (
            <li key={item}>
              <span className="bullet">/</span>
              <span className="item-text">{item}</span>
            </li>
          ))}
        </ul>

        <footer className="card-footer">
          <span>{step.footer}</span>
        </footer>
      </div>
    </motion.article>
  );
}

export function MissionArchitecture() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const scrollProgress = useTransform(scrollYProgress, [0.06, 0.86], [0, 1]);
  const lineScale = useTransform(scrollProgress, [0.04, 0.76], [0, 1]);
  const lineOpacity = useTransform(scrollProgress, [0.02, 0.12], [0, 1]);

  return (
    <>
      <section className="mission-002-transition" aria-hidden="true">
        <div className="mission-002-transition-cut" />
        <div className="mission-002-transition-line" />
      </section>

      <section
        ref={sectionRef}
        className="mission-002"
        id="missao-002"
        aria-labelledby="mission-002-title"
        data-orbital-sector="002"
      >
        <div className="mission-002-sticky">
          <img className="mission-002-background" src={mission002Background} alt="" aria-hidden="true" />

        <motion.div
          className="mission-002-copy"
          initial={{ opacity: 0, y: 18, filter: "blur(7px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mission-002-label">MISSÃO 002</p>
          <h2 id="mission-002-title">
            <ScrambleText text="Toda evolução exige" scrambleOnScroll />
            <br />
            <ScrambleText text="uma " scrambleOnScroll />
            <span>
              <ScrambleText text="arquitetura." scrambleOnScroll />
            </span>
          </h2>
          <p>
            Transformação digital não começa
            <br />
            em ferramentas.
            <br />
            <span>Começa em estrutura.</span>
          </p>
        </motion.div>

        <motion.div
          className="mission-002-flow"
          aria-label="Linha de missao da arquitetura digital"
          initial={false}
        >
          <motion.div
            className="mission-002-flow-line"
            aria-hidden="true"
            style={{ scaleX: lineScale, opacity: lineOpacity }}
          />

          {architectureSteps.map((step, index) => (
            <MissionArchitectureStep
              key={step.title}
              step={step}
              index={index}
              scrollProgress={scrollProgress}
            />
          ))}
        </motion.div>

          <div className="mission-002-exit-cue" aria-hidden="true">
            <span />
            <i />
          </div>
        </div>
      </section>

      <section className="mission-002-exit-transition" aria-hidden="true">
        <div className="mission-002-exit-transition-cut" />
      </section>
    </>
  );
}
