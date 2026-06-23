import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useState } from "react";
import { ScrambleText } from "../ui/ScrambleText";
import { BorderBeam } from "../ui/border-beam";
import moonImage from "../../assets/mission-001-moon.webp";

type MissionStep = {
  title: string;
  label: string;
  scanLabel: string;
  timelineDescription: string;
  description: string;
  metrics: string[];
  time: string;
  delivery: string;
};

const missionSteps: MissionStep[] = [
  {
    title: "1. Diagnóstico Estratégico",
    label: "DIAGNÓSTICO ESTRATÉGICO",
    scanLabel: "SCAN ACTIVE",
    timelineDescription: "Os primeiros sinais aparecem quando a operação cresce, mas os processos continuam manuais.",
    description: "Operações que dependem de processos manuais, informações descentralizadas e ferramentas desconectadas tendem a perder velocidade conforme crescem.",
    metrics: [
      "Processos internos",
      "Atendimento",
      "Fluxos operacionais",
      "Ferramentas atuais",
      "Gargalos",
      "Escalabilidade",
      "Marketing",
      "Comercial",
    ],
    time: "5-15 dias",
    delivery: "Mapa operacional +\ndiagnóstico gratuito",
  },
  {
    title: "2. Mapeamento Operacional",
    label: "MAPEAMENTO OPERACIONAL",
    scanLabel: "FLOW DETECTED",
    timelineDescription: "Informações, pessoas e ferramentas começam a circular sem clareza, gerando ruído e retrabalho.",
    description: "Mapeamos como informações, pessoas, tarefas e ferramentas circulam dentro da empresa para identificar pontos de atrito, perda de tempo e retrabalho.",
    metrics: [
      "Fluxos internos",
      "Equipe",
      "Comunicação",
      "Processos manuais",
      "Planilhas",
      "Ferramentas",
      "Atendimento",
      "Gestão",
    ],
    time: "3-10 dias",
    delivery: "Fluxo visual da operação",
  },
  {
    title: "3. Construção Inteligente",
    label: "CONSTRUÇÃO INTELIGENTE",
    scanLabel: "BUILD MODE",
    timelineDescription: "Os gargalos deixam de ser apenas problemas e se tornam oportunidades para criar tecnologia sob medida.",
    description: "Transformamos gargalos em sistemas, automações, interfaces e integrações que reduzem tarefas manuais e aumentam a eficiência da operação.",
    metrics: [
      "Sistemas",
      "Automações",
      "IA aplicada",
      "Integrações",
      "Dashboards",
      "Landing pages",
      "Web apps",
      "APIs",
    ],
    time: "15-45 dias",
    delivery: "Solução digital sob medida",
  },
  {
    title: "4. Escala Contínua",
    label: "ESCALA CONTÍNUA",
    scanLabel: "ORBIT STABLE",
    timelineDescription: "A operação passa a crescer com estrutura, previsibilidade e menos dependência de processos improvisados.",
    description: "Depois da implementação, a operação precisa continuar evoluindo com acompanhamento, otimização e novas camadas de inteligência.",
    metrics: [
      "Otimização",
      "Métricas",
      "Evolução",
      "Suporte",
      "Performance",
      "Novas automações",
      "Dados",
      "Crescimento",
    ],
    time: "Contínuo",
    delivery: "Evolução e otimização operacional",
  },
];

export function MissionContinuity() {
  const [selectedMissionOption, setSelectedMissionOption] = useState<number | null>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const activeStep = hoveredStep !== null ? hoveredStep : selectedMissionOption;
  const active = activeStep !== null && activeStep !== undefined ? missionSteps[activeStep] : null;
  const showCard = (isCardOpen && selectedMissionOption !== null) || hoveredStep !== null;

  return (
    <section
      className="mission-001"
      id="missao-001"
      aria-labelledby="mission-001-title"
      data-orbital-sector="001"
      style={{ "--active-step": activeStep } as CSSProperties}
    >
      <div className="mission-001-moon-glow" aria-hidden="true" />
      <img src={moonImage} className="mission-001-moon" alt="" aria-hidden="true" />
      <motion.div
        className="mission-001-content"
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.38 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mission-001-copy">
          <p className="mission-001-label">MISSÃO 001</p>
          <h2 id="mission-001-title">
            <ScrambleText text="Toda operação deixa" scrambleOnScroll />
            <br />
            <span>
              <ScrambleText text="sinais antes de" scrambleOnScroll />
            </span>
            <br />
            <ScrambleText text="atingir seu limite." scrambleOnScroll />
          </h2>
          <p className="mission-001-subtitle">
            <ScrambleText text="Processos lentos, retrabalho, sistemas desconectados" scrambleOnScroll />
            <br />
            <ScrambleText text="e falta de visibilidade são sintomas de uma operação que precisa evoluir." scrambleOnScroll />
          </p>
        </div>

        <div className="mission-001-system" aria-label="Maturidade Operacional">
          <div className="mission-001-system-label">CICLO DE EVOLUÇÃO</div>
          
          <div className="mission-001-rail" aria-hidden="true">
            {missionSteps.map((step, index) => (
              <span className={activeStep === index ? "is-selected" : ""} key={step.title} />
            ))}
          </div>

          <div className="mission-001-list">
            {missionSteps.map((step, index) => (
              <button
                className={activeStep === index ? "mission-001-row is-selected" : "mission-001-row"}
                key={step.title}
                type="button"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                onFocus={() => setHoveredStep(index)}
                onBlur={() => setHoveredStep(null)}
                onClick={() => {
                  setSelectedMissionOption(index);
                  setIsCardOpen(true);
                }}
              >
                <div className="mission-001-row-text">
                  <span className="row-title">{step.title}</span>
                  <span className="row-desc">{step.timelineDescription}</span>
                </div>
                <span aria-hidden="true">+</span>
                {activeStep === index && (
                  <svg className="mission-001-row-connector" viewBox="0 -112 96 244" aria-hidden="true">
                    <defs>
                      <marker
                        id={`mission-arrow-${index}`}
                        markerHeight="8"
                        markerWidth="8"
                        orient="auto"
                        refX="6"
                        refY="4"
                        viewBox="0 0 8 8"
                      >
                        <path d="M 1 1 L 7 4 L 1 7" />
                      </marker>
                    </defs>
                    <motion.path
                      d={
                        [
                          "M 0 12 C 36 12, 30 58, 54 58 C 72 58, 76 48, 96 48",
                          "M 0 12 C 36 12, 40 32, 58 32 C 76 32, 80 25, 96 25",
                          "M 0 12 C 36 12, 40 -24, 58 -24 C 76 -24, 80 -12, 96 -12",
                          "M 0 12 C 36 12, 30 -68, 54 -68 C 72 -68, 76 -44, 96 -44",
                        ][index]
                      }
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
                      markerEnd={`url(#mission-arrow-${index})`}
                    />
                  </svg>
                )}
                {index < missionSteps.length - 1 && <i aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>

        {showCard && active && (
          <motion.aside
            className="mission-scan-card"
            key={active.label}
            initial={{ opacity: 0, x: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            aria-live="polite"
          >
            <div className="active-card-glow" />
            <BorderBeam
              size={240}
              duration={12}
              borderWidth={1.2}
              colorFrom="#b764ff"
              colorTo="#a9d5ff"
            />

            <div className="mission-scan-topline">
              <span>{active.scanLabel}</span>
              <span className="status-badge badge-active">
                <span className="pulse-dot" />
                ACTIVE
              </span>
            </div>
            <h3>{active.label}</h3>
            <p>{active.description}</p>

            <div className="mission-scan-metrics-grid">
              {active.metrics.map((metric) => (
                <div key={metric} className="metric-tag">
                  <span className="bullet">/</span>
                  <span>{metric}</span>
                </div>
              ))}
            </div>

            <div className="mission-scan-footer">
              <div>
                <span>Tempo médio:</span>
                <strong>{active.time}</strong>
              </div>
              <div>
                <span>Entrega:</span>
                <strong>
                  {active.delivery.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </strong>
              </div>
            </div>
          </motion.aside>
        )}

      </motion.div>
    </section>
  );
}
