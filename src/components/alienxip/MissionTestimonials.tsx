import { useState, useEffect, useRef } from "react";
import { ScrambleText } from "../ui/ScrambleText";
import { BorderBeam } from "../ui/border-beam";

import clubeBoaVontadeLogo from "../../assets/clients/clube-atletico-boa-vontade-clean.webp";
import familiaMineiraLogo from "../../assets/clients/familia-mineira-clean.webp";
import faculdadeCidadeLogo from "../../assets/clients/faculdade-da-cidade-clean.webp";
import fides7Logo from "../../assets/clients/fides7-clean.webp";
import institutoTransformandoLogo from "../../assets/clients/instituto-transformando-historia-clean.webp";
import martronicsLogo from "../../assets/clients/martronics-clean.webp";
import visionCarLogo from "../../assets/clients/vision-car-clean.webp";

type TestimonialSlide = {
  title: string;
  client: string;
  sector: string;
  result: string;
  metric: string;
  roi: string;
  before: string;
  src: string;
  tags: string[];
  description: string;
};

const slideData: TestimonialSlide[] = [
  {
    title: "Operacao Clube Boa Vontade",
    client: "Clube Atletico Boa Vontade",
    sector: "054",
    result: "+41%",
    metric: "CONVERSAO",
    roi: "3.8x",
    before: "processos manuais",
    src: clubeBoaVontadeLogo,
    tags: ["CRM Integration", "Funil de Vendas", "Conversão +41%"],
    description: "Implementação de CRM e automação do processo de captação e triagem de atletas, otimizando o fluxo de matrículas e melhorando a conversão de novos alunos.",
  },
  {
    title: "Operacao Familia Mineira",
    client: "Familia Mineira",
    sector: "021",
    result: "+61%",
    metric: "EFICIENCIA",
    roi: "4.1x",
    before: "atendimento disperso",
    src: familiaMineiraLogo,
    tags: ["Omnichannel", "E-commerce", "CRM Hub"],
    description: "Centralização de canais de atendimento e inteligência de vendas unificada para e-commerce e lojas físicas, maximizando o tempo de resposta e o ticket médio.",
  },
  {
    title: "Operacao Educacao",
    client: "Faculdade da Cidade",
    sector: "077",
    result: "-14h",
    metric: "TEMPO OPERACIONAL",
    roi: "2.9x",
    before: "rotina manual",
    src: faculdadeCidadeLogo,
    tags: ["Portal do Aluno", "Secretaria Digital", "Automatização"],
    description: "Otimização dos fluxos acadêmicos internos, digitalização de processos de matrícula e implementação de sistema integrado de atendimento rápido ao estudante.",
  },
  {
    title: "Operacao FIDES7",
    client: "FIDES7 Engenharia",
    sector: "088",
    result: "-28%",
    metric: "RETRABALHO",
    roi: "3.5x",
    before: "planilhas dispersas",
    src: fides7Logo,
    tags: ["Gestão de Obras", "Sistemas Web", "Dashboards"],
    description: "Desenvolvimento de plataforma web para controle de obras, orçamentos e suprimentos em tempo real, integrando o canteiro de obras diretamente com a gestão corporativa.",
  },
  {
    title: "Operacao Transformar",
    client: "Instituto Transformando Historia",
    sector: "033",
    result: "+75%",
    metric: "ENGAJAMENTO",
    roi: "3.2x",
    before: "gestão descentralizada",
    src: institutoTransformandoLogo,
    tags: ["Gestão de Projetos", "Plataforma Social", "Automação"],
    description: "Criação de sistema de cadastro de voluntários, controle de projetos sociais e captação de recursos, aumentando a eficiência administrativa do instituto.",
  },
  {
    title: "Operacao Industria",
    client: "Martronics",
    sector: "108",
    result: "94%",
    metric: "AUTOMACOES",
    roi: "5.2x",
    before: "gargalos internos",
    src: martronicsLogo,
    tags: ["ERP Customizado", "Indústria 4.0", "Controle de Estoque"],
    description: "Automatização completa do controle de inventário físico e digital sincronizado ao ERP corporativo, otimizando o fluxo logístico e reduzindo o tempo operacional das equipes.",
  },
  {
    title: "Operacao Vision Car",
    client: "Vision Car",
    sector: "099",
    result: "+48%",
    metric: "PRODUTIVIDADE",
    roi: "4.5x",
    before: "fluxos desorganizados",
    src: visionCarLogo,
    tags: ["Automação de Serviços", "Sistemas de Agendamento", "IA"],
    description: "Plataforma integrada de agendamento, faturamento automático e controle de serviços automotivos personalizados com acompanhamento em tempo real para os clientes.",
  },
];

// Duplicate slides to support infinite translation loops
const prependedClones = slideData.slice(-4);
const appendedClones = slideData.slice(0, 4);
const loopedSlides = [...prependedClones, ...slideData, ...appendedClones];
const REAL_START_INDEX = 4; // Virtual index 0 aligns here

type TestimonialCardProps = {
  slide: TestimonialSlide;
  isActive: boolean;
};

function TestimonialCard({ slide, isActive }: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      className={`cs-box ${isActive ? "is-active" : ""} ${isHovered ? "is-hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(isActive || isHovered) && (
        <BorderBeam
          className="mission-carousel-border-beam"
          size={240}
          duration={8}
          borderWidth={1.5}
          colorFrom="#d8adff"
          colorTo="#9d18ff"
        />
      )}

      <div className="top">
        <div className="imgbox">
          <div className="tag-wrapper">
            {slide.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <img 
            src={slide.src} 
            alt={slide.client} 
            loading="lazy" 
            decoding="async" 
            draggable="false"
          />
        </div>

        <small className="operation-meta">OPERAÇÃO CLASSIFICADA // SETOR {slide.sector}</small>
        <h3 className="operation-title">{slide.client}</h3>

        <div className="mission-carousel-data">
          <div className="hud-data-box">
            <span className="hud-data-label">ANTES</span>
            <strong className="hud-data-value">{slide.before}</strong>
          </div>
          <div className="hud-data-box">
            <span className="hud-data-label">RESULTADO</span>
            <strong className="hud-data-value highlighted">{slide.result}</strong>
          </div>
          <div className="hud-data-box">
            <span className="hud-data-label">ROI</span>
            <strong className="hud-data-value highlighted">{slide.roi}</strong>
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="bottom-inner">
          <p>{slide.description}</p>
        </div>
      </div>
    </article>
  );
}

export function MissionTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0); // Active virtual index (0 to 6)
  const [offsetX, setOffsetX] = useState(0); // Track translateX translation value (px)
  const [isDragActive, setIsDragActive] = useState(false);
  const [isTransitionDisabled, setIsTransitionDisabled] = useState(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Drag coordinates refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetXRef = useRef(0);

  // Helper to dynamically get slide width + gap spacing
  const getCardStep = () => {
    const slider = sliderRef.current;
    if (!slider) return 412; // fallback (380 + 32)
    const card = slider.querySelector(".mission-005-slide");
    if (!card) return 412;
    const width = card.getBoundingClientRect().width;
    const style = window.getComputedStyle(slider.querySelector(".mission-005-slider-track") || slider);
    const gap = parseFloat(style.columnGap || style.gap || "32");
    return width + gap;
  };

  // Helper to dynamically calculate alignment padding based on container size
  const getPaddingOffset = () => {
    const width = window.innerWidth;
    if (width <= 780) {
      const slider = sliderRef.current;
      if (slider) {
        const card = slider.querySelector(".mission-005-slide");
        if (card) {
          const cardWidth = card.getBoundingClientRect().width;
          return (width - cardWidth) / 2;
        }
      }
      const cardWidth = Math.min(width * 0.85, 340);
      return (width - cardWidth) / 2;
    }
    const padding = Math.max(24, (width - Math.min(1400, width - 80)) / 2 + 40);
    return padding;
  };

  // Initialize scroll positions on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const step = getCardStep();
      const padding = getPaddingOffset();
      setOffsetX(-REAL_START_INDEX * step + padding);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Recalculate alignments dynamically on screen resize
  useEffect(() => {
    const handleResize = () => {
      const step = getCardStep();
      const padding = getPaddingOffset();
      setIsTransitionDisabled(true);
      setOffsetX(-(REAL_START_INDEX + activeIndex) * step + padding);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex]);

  // Centralized index boundary loop jumps
  const handleTransitionEnd = () => {
    if (isDraggingRef.current) return;

    const step = getCardStep();
    const padding = getPaddingOffset();
    const currentLoopedIndex = Math.round((padding - offsetX) / step);

    // Looping past left boundary clones
    if (currentLoopedIndex < REAL_START_INDEX) {
      const targetLoopedIndex = currentLoopedIndex + 7;
      setIsTransitionDisabled(true);
      setOffsetX(-targetLoopedIndex * step + padding);
    } 
    // Looping past right boundary clones
    else if (currentLoopedIndex > 10) {
      const targetLoopedIndex = currentLoopedIndex - 7;
      setIsTransitionDisabled(true);
      setOffsetX(-targetLoopedIndex * step + padding);
    }
  };

  // Centralized scrolling transition logic
  const scrollToSlide = (virtualIndex: number) => {
    const step = getCardStep();
    const padding = getPaddingOffset();
    const targetLoopedIndex = REAL_START_INDEX + virtualIndex;

    setIsTransitionDisabled(false);
    setOffsetX(-targetLoopedIndex * step + padding);
    setActiveIndex(virtualIndex);
  };

  // Loop back and forth infinitely on Prev/Next click
  const handlePrev = () => {
    const step = getCardStep();
    const padding = getPaddingOffset();
    const targetLooped = REAL_START_INDEX + activeIndex - 1;

    setIsTransitionDisabled(false);
    setOffsetX(-targetLooped * step + padding);
    setActiveIndex((targetLooped - REAL_START_INDEX + 7) % 7);
  };

  const handleNext = () => {
    const step = getCardStep();
    const padding = getPaddingOffset();
    const targetLooped = REAL_START_INDEX + activeIndex + 1;

    setIsTransitionDisabled(false);
    setOffsetX(-targetLooped * step + padding);
    setActiveIndex((targetLooped - REAL_START_INDEX + 7) % 7);
  };

  // Pointer drag event handlers
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = true;
    setIsDragActive(true);
    setIsTransitionDisabled(true); // Disable animation during live drag tracking

    const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    startXRef.current = pageX;
    startOffsetXRef.current = offsetX;
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current) return;

    const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    const deltaX = pageX - startXRef.current;

    setOffsetX(startOffsetXRef.current + deltaX);
  };

  const onDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragActive(false);

    const step = getCardStep();
    const padding = getPaddingOffset();

    // Re-enable smooth transition animation
    setIsTransitionDisabled(false);

    // Calculate nearest card target index
    let targetLoopedIndex = Math.round((padding - offsetX) / step);

    // Boundary clamp checks
    targetLoopedIndex = Math.max(1, Math.min(loopedSlides.length - 2, targetLoopedIndex));

    setOffsetX(-targetLoopedIndex * step + padding);

    const virt = (targetLoopedIndex - REAL_START_INDEX + 7) % 7;
    setActiveIndex(virt);
  };

  return (
    <section
      className="mission-005"
      id="missao-005"
      aria-labelledby="mission-005-title"
      data-orbital-sector="005"
    >
      <div className="mission-005-container">
        <div className="mission-005-header">
          <p className="mission-005-label">MISSÃO 005</p>
          <h2 id="mission-005-title">
            <ScrambleText text="Algumas operações" scrambleOnScroll />
            <br />
            <span className="purple-gradient-text">
              <ScrambleText text="mudam para sempre" scrambleOnScroll />
            </span>
            <br />
            <ScrambleText text="após a missão." scrambleOnScroll />
          </h2>
          <p className="mission-005-subtitle">
            Transformação não é teoria. Ela deixa rastros.
          </p>
        </div>
      </div>

      {/* Full bleed slider layout (outside container) */}
      <div className="mission-005-carousel-wrapper" ref={sliderRef}>
        <div
          className="mission-005-slider-track"
          ref={trackRef}
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
            const virtualIndex = (index - REAL_START_INDEX + 7) % 7;
            const isCardActive = activeIndex === virtualIndex;
            return (
              <div
                key={`${slide.title}-${index}`}
                className="mission-005-slide"
                data-index={index}
              >
                <TestimonialCard 
                  slide={slide} 
                  isActive={isCardActive} 
                />
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="mission-005-controls">
          <button 
            type="button" 
            className="carousel-nav-btn prev"
            onClick={handlePrev} 
            aria-label="Caso de estudo anterior"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <div className="mission-005-dots">
            {slideData.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`dot-btn ${activeIndex === index ? "is-active" : ""}`}
                onClick={() => scrollToSlide(index)}
                aria-label={`Ir para o slide ${index + 1}`}
              />
            ))}
          </div>

          <button 
            type="button" 
            className="carousel-nav-btn next"
            onClick={handleNext} 
            aria-label="Próximo caso de estudo"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
