import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sendDiagnosticTransmission } from "./integrationService";

interface FinalReportScreenProps {
  answers: {
    name?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    segment?: string;
    focus?: string;
    focusOther?: string;
    bottlenecks?: string[];
    bottlenecksOther?: string;
    budget?: string;
    timeline?: string;
  };
  onClose: () => void;
}

export function FinalReportScreen({ answers, onClose }: FinalReportScreenProps) {
  const [sendStatus, setSendStatus] = useState<"sending" | "sent" | "error">("sending");

  // Calculate results based on inputs
  const companyName = answers.companyName || "Sua Operação";
  const focus = answers.focus || "aumentar_vendas";
  const bottlenecks = answers.bottlenecks || [];
  const budget = answers.budget || "< R$ 10k/mês";
  const timeline = answers.timeline || "Imediato";

  // Score computation (Maturity level)
  let maturityScore = 88;
  const bottlenecksCount = bottlenecks.length;
  maturityScore -= bottlenecksCount * 6;
  if (budget === "low") maturityScore -= 12;
  if (budget === "mid") maturityScore -= 5;
  if (timeline === "map") maturityScore -= 6;
  maturityScore = Math.max(25, Math.min(maturityScore, 95));

  // Gargalos Detectados
  const detectedCount = Math.max(1, bottlenecksCount);

  // Áreas Críticas
  const criticalAreas: string[] = [];
  if (
    bottlenecks.includes("processos_manuais") ||
    bottlenecks.includes("planilhas_excessivas") ||
    bottlenecks.includes("falta_automacao") ||
    bottlenecks.includes("ausencia_ia")
  ) {
    criticalAreas.push("PROCESSOS");
  }
  if (bottlenecks.includes("comercial_desorganizado") || bottlenecks.includes("retrabalho")) {
    criticalAreas.push("COMERCIAL");
  }
  if (bottlenecks.includes("atendimento_lento")) {
    criticalAreas.push("ATENDIMENTO");
  }
  if (bottlenecks.includes("falta_integracao") || bottlenecks.includes("sistemas_antigos")) {
    criticalAreas.push("TECNOLOGIA");
  }
  if (bottlenecks.includes("falta_indicadores") || bottlenecks.includes("crescimento_sem_estrutura")) {
    criticalAreas.push("GESTÃO");
  }
  if (criticalAreas.length === 0) {
    criticalAreas.push("PROCESSOS");
  }

  // Potencial de Automação
  let automationPotential = "BAIXO";
  if (
    bottlenecks.includes("processos_manuais") ||
    bottlenecks.includes("falta_automacao") ||
    bottlenecks.includes("ausencia_ia")
  ) {
    automationPotential = "ALTO";
  } else if (bottlenecks.length >= 2) {
    automationPotential = "MÉDIO";
  }

  // Final score & gauges
  let score = maturityScore;

  let technicalFriction = 40;
  if (
    bottlenecks.includes("processos_manuais") ||
    bottlenecks.includes("falta_automacao") ||
    bottlenecks.includes("sistemas_antigos") ||
    focus === "criar_sistema" ||
    focus === "automatizar_processos"
  ) {
    technicalFriction = 82;
  } else if (bottlenecks.includes("retrabalho") || bottlenecks.includes("planilhas_excessivas")) {
    technicalFriction = 62;
  }

  let salesVelocity = 65;
  if (budget === "< R$ 10k/mês") {
    salesVelocity = 35;
  } else if (budget === "R$ 10k - 30k/mês") {
    salesVelocity = 52;
  } else if (budget === "> R$ 100k/mês") {
    salesVelocity = 88;
  }
  if (bottlenecks.includes("comercial_desorganizado") || bottlenecks.includes("atendimento_lento")) {
    salesVelocity -= 15;
  }

  let brandDifferentiation = 60;
  if (focus === "criar_sistema" || focus === "automatizar_processos") {
    brandDifferentiation = 50;
  } else if (focus === "aumentar_vendas" || focus === "escalar_operacao") {
    brandDifferentiation = 74;
  }
  if (bottlenecks.includes("crescimento_sem_estrutura")) {
    brandDifferentiation -= 20;
  }

  // Animated score counter
  const [animatedScore, setAnimatedScore] = useState(0);
  const reportSummary =
    score < 50
      ? "GRAVITAÃ‡ÃƒO INSTÃVEL: Sua empresa estÃ¡ perdendo energia estratÃ©gica."
      : score < 75
        ? "Ã“RBITA INTERMEDIÃRIA: Escala parcial, mas hÃ¡ vazamento de trÃ¡fego."
        : "ESTABILIDADE INTERGALÃCTICA: Alto Ã­ndice de conversÃ£o e alinhamento.";

  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1200; // 1.2s count up duration
    const stepTime = Math.max(15, Math.floor(duration / end));
    
    const timer = setInterval(() => {
      start += 1;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Recommendations
  const getTechRec = () => {
    if (technicalFriction > 70) {
      return "Sua infraestrutura técnica apresenta lentidão crítica. Otimize seus Core Web Vitals e remova redundâncias de código.";
    }
    return "Sua estabilidade tecnológica está boa. Foque em caching distribuído e segurança de dados.";
  };

  const getSalesRec = () => {
    if (salesVelocity < 50) {
      return "Sua taxa de aquisição está limitada por orçamento ou conversão. Direcione campanhas a nichos específicos de alta conversão.";
    }
    return "O volume de leads é consistente, porém estruture filtros de qualificação para não sobrecarregar sua equipe.";
  };

  const getBrandRec = () => {
    if (brandDifferentiation < 50) {
      return "A falta de posicionamento único está diluindo o valor percebido. Reposicione seu discurso corporativo urgente.";
    }
    return "Boa percepção de marca. Continue consolidando depoimentos e provas sociais no fundo do funil.";
  };

  const recommendations = [getTechRec(), getSalesRec(), getBrandRec()];

  useEffect(() => {
    const transmitReport = async () => {
      const hasRequiredContact =
        !!answers.name?.trim() &&
        !!answers.phone?.trim() &&
        !!answers.email?.trim();

      if (!hasRequiredContact) {
        setSendStatus("error");
        return;
      }

      try {
        await Promise.all([
          sendDiagnosticTransmission({
            answers,
            metrics: {
              score,
              technicalFriction,
              salesVelocity,
              brandDifferentiation,
              automationPotential,
              criticalAreas,
            },
            report: {
              companyName,
              recommendations,
              summary: reportSummary,
            },
          }),
          new Promise((resolve) => window.setTimeout(resolve, 900)),
        ]);
        setSendStatus("sent");
      } catch {
        setSendStatus("error");
      }
    };

    transmitReport();
  }, [answers]);

  const reportSent = true;

  return (
    <div className="report-screen">
      <div className="report-header-section">
        <h2 
          className="question-text" 
          style={{ fontSize: "24px", color: "#b95cff", textShadow: "0 0 15px rgba(157, 24, 255, 0.4)" }}
        >
          {reportSent ? "RELATÓRIO DE TELEMETRIA: " : "VARREDURA PRELIMINAR CONCLUÍDA: "}
          {companyName.toUpperCase()}
        </h2>
        <p className="question-description" style={{ marginTop: "6px" }}>
          {reportSent 
            ? "Cruzamento estratégico concluído com o quadrante XIP. Plano operacional destravado abaixo."
            : "Análise preliminar estruturada. O relatório está sendo transmitido automaticamente para nossa central."}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <>
            <motion.div 
              className="report-score-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <span className="report-score-label">Eficiência Orbital Geral</span>
              <div className="report-score-value">{animatedScore}%</div>
              <span className="question-description" style={{ fontSize: "12px" }}>
                {score < 50 
                  ? "GRAVITAÇÃO INSTÁVEL: Sua empresa está perdendo energia estratégica."
                  : score < 75 
                    ? "ÓRBITA INTERMEDIÁRIA: Escala parcial, mas há vazamento de tráfego."
                    : "ESTABILIDADE INTERGALÁCTICA: Alto índice de conversão e alinhamento."}
              </span>
            </motion.div>

            <div className="report-gauges-grid">
              <div className="report-gauge-card">
                <div className="gauge-card-info">
                  <span className="gauge-title">Atrito Técnico (Fricção)</span>
                  <span className="gauge-percentage">{technicalFriction}%</span>
                </div>
                <div className="gauge-bar-outer">
                  <motion.div 
                    className="gauge-bar-inner" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${technicalFriction}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              <div className="report-gauge-card">
                <div className="gauge-card-info">
                  <span className="gauge-title">Velocidade de Escala (Vendas)</span>
                  <span className="gauge-percentage">{salesVelocity}%</span>
                </div>
                <div className="gauge-bar-outer">
                  <motion.div 
                    className="gauge-bar-inner" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${salesVelocity}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              <div className="report-gauge-card">
                <div className="gauge-card-info">
                  <span className="gauge-title">Resistência de Marca</span>
                  <span className="gauge-percentage">{brandDifferentiation}%</span>
                </div>
                <div className="gauge-bar-outer">
                  <motion.div 
                    className="gauge-bar-inner" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${brandDifferentiation}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </div>

            <motion.div 
              className="report-recommendations"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="rec-title">AÇÕES CRÍTICAS DE FASE</h3>
              <ul className="rec-list">
                <motion.li className="rec-item" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <span className="rec-item-dot">[1]</span>
                  <span>{getTechRec()}</span>
                </motion.li>
                <motion.li className="rec-item" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                  <span className="rec-item-dot">[2]</span>
                  <span>{getSalesRec()}</span>
                </motion.li>
                <motion.li className="rec-item" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                  <span className="rec-item-dot">[3]</span>
                  <span>{getBrandRec()}</span>
                </motion.li>
              </ul>
            </motion.div>
          </>
      </div>

      <div className="docking-form-box">
        <div 
          className="transmission-status-panel"
          data-status={sendStatus}
        >
          {sendStatus === "sending" ? (
            <>
              <div className="transmission-loader" aria-hidden="true" />
              <h3 className="docking-title" style={{ color: "#b95cff", fontSize: "18px", letterSpacing: "0.2em", margin: 0 }}>
                TRANSMITINDO RELATÓRIO
              </h3>
              <div className="transmission-status-badge">
                ENVIO AUTOMÁTICO EM CURSO
              </div>
            </>
          ) : sendStatus === "sent" ? (
            <>
            <div 
              style={{ 
                width: "60px", 
                height: "60px", 
                borderRadius: "50%", 
                background: "rgba(0, 255, 170, 0.1)", 
                border: "1px solid #00ffaa", 
                display: "grid", 
                placeItems: "center",
                boxShadow: "0 0 20px rgba(0, 255, 170, 0.2)",
                marginBottom: "8px"
              }}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#00ffaa" 
                strokeWidth="2.5" 
                style={{ width: "28px", height: "28px" }}
              >
                <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="docking-title" style={{ color: "#00ffaa", fontSize: "18px", letterSpacing: "0.2em", margin: 0 }}>
              TRANSMISSÃO RECEBIDA
            </h3>
            <div 
              style={{ 
                fontFamily: "'Share Tech Mono', monospace", 
                fontSize: "11px", 
                color: "#00ffaa", 
                border: "1px solid rgba(0, 255, 170, 0.3)", 
                background: "rgba(0, 255, 170, 0.05)", 
                padding: "4px 12px", 
                borderRadius: "3px",
                letterSpacing: "0.08em",
                textShadow: "0 0 8px rgba(0, 255, 170, 0.3)",
                display: "inline-block"
              }}
            >
              OPERAÇÃO REGISTRADA COM SUCESSO
            </div>
            <p className="question-description" style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", letterSpacing: "0.05em", margin: "4px 0" }}>
              RETORNO EM BREVE
            </p>
            <motion.button 
              className="ctrl-btn ctrl-btn-primary" 
              style={{ marginTop: "16px", width: "100%", justifyContent: "center" }} 
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Voltar para a Terra
            </motion.button>
            </>
          ) : (
            <>
              <div className="transmission-error-icon" aria-hidden="true">!</div>
              <h3 className="docking-title" style={{ color: "#ffaa00", fontSize: "18px", letterSpacing: "0.2em", margin: 0 }}>
                FALHA NA TRANSMISSÃO
              </h3>
              <div className="transmission-status-badge error">
                RELATÓRIO NÃO ENVIADO
              </div>
              <p className="question-description transmission-status-copy">
                Não foi possível concluir o envio automático. Revise a configuração do endpoint de e-mail e tente gerar o diagnóstico novamente.
              </p>
            </>
          )}

          {sendStatus === "error" && (
            <motion.button
              className="ctrl-btn ctrl-btn-primary" 
              style={{ marginTop: "12px", width: "100%", justifyContent: "center" }}
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Voltar para a Terra
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
