import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { BorderBeam } from "./border-beam";
import placeholderVideo from "../../assets/hero-video.mp4";

export type CarouselSlide = {
  title: string;
  client: string;
  sector: string;
  result: string;
  metric: string;
  roi: string;
  before: string;
  src: string;
};

type CarouselProps = {
  slides: CarouselSlide[];
};

export default function Carousel({ slides }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeSlide = slides[activeIndex];

  // Auto-scroll slides, but pause if a video is actively playing
  useEffect(() => {
    if (slides.length === 0 || isPlaying) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length, isPlaying]);

  // Reset play state when slide changes
  useEffect(() => {
    setIsPlaying(false);
  }, [activeIndex]);

  if (!activeSlide) {
    return null;
  }

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const visibleSlides = slides
    .map((slide, index) => {
      const offset = (index - activeIndex + slides.length) % slides.length;
      const normalizedOffset = offset > slides.length / 2 ? offset - slides.length : offset;
      return { ...slide, index, offset: normalizedOffset };
    })
    .filter((slide) => Math.abs(slide.offset) <= 2)
    .sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset));

  return (
    <div className="mission-carousel" aria-label="Depoimentos de clientes">
      <div className="mission-carousel-stage">
        {visibleSlides.map((slide) => {
          const isActive = slide.offset === 0;
          const distance = Math.abs(slide.offset);
          const cardStyle = {
            "--card-x": `${slide.offset * 44}%`,
            "--card-y": isActive ? "0px" : `${18 + distance * 10}px`,
            "--card-scale": isActive ? 1 : 0.78 - distance * 0.06,
            "--card-rotate": `${slide.offset * -8}deg`,
            "--card-opacity": isActive ? 1 : 0.3 - distance * 0.06,
            zIndex: 10 - distance,
          } as CSSProperties;

          return (
            <article
              className={`mission-carousel-card${isActive ? " is-active" : " is-background"}`}
              key={slide.title}
              style={cardStyle}
              aria-hidden={!isActive}
            >
              {isActive && (
                <BorderBeam
                  className="mission-carousel-border-beam"
                  size={240}
                  duration={12}
                  borderWidth={1.5}
                  colorFrom="#d8adff"
                  colorTo="#9d18ff"
                />
              )}

              <div className="alienxip-card-body">
                <header>
                  <span>OPERAÇÃO {slide.sector}</span>
                  <small>// ARQUIVO CLASSIFICADO</small>
                </header>

                <div className="mission-carousel-media">
                  {isActive && isPlaying ? (
                    <video
                      src={placeholderVideo}
                      autoPlay
                      controls
                      playsInline
                      className="mission-carousel-video"
                    />
                  ) : (
                    <>
                      <img src={slide.src} alt="" loading="lazy" decoding="async" />
                      <button
                        type="button"
                        aria-label={`Assistir depoimento de ${slide.client}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setIsPlaying(true)}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      </button>
                      <span className="media-status-tag">VIDEO REGISTRO RECUPERADO</span>

                      {/* HUD telemetry details */}
                      <div className="media-hud-crosshair top-left">+</div>
                      <div className="media-hud-crosshair top-right">+</div>
                      <div className="media-hud-crosshair bottom-left">+</div>
                      <div className="media-hud-crosshair bottom-right">+</div>
                      <div className="media-hud-rec-indicator">
                        <span className="dot animate-pulse"></span> REC
                      </div>
                    </>
                  )}
                </div>

                <div className="mission-carousel-data">
                  <div className="hud-data-box">
                    <span className="hud-data-label">SETOR</span>
                    <strong className="hud-data-value">{slide.client}</strong>
                  </div>
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

                <footer>
                  <span>[ STATUS: MISSION COMPLETE ]</span>
                  <span>{slide.metric}</span>
                </footer>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mission-carousel-controls">
        <button type="button" onClick={goToPrevious} aria-label="Depoimento anterior">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.5 5.5 8 12l6.5 6.5M9 12h11" />
          </svg>
        </button>
        <span>EXPLORAR OPERACOES CONCLUIDAS</span>
        <button type="button" onClick={goToNext} aria-label="Proximo depoimento">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9.5 5.5 16 12l-6.5 6.5M4 12h11" />
          </svg>
        </button>
      </div>

      <div className="mission-carousel-dots" aria-hidden="true">
        {slides.map((slide, index) => (
          <i className={index === activeIndex ? "is-active" : ""} key={slide.title} />
        ))}
      </div>
    </div>
  );
}
