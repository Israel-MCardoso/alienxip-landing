import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ScrambleText } from "../ui/ScrambleText";
import { getDiagnosticUrl } from "../../config/diagnosticUrl";

// Import local assets
import card1 from "../../assets/solutions/card-1.webp";
import card2 from "../../assets/solutions/card-2.webp";
import card3 from "../../assets/solutions/card-3.webp";
import card4 from "../../assets/solutions/card-4.webp";
import card5 from "../../assets/solutions/card-5.webp";
import card6 from "../../assets/solutions/card-6.webp";

type SolutionSlide = {
  title: string;
  spanTitle: string;
  description: string;
  image: string;
  label: string;
};

const solutionsSlides: SolutionSlide[] = [
  {
    title: "Consultoria de",
    spanTitle: "Transformação Digital",
    description: "DIAGNÓSTICO, ESTRATÉGIA E DIREÇÃO TÉCNICA PARA MODERNIZAR A OPERAÇÃO.",
    image: card6,
    label: "CONSULTORIA",
  },
  {
    title: "Landing Pages",
    spanTitle: "Premium",
    description: "PÁGINAS MODERNAS, ESTRATÉGICAS E FOCADAS EM CONVERSÃO.",
    image: card1,
    label: "LANDING PAGES",
  },
  {
    title: "Sistemas",
    spanTitle: "Personalizados",
    description: "PAINÉIS, PLATAFORMAS INTERNAS, ERPS, CRMS E FERRAMENTAS SOB MEDIDA.",
    image: card2,
    label: "SISTEMAS",
  },
  {
    title: "Automações",
    spanTitle: "com IA",
    description: "FLUXOS INTELIGENTES PARA REDUZIR TAREFAS MANUAIS E ACELERAR OPERAÇÕES.",
    image: card3,
    label: "AUTOMAÇÃO IA",
  },
  {
    title: "Apps e",
    spanTitle: "Web Apps",
    description: "APLICAÇÕES DIGITAIS PARA CLIENTES, EQUIPES OU PROCESSOS INTERNOS.",
    image: card4,
    label: "APPS & WEB",
  },
  {
    title: "Integrações",
    spanTitle: "e APIs",
    description: "CONEXÃO ENTRE WHATSAPP, PAGAMENTOS, BANCOS DE DADOS, PLANILHAS, CRMS E OUTRAS FERRAMENTAS.",
    image: card5,
    label: "APIs & INTEGRAÇÕES",
  },
];

function SolutionTechIcon() {
  return (
    <svg viewBox="0 0 80 80" className="solution-tech-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="76" height="76" rx="10" stroke="rgba(183, 100, 255, 0.4)" strokeWidth="1.5" fill="#0b0b0d" />
      {/* Pyramid Dots */}
      <circle cx="40" cy="20" r="2.5" fill="#b764ff" />
      
      <circle cx="34" cy="27" r="2.5" fill="#b764ff" />
      <circle cx="40" cy="27" r="2.5" fill="#b764ff" />
      <circle cx="46" cy="27" r="2.5" fill="#b764ff" />
      
      <circle cx="28" cy="34" r="2.5" fill="#b764ff" />
      <circle cx="34" cy="34" r="2.5" fill="#b764ff" />
      <circle cx="40" cy="34" r="2.5" fill="#b764ff" />
      <circle cx="46" cy="34" r="2.5" fill="#b764ff" />
      <circle cx="52" cy="34" r="2.5" fill="#b764ff" />
      
      <circle cx="22" cy="41" r="2.5" fill="#b764ff" />
      <circle cx="28" cy="41" r="2.5" fill="#b764ff" />
      <circle cx="34" cy="41" r="2.5" fill="#b764ff" />
      <circle cx="40" cy="41" r="2.5" fill="#b764ff" />
      <circle cx="46" cy="41" r="2.5" fill="#b764ff" />
      <circle cx="52" cy="41" r="2.5" fill="#b764ff" />
      <circle cx="58" cy="41" r="2.5" fill="#b764ff" />

      <circle cx="16" cy="48" r="2.5" fill="#b764ff" />
      <circle cx="22" cy="48" r="2.5" fill="#b764ff" />
      <circle cx="28" cy="48" r="2.5" fill="#b764ff" />
      <circle cx="34" cy="48" r="2.5" fill="#b764ff" />
      <circle cx="40" cy="48" r="2.5" fill="#b764ff" />
      <circle cx="46" cy="48" r="2.5" fill="#b764ff" />
      <circle cx="52" cy="48" r="2.5" fill="#b764ff" />
      <circle cx="58" cy="48" r="2.5" fill="#b764ff" />
      <circle cx="64" cy="48" r="2.5" fill="#b764ff" />

      <text x="12" y="68" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">80/83</text>
      <text x="60" y="68" fill="#b764ff" fontWeight="bold" fontSize="11" fontFamily="monospace">A</text>
    </svg>
  );
}

function ExplorePointerIcon() {
  return (
    <svg
      className="explore-pointer-svg"
      width="36"
      height="12"
      viewBox="0 0 36 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: "8px", display: "inline-block", verticalAlign: "middle" }}
    >
      <line x1="2" y1="2" x2="8" y2="8" stroke="#b764ff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="8" x2="24" y2="8" stroke="#b764ff" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="24" y="6" width="4" height="4" fill="#b764ff" />
    </svg>
  );
}

function ExploreLink({ href, label }: { href: string; label: string }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  return (
    <a ref={linkRef} href={href} className="solutions-explore-link">
      <ExplorePointerIcon />
      <ScrambleText text={`EXPLORAR ${label}`} triggerRef={linkRef} />
    </a>
  );
}

function CardHudBorder() {
  return (
    <svg className="card-hud-border" viewBox="0 0 380 520" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Glow Border */}
      <path
        d="M 24 12 L 330 12 L 368 50 L 368 250 L 354 264 L 354 300 L 368 314 L 368 496 A 12 12 0 0 1 356 508 L 24 508 A 12 12 0 0 1 12 496 L 12 24 A 12 12 0 0 1 24 12 Z"
        stroke="#b764ff"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        opacity="0.9"
      />
      {/* Inner Thin Border */}
      <path
        d="M 24 18 L 326 18 L 362 54 L 362 248 L 348 262 L 348 298 L 362 312 L 362 496 A 6 6 0 0 1 356 502 L 24 502 A 6 6 0 0 1 18 496 L 18 24 A 6 6 0 0 1 24 18 Z"
        stroke="#b764ff"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        opacity="0.4"
      />
      {/* Top right cut corner fill details */}
      <line x1="330" y1="12" x2="326" y2="18" stroke="#b764ff" strokeWidth="1" opacity="0.6" />
      <line x1="368" y1="50" x2="362" y2="54" stroke="#b764ff" strokeWidth="1" opacity="0.6" />
      {/* Small corner block decoration */}
      <rect x="24" y="24" width="8" height="2" fill="#b764ff" opacity="0.8" />
      <rect x="24" y="24" width="2" height="8" fill="#b764ff" opacity="0.8" />
      <rect x="340" y="482" width="8" height="2" fill="#b764ff" opacity="0.8" />
      <rect x="346" y="476" width="2" height="8" fill="#b764ff" opacity="0.8" />
    </svg>
  );
}

const prependedClones = solutionsSlides.slice(-3);
const appendedClones = solutionsSlides.slice(0, 3);
const loopedSlides = [...prependedClones, ...solutionsSlides, ...appendedClones];
const REAL_START_INDEX = 3;

export function MissionSolutions() {
  const diagnosticUrl = getDiagnosticUrl();
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isTransitionDisabled, setIsTransitionDisabled] = useState(false);

  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetXRef = useRef(0);
  const wasDraggingRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Scale map of scroll Progress: starts at 0.08, ends at 0.92
  const scrollProgress = useTransform(scrollYProgress, [0.08, 0.92], [0, 1]);
  
  // Transform scroll progress to translateX percentage of the horizontal track
  const x = useTransform(scrollProgress, [0, 1], ["0%", "-83.333%"]);

  const getSlideWidth = () => {
    if (mobileContainerRef.current) {
      return mobileContainerRef.current.getBoundingClientRect().width;
    }
    return window.innerWidth;
  };

  // Initialize scroll positions on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const step = getSlideWidth();
      setOffsetX(-REAL_START_INDEX * step);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Recalculate alignments dynamically on screen resize
  useEffect(() => {
    const handleResize = () => {
      const step = getSlideWidth();
      setIsTransitionDisabled(true);
      setOffsetX(-(REAL_START_INDEX + activeMobileSlide) * step);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeMobileSlide]);

  const handleTransitionEnd = () => {
    if (isDraggingRef.current) return;

    const step = getSlideWidth();
    const currentLoopedIndex = Math.round(-offsetX / step);

    if (currentLoopedIndex < REAL_START_INDEX) {
      const targetLoopedIndex = currentLoopedIndex + 6;
      setIsTransitionDisabled(true);
      setOffsetX(-targetLoopedIndex * step);
    } else if (currentLoopedIndex > REAL_START_INDEX + 5) {
      const targetLoopedIndex = currentLoopedIndex - 6;
      setIsTransitionDisabled(true);
      setOffsetX(-targetLoopedIndex * step);
    }
  };

  const scrollToSlide = (virtualIndex: number) => {
    const step = getSlideWidth();
    const targetLoopedIndex = REAL_START_INDEX + virtualIndex;

    setIsTransitionDisabled(false);
    setOffsetX(-targetLoopedIndex * step);
    setActiveMobileSlide(virtualIndex);
  };

  const handlePrev = () => {
    const step = getSlideWidth();
    const targetLooped = REAL_START_INDEX + activeMobileSlide - 1;

    setIsTransitionDisabled(false);
    setOffsetX(-targetLooped * step);
    setActiveMobileSlide((targetLooped - REAL_START_INDEX + 6) % 6);
  };

  const handleNext = () => {
    const step = getSlideWidth();
    const targetLooped = REAL_START_INDEX + activeMobileSlide + 1;

    setIsTransitionDisabled(false);
    setOffsetX(-targetLooped * step);
    setActiveMobileSlide((targetLooped - REAL_START_INDEX + 6) % 6);
  };

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = true;
    setIsDragActive(true);
    wasDraggingRef.current = false;
    setIsTransitionDisabled(true);

    const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    startXRef.current = pageX;
    startOffsetXRef.current = offsetX;
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current) return;

    const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    const deltaX = pageX - startXRef.current;

    if (Math.abs(deltaX) > 10) {
      wasDraggingRef.current = true;
    }

    setOffsetX(startOffsetXRef.current + deltaX);
  };

  const onDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragActive(false);

    const step = getSlideWidth();
    setIsTransitionDisabled(false);

    let targetLoopedIndex = Math.round(-offsetX / step);
    targetLoopedIndex = Math.max(1, Math.min(loopedSlides.length - 2, targetLoopedIndex));

    setOffsetX(-targetLoopedIndex * step);

    const virt = (targetLoopedIndex - REAL_START_INDEX + 6) % 6;
    setActiveMobileSlide(virt);
  };

  return (
    <section
      ref={sectionRef}
      className="mission-solutions"
      id="solucoes"
      aria-labelledby="mission-solutions-title"
      data-orbital-sector="003"
    >
      <div className="mission-solutions-sticky">
        {/* Background Dot Grid */}
        <div className="solutions-grid-background" aria-hidden="true" />
        
        <div className="mission-solutions-grid">
          
          {/* Header */}
          <header className="solutions-section-header">
            <p className="mission-solutions-label">MISSÃO 003</p>
            <h2 id="mission-solutions-title" className="solutions-main-title">
              <ScrambleText text="Soluções " scrambleOnScroll />
              <span>
                <ScrambleText text="em Órbita." scrambleOnScroll />
              </span>
            </h2>
            <p className="solutions-main-text">
              Construímos sistemas, automações e experiências digitais para empresas que querem operar com mais inteligência, velocidade e controle.
            </p>
          </header>

          {/* Interactive Layout for Desktop */}
          <div className="solutions-interactive-body">
            <motion.div className="solutions-horizontal-track" style={{ x }}>
              {solutionsSlides.map((slide, i) => (
                <div className="solutions-slide-panel" key={slide.label}>
                  <div className="solutions-slide-content">
                    {/* Left: Card HUD wrapper */}
                    <div className="solutions-card-hud-column">
                      <div className="solutions-card-number-tag">
                        [ <span className="number-val">00{i + 1}</span> ]
                      </div>
                      <div className="solutions-card-frame">
                        <CardHudBorder />
                        <div className="solutions-card-content-area">
                          <img
                            src={slide.image}
                            alt={slide.label}
                            className="solutions-card-image"
                          />
                          <div className="solutions-card-vignette" />
                          <div className="solutions-card-title-bottom">
                            {slide.label}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Description wrap */}
                    <div className="solutions-description-column">
                      <div className="solutions-description-content">
                        <SolutionTechIcon />
                        <h3 className="solutions-desc-title">
                          {slide.title} <br />
                          <span>{slide.spanTitle}</span>
                        </h3>
                        <p className="solutions-desc-text">
                          {slide.description}
                        </p>
                        <ExploreLink href={diagnosticUrl} label={slide.label} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      {/* Mobile Layout fallback - stacked elements */}
      <div className="solutions-mobile-layout">
        <div className="solutions-mobile-carousel-container" ref={mobileContainerRef}>
          <div 
            className="solutions-mobile-track" 
            ref={mobileTrackRef}
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translate3d(${offsetX}px, 0, 0)`,
              transition: isTransitionDisabled ? "none" : "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
              cursor: isDragActive ? "grabbing" : "grab"
            }}
          >
            {loopedSlides.map((slide, index) => {
              const virtualIndex = (index - REAL_START_INDEX + 6) % 6;
              return (
                <div key={`${slide.label}-${index}`} className="solutions-mobile-slide">
                  <div className="solutions-card-number-tag">
                    [ <span className="number-val">00{virtualIndex + 1}</span> ]
                  </div>
                  <div className="solutions-card-frame">
                    <CardHudBorder />
                    <div className="solutions-card-content-area">
                      <img
                        src={slide.image}
                        alt={slide.label}
                        className="solutions-card-image"
                        loading="lazy"
                      />
                      <div className="solutions-card-vignette" />
                      <div className="solutions-card-title-bottom">
                        {slide.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="solutions-mobile-controls">
            <button 
              type="button" 
              className="carousel-nav-btn prev"
              onClick={handlePrev}
              aria-label="Solução anterior"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="solutions-mobile-dots">
              {solutionsSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`dot-btn ${activeMobileSlide === i ? "is-active" : ""}`}
                  onClick={() => scrollToSlide(i)}
                  aria-label={`Ir para a solução ${i + 1}`}
                />
              ))}
            </div>
            <button 
              type="button" 
              className="carousel-nav-btn next"
              onClick={handleNext}
              aria-label="Próxima solução"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Active Description Display */}
        <div className="solutions-mobile-desc-wrap">
          <div className="solutions-description-content">
            <SolutionTechIcon />
            <h3 className="solutions-desc-title">
              {solutionsSlides[activeMobileSlide].title} <br />
              <span>{solutionsSlides[activeMobileSlide].spanTitle}</span>
            </h3>
            <p className="solutions-desc-text">
              {solutionsSlides[activeMobileSlide].description}
            </p>
            <ExploreLink href={diagnosticUrl} label={solutionsSlides[activeMobileSlide].label} />
          </div>
        </div>
      </div>
    </section>
  );
}
