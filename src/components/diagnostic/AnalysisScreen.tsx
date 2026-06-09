import { useState, useEffect, useRef } from "react";

interface AnalysisScreenProps {
  onComplete: () => void;
}

const steps = [
  { minProg: 0, maxProg: 20, text: "ANALISANDO DADOS" },
  { minProg: 20, maxProg: 40, text: "MAPEANDO PROCESSOS" },
  { minProg: 40, maxProg: 60, text: "IDENTIFICANDO GARGALOS" },
  { minProg: 60, maxProg: 80, text: "CRUZANDO INFORMAÇÕES" },
  { minProg: 80, maxProg: 101, text: "GERANDO RELATÓRIO" },
];

const mockScannerLogs = [
  "SYSTEM: INICIANDO CONVERSÃO ORBITAL...",
  "CORE: CARREGANDO HEURÍSTICAS DE ATRITO...",
  "DATABASE: SCAN DE BANCO DE DADOS CONCLUÍDO [OK]",
  "ENGINE: CALIBRANDO TAXA DE ESCALA...",
  "AI: AVALIANDO FLUXO DE ATENDIMENTO E VENDAS...",
  "TELEMETRY: MAPEANDO GARGALOS DE INTEGRAÇÃO...",
  "SYSTEM: GERANDO MATRIZ DE RECOMENDAÇÃO...",
  "XIP: PROTOCOLO FINALIZADO COM SUCESSO.",
];

export function AnalysisScreen({ onComplete }: AnalysisScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState("ANALISANDO DADOS");
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Core scanning timer (3.2 seconds duration) using timestamp delta for maximum stability
  useEffect(() => {
    const startTime = performance.now();
    const duration = 3200;

    const timer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const nextProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(nextProgress);

      // Find current text based on progress
      const match = steps.find((s) => nextProgress >= s.minProg && nextProgress < s.maxProg);
      if (match) {
        setCurrentText(match.text);
      }

      // Add terminal logs dynamically based on progress
      const logIdx = Math.min(
        Math.floor((nextProgress / 100) * mockScannerLogs.length),
        mockScannerLogs.length - 1
      );
      
      setVisibleLogs((prev) => {
        const log = mockScannerLogs[logIdx];
        if (log && !prev.includes(log)) {
          return [...prev, log];
        }
        return prev;
      });

      if (nextProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onCompleteRef.current();
        }, 400);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  // Digital canvas matrix rain / scanning lines particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
    }> = [];

    // Create 40 streaming point lines
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: Math.random() * 2 + 1,
        length: Math.random() * 80 + 20,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const resize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.strokeStyle = `rgba(157, 24, 255, ${p.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        ctx.stroke();

        // Move vertical streamer
        p.y += p.speed;
        if (p.y > h) {
          p.y = -p.length;
          p.x = Math.random() * w;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="analysis-fullscreen-overlay">
      <canvas ref={canvasRef} className="analysis-canvas-bg" />
      <div className="analysis-scanline-sweep" />

      <div className="analysis-content-box">
        {/* Radar scanning hub */}
        <div className="analysis-radar-hub">
          <div className="radar-circle" />
          <div className="radar-circle inner-1" />
          <div className="radar-circle inner-2" />
          <div className="radar-crosshair-h" />
          <div className="radar-crosshair-v" />
          <div className="radar-sweep" />
          
          {/* Animated pulsing blips */}
          <div className="radar-blip blip-1" />
          <div className="radar-blip blip-2" />
          <div className="radar-blip blip-3" />
        </div>

        {/* Dynamic Status Text */}
        <div className="analysis-text-indicator">
          <span className="analysis-pulse-dot" />
          <h2 className="analysis-step-title">{currentText}</h2>
        </div>

        {/* High-tech segmented progress bar */}
        <div className="analysis-bar-wrapper">
          <div className="analysis-bar-meta">
            <span>VARREDURA DE SISTEMA</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="analysis-bar-container">
            <div 
              className="analysis-bar-fill-segmented" 
              style={{ width: `${progress}%` }}
            />
            {/* Fine Ticks Overlay */}
            <div className="analysis-bar-ticks" />
          </div>
        </div>

        {/* Modern Console Logs */}
        <div className="analysis-console-logs">
          <div className="console-logs-header">
            <span>TERMINAL DE VARREDURA COORDENADA</span>
          </div>
          <div className="console-logs-body">
            {visibleLogs.slice(-4).map((log, index) => (
              <div className="console-log-line" key={index}>
                <span className="console-log-prompt">&gt;&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
