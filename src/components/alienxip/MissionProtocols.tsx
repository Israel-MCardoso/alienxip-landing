import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ScrambleText } from "../ui/ScrambleText";

type Protocol = {
  id: string;
  title: string;
  description: string;
  indicator: string;
  status: string;
};

const protocols: Protocol[] = [
  {
    id: "001",
    title: "Diagnóstico antes da implementação",
    description: "Nenhuma solução é proposta antes da compreensão completa da operação.",
    indicator: "SCAN REQUIRED",
    status: "ATIVO"
  },
  {
    id: "002",
    title: "Tecnologia compatível com o negócio",
    description: "Cada sistema, automação ou integração é planejado para o contexto real da empresa.",
    indicator: "COMPATIBILITY VERIFIED",
    status: "ATIVO"
  },
  {
    id: "003",
    title: "Escalabilidade desde o início",
    description: "As soluções são projetadas para crescer junto com a operação.",
    indicator: "GROWTH READY",
    status: "ATIVO"
  },
  {
    id: "004",
    title: "Evolução contínua",
    description: "O lançamento não encerra a missão. A melhoria contínua faz parte da operação.",
    indicator: "ORBIT STABLE",
    status: "ATIVO"
  }
];

export function MissionProtocols() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHover, setActiveHover] = useState<number | null>(null);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time nicely
      const pad = (n: number) => String(n).padStart(2, "0");
      const yyyy = now.getFullYear();
      const mm = pad(now.getMonth() + 1);
      const dd = pad(now.getDate());
      const hh = pad(now.getHours());
      const min = pad(now.getMinutes());
      const sec = pad(now.getSeconds());
      setTime(`${yyyy}-${mm}-${dd} ${hh}:${min}:${sec} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="mission-006"
      id="sobre"
      aria-labelledby="mission-006-title"
      data-orbital-sector="007"
    >
      <div className="mission-006-container">
        {/* Background Dot Grid for Section */}
        <div className="mission-006-grid-background" aria-hidden="true" />
        
        <motion.header 
          className="mission-006-header"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mission-006-label">MISSÃO 007</p>
          <h2 id="mission-006-title">
            <ScrambleText text="Nem toda tecnologia" scrambleOnScroll />
            <br />
            <ScrambleText text="gera " scrambleOnScroll />
            <span className="purple-highlight">
              <ScrambleText text="evolução." scrambleOnScroll />
            </span>
          </h2>
          <p className="mission-006-subtitle">
            Por isso seguimos protocolos próprios para garantir que cada operação receba uma solução compatível com sua realidade.
          </p>
        </motion.header>

        <div className="mission-006-protocols-list" ref={containerRef}>
          {protocols.map((protocol, index) => (
            <motion.div
              key={protocol.id}
              className={`protocol-row ${activeHover === index ? "is-hovered" : ""}`}
              onMouseEnter={() => setActiveHover(index)}
              onMouseLeave={() => setActiveHover(null)}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Corner crosshairs for tactical docket look */}
              <div className="corner-crosshair top-left">+</div>
              <div className="corner-crosshair top-right">+</div>
              <div className="corner-crosshair bottom-left">+</div>
              <div className="corner-crosshair bottom-right">+</div>

              <div className="protocol-meta">
                <span className="protocol-id">[ P-{protocol.id} ]</span>
                <span className="protocol-status">
                  <span className="status-dot" />
                  STATUS: {protocol.status}
                </span>
              </div>

              <div className="protocol-info">
                <h3>{protocol.title}</h3>
                <p>{protocol.description}</p>
              </div>

              <div className="protocol-indicator">
                <span className="indicator-label">{protocol.indicator}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Elemento de Autoridade - Painel Operacional */}
        <motion.div 
          className="mission-006-panel"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="panel-header">
            <span className="panel-title">TERMINAL OPERACIONAL // PROTOCOLOS DE SEGURANÇA</span>
            <span className="panel-time">{time}</span>
          </div>
          <div className="panel-body">
            <div className="terminal-line">
              <span className="label">PROTOCOLOS ATIVOS</span>
              <span className="dots">....................................................................</span>
              <span className="value text-purple">04</span>
            </div>
            <div className="terminal-line">
              <span className="label">METODOLOGIA PRÓPRIA</span>
              <span className="dots">....................................................................</span>
              <span className="value text-purple">SIM</span>
            </div>
            <div className="terminal-line">
              <span className="label">SOLUÇÕES PERSONALIZADAS</span>
              <span className="dots">....................................................................</span>
              <span className="value text-purple">100%</span>
            </div>
            <div className="terminal-line">
              <span className="label">DIAGNÓSTICO OBRIGATÓRIO</span>
              <span className="dots">....................................................................</span>
              <span className="value text-purple">SIM</span>
            </div>
          </div>
          <div className="panel-footer">
            <span className="blink-cursor">&gt; MONITORAMENTO EM TEMPO REAL...</span>
          </div>
        </motion.div>

        {/* Transição para Missão 007 */}
        <motion.div 
          className="mission-006-transition-gate"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="gate-line-vertical" />
          <div className="gate-badge">
            <div className="pulse-circle" />
            <span className="gate-text-1">PROTOCOLOS CONCLUÍDOS</span>
            <span className="gate-text-2">AUTORIZAÇÃO PARA INICIAR DIAGNÓSTICO LIBERADA</span>
          </div>
          <div className="gate-line-vertical" />
        </motion.div>
      </div>
    </section>
  );
}
