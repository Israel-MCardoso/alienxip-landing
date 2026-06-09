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
      { rootMargin: "7000px 0px" },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [shouldRender]);

  if (!shouldRender) {
    return <div ref={containerRef} className={cn("particle-galaxy", className)} aria-hidden="true" />;
  }

  return (
    <Suspense fallback={<div className={cn("particle-galaxy", className)} aria-hidden="true" />}>
      <LazyParticleGalaxy {...props} />
    </Suspense>
  );
}
