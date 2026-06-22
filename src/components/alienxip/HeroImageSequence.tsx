import { MotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const frameModules = import.meta.glob("../../assets/hero-sequence-webp/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const frames = Object.entries(frameModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, src]) => src);

type HeroImageSequenceProps = {
  progress: MotionValue<number>;
};

function drawCoverImage(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth = canvasWidth;
  let drawHeight = canvasHeight;
  let drawX = 0;
  let drawY = 0;

  if (imageRatio > canvasRatio) {
    drawHeight = canvasHeight;
    drawWidth = drawHeight * imageRatio;
    drawX = (canvasWidth - drawWidth) / 2;
  } else {
    drawWidth = canvasWidth;
    drawHeight = drawWidth / imageRatio;
    drawY = (canvasHeight - drawHeight) / 2;
  }

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

export function HeroImageSequence({ progress }: HeroImageSequenceProps) {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  const loadedRef = useRef<boolean[]>([]);
  const targetIndexRef = useRef(0);
  const drawnIndexRef = useRef(-1);
  const frameRequestRef = useRef<number | null>(null);
  const hasPendingResizeRef = useRef(true);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [useStaticPoster, setUseStaticPoster] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = () => {
      setUseStaticPoster(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = 1;
    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      drawnIndexRef.current = -1;
    }
  };

  const drawFrame = (requestedIndex = targetIndexRef.current) => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (hasPendingResizeRef.current) {
      resizeCanvas();
      hasPendingResizeRef.current = false;
    }

    const clampedIndex = Math.min(frames.length - 1, Math.max(0, requestedIndex));
    let drawableIndex = clampedIndex;

    while (drawableIndex > 0 && !loadedRef.current[drawableIndex]) {
      drawableIndex -= 1;
    }

    const image = imagesRef.current[drawableIndex];
    if (!image || !loadedRef.current[drawableIndex] || drawnIndexRef.current === drawableIndex) return;

    drawCoverImage(canvas, image);
    drawnIndexRef.current = drawableIndex;
    setIsCanvasReady(true);
  };

  useEffect(() => {
    if (typeof window === "undefined" || reduceMotion || useStaticPoster) return;

    resizeCanvas();
    hasPendingResizeRef.current = false;

    const handleResize = () => {
      hasPendingResizeRef.current = true;
      drawFrame(drawnIndexRef.current >= 0 ? drawnIndexRef.current : targetIndexRef.current);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    let cancelled = false;

    const loadBatch = (startIndex: number) => {
      if (cancelled) return;

      frames.slice(startIndex, startIndex + 10).forEach((src, offset) => {
        const index = startIndex + offset;
        if (imagesRef.current[index]) return;

        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          loadedRef.current[index] = true;
          if (index === 0 || index === targetIndexRef.current) {
            drawFrame(targetIndexRef.current);
          }
        };
        image.src = src;
        imagesRef.current[index] = image;
      });

      if (startIndex + 10 < frames.length) {
        window.setTimeout(() => loadBatch(startIndex + 10), 55);
      }
    };

    loadBatch(0);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
    };
  }, [reduceMotion, useStaticPoster]);

  useEffect(() => {
    return () => {
      if (frameRequestRef.current !== null) {
        window.cancelAnimationFrame(frameRequestRef.current);
      }
    };
  }, []);

  useMotionValueEvent(progress, "change", (latest) => {
    if (reduceMotion || useStaticPoster || frames.length <= 1) return;

    const clamped = Math.min(1, Math.max(0, latest));
    targetIndexRef.current = Math.round(clamped * (frames.length - 1));

    if (frameRequestRef.current !== null) return;

    frameRequestRef.current = window.requestAnimationFrame(() => {
      frameRequestRef.current = null;
      drawFrame(targetIndexRef.current);
    });
  });

  return (
    <div className="hero-sequence" aria-hidden="true">
      <img className="hero-sequence-frame hero-sequence-poster" src={frames[0]} alt="" draggable="false" />
      {!reduceMotion && !useStaticPoster && (
        <canvas className={`hero-sequence-canvas ${isCanvasReady ? "is-ready" : ""}`} ref={canvasRef} />
      )}
      <div className="hero-sequence-vignette" />
      <div className="hero-sequence-grain" />
    </div>
  );
}
