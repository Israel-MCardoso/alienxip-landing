import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ParticleGalaxyProps } from "./ParticleGalaxy";

const LazyParticleGalaxy = lazy(() =>
  import("./ParticleGalaxy").then((module) => ({
    default: module.ParticleGalaxy,
  })),
);

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

export function DeferredParticleGalaxy(props: ParticleGalaxyProps) {
  const { className } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (shouldRender) {
      return;
    }

    const container = containerRef.current;

    if (!container || typeof IntersectionObserver === "undefined") {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: isMobile ? "360px 0px" : "1200px 0px" },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isMobile, shouldRender]);

  if (!shouldRender) {
    return <div ref={containerRef} className={cn("particle-galaxy", className)} aria-hidden="true" />;
  }

  return (
    <Suspense fallback={<div className={cn("particle-galaxy", className)} aria-hidden="true" />}>
      <LazyParticleGalaxy
        {...props}
        particleCount={isMobile ? Math.min(props.particleCount ?? 10000, 2600) : props.particleCount}
        glow={isMobile ? Math.min(props.glow ?? 60, 42) : props.glow}
        mouseInfluence={isMobile ? 0 : props.mouseInfluence}
        pulsate={isMobile ? false : props.pulsate}
      />
    </Suspense>
  );
}
