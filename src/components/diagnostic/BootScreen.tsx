import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fullText = "INICIANDO PROTOCOLO DE DIAGNÓSTICO...";

  // Typing effect
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(typingInterval);
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, []);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Loading bar progress using timestamp delta for maximum stability
  useEffect(() => {
    const startTime = performance.now();
    const duration = 1800; // 1.8 seconds

    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const nextProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          onCompleteRef.current();
        }, 300); // Tiny pause at 100% before transition
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, []);

  // Discrete particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    const mobileViewport = window.matchMedia("(max-width: 768px)").matches;
    const particleCount = mobileViewport ? 16 : 35;
    const minFrameInterval = mobileViewport ? 1000 / 30 : 0;
    let lastFrameTime = 0;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Create discrete particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.1),
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const draw = (frameTime = performance.now()) => {
      if (minFrameInterval > 0 && frameTime - lastFrameTime < minFrameInterval) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      lastFrameTime = frameTime;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(185, 92, 255, 0.4)";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(185, 92, 255, ${p.opacity})`;
        ctx.fill();

        // Move particle upward
        p.y += p.speedY;

        // Reset particle position if it goes offscreen
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="boot-screen">
      <canvas ref={canvasRef} className="boot-particles" />
      
      {/* Moving Scan Sweep Effect */}
      <div className="boot-scan-line" />

      <motion.div 
        className="boot-content-panel"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="boot-decor-top">
          <div className="boot-dot-pulse" />
          <div className="boot-coordinates">REF_ID: //XIP-HQ-NODE</div>
        </div>

        <div className="boot-header-group">
          <span className="boot-subtitle">NAVE MÃE ALIENXIP</span>
          <h2 className="boot-title">CONEXÃO ESTABELECIDA</h2>
        </div>

        <div className="boot-status-msg">
          <span className="boot-prompt">&gt;</span> {typedText}
          <span className="boot-cursor">_</span>
        </div>

        <div className="boot-progress-container">
          <div className="boot-progress-meta">
            <span>SISTEMA: CARREGANDO SENSORES</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="boot-progress-bar">
            <div 
              className="boot-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
