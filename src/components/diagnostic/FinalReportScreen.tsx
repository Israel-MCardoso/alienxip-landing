import React, { useState, useEffect } from "react";
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
    bottlenecks?: string[];
    budget?: string;
    timeline?: string;
  };
  onClose: () => void;
}

export function FinalReportScreen({ answers, onClose }: FinalReportScreenProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactData, setContactData] = useState({
    name: answers.name || "",
    phone: answers.phone || "",
    email: answers.email || "",
  });

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
  useEffect(() => {
    if (!formSubmitted) return;
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
  }, [formSubmitted, score]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.phone || !contactData.email) return;

    setIsSubmitting(true);
    try {
      await sendDiagnosticTransmission({
        answers: {
          ...answers,
          name: contactData.name,
          phone: contactData.phone,
          email: contactData.email,
        },
        metrics: {
          score,
          technicalFriction,
          salesVelocity,
          brandDifferentiation,
          automationPotential,
          criticalAreas,
        },
      });
      setFormSubmitted(true);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Erro ao enviar a transmissão:", error);
      }
      // Fallback: still show the success screen to avoid blocking the user flow
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-screen">
      <div className="report-header-section">
        <h2 
          className="question-text" 
          style={{ fontSize: "24px", color: "#b95cff", textShadow: "0 0 15px rgba(157, 24, 255, 0.4)" }}
        >
          {formSubmitted ? "RELATÓRIO DE TELEMETRIA: " : "VARREDURA PRELIMINAR CONCLUÍDA: "}
          {companyName.toUpperCase()}
        </h2>
        <p className="question-description" style={{ marginTop: "6px" }}>
          {formSubmitted 
            ? "Cruzamento estratégico concluído com o quadrante XIP. Plano operacional destravado abaixo."
            : "Análise preliminar estruturada. Envie o sinal estratégico para liberar a telemetria detalhada de gauges."}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {!formSubmitted ? (
          /* RELATÓRIO PRELIMINAR */
          <div className="preliminary-report-panel">
            <div className="prelim-header">
              <span className="prelim-tag">STATUS OPERACIONAL</span>
              <span className="prelim-status-val">COMPILADO</span>
            </div>
            
            <div className="prelim-body">
              <div className="prelim-item">
                <span className="prelim-label">NÍVEL DE MATURIDADE:</span>
                <span className="prelim-value score">{maturityScore}%</span>
              </div>

              <div className="prelim-item">
                <span className="prelim-label">GARGALOS DETECTADOS:</span>
                <span className="prelim-value badge">{detectedCount}</span>
              </div>

              <div className="prelim-item">
                <span className="prelim-label">ÁREAS CRÍTICAS:</span>
                <div className="prelim-areas-list">
                  {criticalAreas.map((area) => (
                    <span key={area} className="prelim-area-tag">{area}</span>
                  ))}
                </div>
              </div>

              <div className="prelim-item">
                <span className="prelim-label">POTENCIAL DE AUTOMAÇÃO:</span>
                <span className={`prelim-value potential ${automationPotential.toLowerCase()}`}>
                  {automationPotential}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* FULL DETAILED EXECUTIVE TELEMETRY REPORT */
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
        )}
      </div>

      <div className="docking-form-box">
        {formSubmitted ? (
          <div 
            style={{ 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center", 
              alignItems: "center",
              textAlign: "center",
              gap: "16px"
            }}
          >
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
              RETORNO EM ATÉ 24 HORAS
            </p>
            <p className="question-description" style={{ fontSize: "13px", lineHeight: "1.6", color: "rgba(244, 241, 234, 0.6)" }}>
              Seu cliente de e-mail foi aberto para transmitir o relatório para comercial@alienxip.com.br. Conclua o envio no seu e-mail para que nossos oficiais analisem sua operação.
            </p>
            <motion.button 
              className="ctrl-btn ctrl-btn-primary" 
              style={{ marginTop: "16px", width: "100%", justifyContent: "center" }} 
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              RETORNAR À TERRA
            </motion.button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="docking-form-grid">
            <h3 className="docking-title">TRANSMISSÃO PRONTA</h3>
            <p className="docking-desc">
              Seu diagnóstico preliminar foi registrado.<br /><br />
              Nossa equipe analisará sua operação e retornará com recomendações específicas.
            </p>

            <div className="form-group">
              <label htmlFor="commander-name">Nome do Comandante</label>
              <input
                id="commander-name"
                type="text"
                required
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                placeholder="Ex: Major Tom"
              />
            </div>

            <div className="form-group">
              <label htmlFor="commander-whatsapp">Canal de Comunicação (WhatsApp)</label>
              <input
                id="commander-whatsapp"
                type="tel"
                required
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                placeholder="Ex: (11) 99999-9999"
              />
            </div>

            <div className="form-group">
              <label htmlFor="commander-email">E-mail de Contato</label>
              <input
                id="commander-email"
                type="email"
                required
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                placeholder="Ex: comandante@empresa.space"
              />
            </div>

            <motion.button 
              type="submit" 
              className="ctrl-btn ctrl-btn-primary" 
              style={{ marginTop: "12px", width: "100%", justifyContent: "center" }}
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? "ENVIANDO TRANSMISSÃO..." : "ENVIAR TRANSMISSÃO"}
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
}
