import { useState, useEffect, useRef } from "react";
import { TerminalFeedback, LogEntry } from "./TerminalFeedback";
import { ProgressTracker } from "./ProgressTracker";
import { QuestionCard, Option } from "./QuestionCard";
import { StepContainer } from "./StepContainer";
import { AnalysisScreen } from "./AnalysisScreen";
import { FinalReportScreen } from "./FinalReportScreen";
import { BootScreen } from "./BootScreen";
import { IdentitySyncCard } from "./IdentitySyncCard";
import logoMark from "../../assets/alienxip-logo-mark-purple.png";
import "./diagnostic.css";

interface DiagnosticSystemProps {
  onClose: () => void;
}

// Drifting Space Star Particles with 3D depth Parallax
function SpaceParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      depth: number;
      opacity: number;
      baseOpacity: number;
      speedY: number;
    }> = [];

    // Create 50 subtle drifting background star particles
    for (let i = 0; i < 50; i++) {
      const baseOpacity = Math.random() * 0.25 + 0.05;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.3 + 0.3,
        depth: Math.random() * 16 + 4, // 3D depth factor
        opacity: baseOpacity,
        baseOpacity,
        speedY: -(Math.random() * 0.06 + 0.02), // very slow drift upward
      });
    }

    const resize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Interpolate position inside the draw loop
      const dx = targetMouseRef.current.x - mouseRef.current.x;
      const dy = targetMouseRef.current.y - mouseRef.current.y;
      mouseRef.current.x += dx * 0.08;
      mouseRef.current.y += dy * 0.08;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Parallax drift based on depth
        const offsetX = mouseRef.current.x * p.depth;
        const offsetY = mouseRef.current.y * p.depth;

        let drawX = p.x + offsetX;
        let drawY = p.y + offsetY;

        // Wrap around edge boundaries
        if (drawX < 0) drawX = w + (drawX % w);
        if (drawX > w) drawX = drawX % w;
        if (drawY < 0) drawY = h + (drawY % h);
        if (drawY > h) drawY = drawY % h;

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        
        // Twinkling animation effect
        const twinkling = Math.sin(Date.now() * 0.0015 + i) * 0.06;
        ctx.fillStyle = `rgba(185, 92, 255, ${Math.max(0.02, p.baseOpacity + twinkling)})`;
        ctx.fill();

        // Slow upward drift
        p.y += p.speedY;
        if (p.y < 0) {
          p.y = h;
          p.x = Math.random() * w;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

const stepsInfo = [
  { title: "Identificação", subtitle: "Assinatura de Órbita" },
  { title: "Alinhamento", subtitle: "Foco Estratégico" },
  { title: "Gravitação", subtitle: "Fricção Crítica" },
  { title: "Combustível", subtitle: "Aceleração de Impulso" },
  { title: "Dobra", subtitle: "Prontidão de Escala" },
];

export function DiagnosticSystem({ onClose }: DiagnosticSystemProps) {
  const [phase, setPhase] = useState<"BOOT" | "QUESTIONS" | "ANALYSIS" | "REPORT">("BOOT");
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([
    { text: "INICIANDO PROTOCOLO ALIENXIP...", type: "system" },
  ]);
  const [answers, setAnswers] = useState<{
    name?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    segment?: string;
    focus?: string;
    bottlenecks?: string[];
    budget?: string;
    timeline?: string;
  }>({});

  const backdropRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  // Parallax Direct DOM Update (no React re-renders)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const updateTransforms = () => {
      const dx = targetMouseRef.current.x - mouseRef.current.x;
      const dy = targetMouseRef.current.y - mouseRef.current.y;
      
      mouseRef.current.x += dx * 0.08;
      mouseRef.current.y += dy * 0.08;

      if (backdropRef.current) {
        backdropRef.current.style.transform = `translate3d(${mouseRef.current.x * 12}px, ${mouseRef.current.y * 12}px, 0)`;
      }
      if (dashboardRef.current) {
        dashboardRef.current.style.transform = `translate3d(${mouseRef.current.x * -6}px, ${mouseRef.current.y * -6}px, 0)`;
      }

      animId = requestAnimationFrame(updateTransforms);
    };

    animId = requestAnimationFrame(updateTransforms);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Prevent scroll during diagnostic
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Boot sequence animation with robust bounds check
  useEffect(() => {
    if (phase !== "BOOT") return;

    const bootLogs: LogEntry[] = [
      { text: "Conexão estabelecida com a ponte de comando.", type: "normal" },
      { text: "Carregando sensores de telemetria orbital...", type: "normal" },
      { text: "Matriz de análise quântica online [OK]", type: "success" },
      { text: "Sincronizando com a nave-mãe AlienXIP...", type: "normal" },
      { text: "Aguardando assinatura de órbita do usuário...", type: "warning" },
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        const nextLog = bootLogs[currentLog];
        if (nextLog) {
          setLogs((prev) => [...prev, nextLog]);
        }
        currentLog++;
      }
      
      if (currentLog >= bootLogs.length) {
        clearInterval(interval);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [phase]);

  const addLog = (text: string, type?: "system" | "success" | "warning" | "normal") => {
    setLogs((prev) => [...prev, { text, type }]);
  };

  const handleSelectChange = (field: keyof typeof answers, val: string, label: string) => {
    setAnswers((prev) => ({ ...prev, [field]: val }));
    
    // Add logs dynamically reflecting user choice
    if (field === "focus") {
      addLog(`Vetor estratégico alinhado: ${label.toUpperCase()}`, "success");
    } else if (field === "budget") {
      addLog(`Impulso de combustível ajustado para: ${label}`, "success");
    } else if (field === "timeline") {
      addLog(`Prontidão configurada: ${label.toUpperCase()}`, "success");
      addLog("Iniciando cruzamento final de telemetria...", "system");
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      if (currentStep === 0) {
        addLog(`Identidade corporativa registrada: ${(answers.companyName || "Tripulação").toUpperCase()}`, "success");
        addLog(`Tripulante: ${(answers.name || "Ninguém").toUpperCase()} | Segmento: ${(answers.segment || "Outro").toUpperCase()}`, "normal");
      } else if (currentStep === 1) {
        addLog(`Vetor de missão estabelecido: ${(focusOptions.find((o) => o.value === answers.focus)?.label || "").toUpperCase()}`, "success");
        addLog(`Buscando leituras operacionais preliminares...`, "system");
      } else if (currentStep === 2) {
        addLog(`Varredura concluída. Sintomas isolados: ${(answers.bottlenecks || []).join(", ").toUpperCase()}`, "warning");
        addLog(`Verificando integridade de atalhos operacionais...`, "system");
      }
      setCurrentStep(currentStep + 1);
    } else {
      setPhase("ANALYSIS");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const focusOptions: Option[] = [
    { value: "aumentar_vendas", label: "Aumentar vendas" },
    { value: "automatizar_processos", label: "Automatizar processos" },
    { value: "criar_sistema", label: "Criar sistema próprio" },
    { value: "implantar_ia", label: "Implantar IA" },
    { value: "melhorar_atendimento", label: "Melhorar atendimento" },
    { value: "escalar_operacao", label: "Escalar operação" },
    { value: "organizar_processos", label: "Organizar processos" },
    { value: "outro", label: "Outro" },
  ];

  const signalsOptions: Option[] = [
    { value: "processos_manuais", label: "Processos manuais" },
    { value: "planilhas_excessivas", label: "Planilhas excessivas" },
    { value: "retrabalho", label: "Retrabalho" },
    { value: "falta_integracao", label: "Falta de integração" },
    { value: "atendimento_lento", label: "Atendimento lento" },
    { value: "comercial_desorganizado", label: "Comercial desorganizado" },
    { value: "falta_indicadores", label: "Falta de indicadores" },
    { value: "falta_automacao", label: "Falta de automação" },
    { value: "ausencia_ia", label: "Ausência de IA" },
    { value: "sistemas_antigos", label: "Sistemas antigos" },
    { value: "crescimento_sem_estrutura", label: "Crescimento sem estrutura" },
  ];

  const budgetOptions: Option[] = [
    { value: "low", label: "Abaixo de R$ 10.000 / mês", desc: "Tração inicial e validação de quadrante." },
    { value: "mid", label: "Entre R$ 10.000 e R$ 30.000 / mês", desc: "Escala moderada e otimização de velocidade." },
    { value: "high", label: "Entre R$ 30.000 e R$ 100.000 / mês", desc: "Aceleração agressiva e expansão de mercado." },
    { value: "max", label: "Acima de R$ 100.000 / mês", desc: "Operação corporativa de alta potência." },
  ];

  const timelineOptions: Option[] = [
    { value: "now", label: "Imediato", desc: "Rota de colisão estratégica (Necessidade de ação urgente)." },
    { value: "short", label: "Curto prazo (1 a 3 meses)", desc: "Planejamento estruturado de transição." },
    { value: "mid", label: "Médio prazo", desc: "Alinhamento tático de processos." },
    { value: "map", label: "Apenas mapeando", desc: "Estudos exploratórios de viabilidade espacial." },
  ];

  return (
    <div className="diagnostic-overlay">
      {/* Drifting Space Particles with 3D Parallax */}
      <SpaceParticlesBackground />
      
      {/* Background Grids with Slow Parallax */}
      <div 
        ref={backdropRef}
        className="diagnostic-backdrop" 
        style={{ 
          transition: "transform 0.1s ease-out" 
        }} 
      />
      <div className="diagnostic-scanline" />

      <header className="diagnostic-hud-header">
        <div className="hud-title-wrap">
          <img src={logoMark} alt="ALIENXIP" />
          <h1>Protocolo XIP</h1>
        </div>
        <div className="hud-status-node">
          <span className="hud-status-indicator" />
          <span>LINK_ESTÁVEL: COMANDANTE_GATEWAY</span>
        </div>
        <button className="hud-exit-btn" onClick={onClose}>
          Abortar Missão
        </button>
      </header>

      <div 
        ref={dashboardRef}
        className="diagnostic-dashboard"
        style={{ 
          transition: "transform 0.15s ease-out"
        }}
      >
        <div className="diagnostic-workstation">
          {phase === "BOOT" && (
            <BootScreen onComplete={() => setPhase("QUESTIONS")} />
          )}

          {phase === "QUESTIONS" && (
            <>
              <ProgressTracker
                currentStep={currentStep}
                totalSteps={5}
                stepsInfo={stepsInfo}
              />
              <StepContainer currentStepId={currentStep}>
                {currentStep === 0 && (
                  <IdentitySyncCard
                    value={{
                      name: answers.name || "",
                      companyName: answers.companyName || "",
                      email: answers.email || "",
                      phone: answers.phone || "",
                      segment: answers.segment || "",
                    }}
                    onChange={(data) => {
                      setAnswers((prev) => ({ ...prev, ...data }));
                    }}
                    onNext={nextStep}
                  />
                )}

                {currentStep === 1 && (
                  <QuestionCard
                    sector="SETOR BETA-2"
                    question="Qual é a principal missão da sua empresa neste momento?"
                    description="Selecione a diretriz central que orienta seus esforços atuais."
                    type="select"
                    options={focusOptions}
                    value={answers.focus}
                    onChange={(val) => {
                      const label = focusOptions.find((o) => o.value === val)?.label || "";
                      handleSelectChange("focus", val, label);
                    }}
                    onNext={nextStep}
                    onPrev={prevStep}
                    canPrev={true}
                    canNext={!!answers.focus}
                    nextLabel="GERAR LEITURA PRELIMINAR →"
                  />
                )}

                {currentStep === 2 && (
                  <QuestionCard
                    sector="SETOR GAMA-3"
                    question="Quais sinais sua operação apresenta atualmente?"
                    description="Selecione todos os sintomas ativos na telemetria operacional."
                    type="multiselect"
                    options={signalsOptions}
                    value={answers.bottlenecks || []}
                    onChange={(val) => {
                      setAnswers((prev) => ({ ...prev, bottlenecks: val }));
                      addLog(`Telemetria atualizada: ${val.length} sinais marcados.`, "normal");
                    }}
                    onNext={nextStep}
                    onPrev={prevStep}
                    canPrev={true}
                    canNext={!!answers.bottlenecks && answers.bottlenecks.length > 0}
                    nextLabel="CONTINUAR VARREDURA →"
                  />
                )}

                {currentStep === 3 && (
                  <QuestionCard
                    sector="SETOR DELTA-4"
                    question="Qual o seu orçamento mensal de propulsão (Mídia/Crescimento)?"
                    description="Para atingir a velocidade de escape, selecione a faixa de investimentos mensais."
                    type="select"
                    options={budgetOptions}
                    value={answers.budget}
                    onChange={(val) => {
                      const label = budgetOptions.find((o) => o.value === val)?.label || "";
                      handleSelectChange("budget", val, label);
                    }}
                    onNext={nextStep}
                    onPrev={prevStep}
                    canPrev={true}
                    canNext={!!answers.budget}
                  />
                )}

                {currentStep === 4 && (
                  <QuestionCard
                    sector="SETOR EPSILON-5"
                    question="Qual o horizonte para ativação do motor de dobra?"
                    description="Quando sua operação precisa de aceleração e docking estratégico completo?"
                    type="select"
                    options={timelineOptions}
                    value={answers.timeline}
                    onChange={(val) => {
                      const label = timelineOptions.find((o) => o.value === val)?.label || "";
                      handleSelectChange("timeline", val, label);
                    }}
                    onNext={nextStep}
                    onPrev={prevStep}
                    canPrev={true}
                    canNext={!!answers.timeline}
                  />
                )}
              </StepContainer>
            </>
          )}

          {phase === "ANALYSIS" && (
            <AnalysisScreen onComplete={() => setPhase("REPORT")} />
          )}

          {phase === "REPORT" && (
            <FinalReportScreen answers={answers} onClose={onClose} />
          )}
        </div>

        {phase !== "REPORT" && (
          <TerminalFeedback logs={logs} />
        )}
      </div>
    </div>
  );
}
