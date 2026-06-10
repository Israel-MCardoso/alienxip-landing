import { useEffect, useRef } from "react";

type StarfieldProps = {
  className?: string;
  starColor?: string;
  bgColor?: string;
  mouseAdjust?: boolean;
  easing?: number;
  hyperspace?: boolean;
  warpFactor?: number;
  opacity?: number;
  speed?: number;
  quantity?: number;
};

type Star = {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  ox: number;
  oy: number;
  active: boolean;
};

const createUuid = () => {
  const lut = Array.from({ length: 256 }, (_, i) => (i < 16 ? "0" : "") + i.toString(16));
  const d0 = (Math.random() * 0xffffffff) | 0;
  const d1 = (Math.random() * 0xffffffff) | 0;
  const d2 = (Math.random() * 0xffffffff) | 0;
  const d3 = (Math.random() * 0xffffffff) | 0;

  return (
    lut[d0 & 0xff] +
    lut[(d0 >> 8) & 0xff] +
    lut[(d0 >> 16) & 0xff] +
    lut[(d0 >> 24) & 0xff] +
    "-" +
    lut[d1 & 0xff] +
    lut[(d1 >> 8) & 0xff] +
    "-" +
    lut[((d1 >> 16) & 0x0f) | 0x40] +
    lut[(d1 >> 24) & 0xff] +
    "-" +
    lut[(d2 & 0x3f) | 0x80] +
    lut[(d2 >> 8) & 0xff] +
    "-" +
    lut[(d2 >> 16) & 0xff] +
    lut[(d2 >> 24) & 0xff] +
    lut[d3 & 0xff] +
    lut[(d3 >> 8) & 0xff] +
    lut[(d3 >> 16) & 0xff] +
    lut[(d3 >> 24) & 0xff]
  );
};

export function Starfield({
  className,
  starColor = "rgba(255,255,255,1)",
  bgColor = "rgba(0,0,0,1)",
  mouseAdjust = false,
  easing = 1,
  hyperspace = false,
  warpFactor = 10,
  opacity = 0.1,
  speed = 1,
  quantity = 512,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const uidRef = useRef(createUuid());
  const animationFrameRef = useRef<number | null>(null);
  const isActiveRef = useRef(true);
  const hasPendingResizeRef = useRef(true);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(0);

  const starRef = useRef<{
    w: number;
    h: number;
    ctx: CanvasRenderingContext2D | null;
    cw: number;
    ch: number;
    x: number;
    y: number;
    z: number;
    colorRatio: number;
    ratio: number;
    arr: Star[];
  }>({
    w: 0,
    h: 0,
    ctx: null,
    cw: 0,
    ch: 0,
    x: 0,
    y: 0,
    z: 0,
    colorRatio: 0,
    ratio: 0,
    arr: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (!canvas || !parent) {
      return undefined;
    }

    const compSpeed = hyperspace ? speed * warpFactor : speed;
    const fill = hyperspace ? `rgba(0,0,0,${opacity})` : bgColor;

    const measureViewport = () => {
      const data = starRef.current;
      // Sticky canvas spans exactly window dimensions.
      // Measuring clientWidth/clientHeight on parents causes vertical squishing in long scrolling pages.
      data.w = window.innerWidth;
      data.h = window.innerHeight;
      data.x = Math.round(data.w / 2);
      data.y = Math.round(data.h / 2);
      data.z = (data.w + data.h) / 2;
      data.colorRatio = 1 / data.z;
      // Dynamic projection ratio prevents stars from clustering in a small central square on widescreen desktop viewports.
      data.ratio = data.z * 0.8;

      if (cursorRef.current.x === 0 || cursorRef.current.y === 0) {
        cursorRef.current.x = data.x;
        cursorRef.current.y = data.y;
      }

      if (mouseRef.current.x === 0 || mouseRef.current.y === 0) {
        mouseRef.current.x = cursorRef.current.x - data.x;
        mouseRef.current.y = cursorRef.current.y - data.y;
      }
    };

    const bigBang = () => {
      const data = starRef.current;
      data.arr = Array.from({ length: quantity }, () => ({
        x: Math.random() * data.w * 2 - data.x * 2,
        y: Math.random() * data.h * 2 - data.y * 2,
        z: Math.round(Math.random() * data.z),
        px: 0,
        py: 0,
        ox: 0,
        oy: 0,
        active: true,
      }));
    };

    const setupCanvas = () => {
      measureViewport();
      const data = starRef.current;
      data.ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(data.w * dpr);
      canvas.height = Math.round(data.h * dpr);

      if (data.ctx) {
        data.ctx.fillStyle = fill;
        data.ctx.strokeStyle = starColor;
      }
    };

    const resize = () => {
      measureViewport();
      const data = starRef.current;
      const dpr = window.devicePixelRatio || 1;

      data.cw = data.ctx?.canvas.width ?? 0;
      data.ch = data.ctx?.canvas.height ?? 0;

      const targetWidth = Math.round(data.w * dpr);
      const targetHeight = Math.round(data.h * dpr);

      if (!data.ctx || (data.cw === targetWidth && data.ch === targetHeight)) {
        return;
      }

      const rw = data.cw ? targetWidth / data.cw : 1;
      const rh = data.ch ? targetHeight / data.ch : 1;

      data.ctx.canvas.width = targetWidth;
      data.ctx.canvas.height = targetHeight;

      if (!data.arr.length) {
        bigBang();
      } else {
        // Adjust star coordinates based on resize ratios
        for (let i = 0; i < data.arr.length; i++) {
          const star = data.arr[i];
          star.x = star.x * rw;
          star.y = star.y * rh;
          const zVal = Math.max(0.1, star.z);
          star.px = data.x + (star.x / zVal) * data.ratio;
          star.py = data.y + (star.y / zVal) * data.ratio;
        }
      }

      data.ctx.fillStyle = fill;
      data.ctx.strokeStyle = starColor;
    };

    const update = (dt: number) => {
      const data = starRef.current;
      const mx = mouseAdjust ? (cursorRef.current.x - data.x) / easing : 0;
      const my = mouseAdjust ? (cursorRef.current.y - data.y) / easing : 0;

      mouseRef.current.x = mx;
      mouseRef.current.y = my;

      const stepSpeed = compSpeed * dt;
      const mouseStepX = (mouseRef.current.x >> 4) * dt;
      const mouseStepY = (mouseRef.current.y >> 4) * dt;

      for (let i = 0; i < data.arr.length; i++) {
        const star = data.arr[i];
        star.active = true;
        star.ox = star.px;
        star.oy = star.py;

        star.x += mouseStepX;
        if (star.x > data.x * 2) {
          star.x -= data.w * 2;
          star.active = false;
        } else if (star.x < -data.x * 2) {
          star.x += data.w * 2;
          star.active = false;
        }

        star.y += mouseStepY;
        if (star.y > data.y * 2) {
          star.y -= data.h * 2;
          star.active = false;
        } else if (star.y < -data.y * 2) {
          star.y += data.h * 2;
          star.active = false;
        }

        star.z -= stepSpeed;
        if (star.z > data.z) {
          star.z -= data.z;
          star.active = false;
        } else if (star.z <= 0) {
          star.z = data.z;
          star.active = false;
        }

        // Perspective projection with safe division
        const zVal = Math.max(0.1, star.z);
        star.px = data.x + (star.x / zVal) * data.ratio;
        star.py = data.y + (star.y / zVal) * data.ratio;
      }
    };

    const draw = () => {
      const data = starRef.current;
      const ctx = data.ctx;

      if (!ctx) {
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const physicalWidth = Math.round(data.w * dpr);
      const physicalHeight = Math.round(data.h * dpr);

      ctx.save();
      // Draw canvas fillRect using raw physical dimensions BEFORE scale transformation
      // to avoid rounding rounding issues or sub-pixel flickering borders on scaled displays
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, physicalWidth, physicalHeight);

      // Now apply context scale transform for drawing coordinates
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = starColor;

      for (let i = 0; i < data.arr.length; i++) {
        const star = data.arr[i];
        if (
          star.ox > 0 &&
          star.ox < data.w &&
          star.oy > 0 &&
          star.oy < data.h &&
          star.active
        ) {
          ctx.lineWidth = (1 - data.colorRatio * star.z) * 2;
          ctx.beginPath();
          ctx.moveTo(star.ox, star.oy);
          ctx.lineTo(star.px, star.py);
          ctx.stroke();
          ctx.closePath();
        }
      }

      ctx.restore();
    };

    const animate = (time: number) => {
      if (hasPendingResizeRef.current) {
        resize();
        hasPendingResizeRef.current = false;
      }

      // Delta time based on 60fps target (16.67ms)
      const elapsed = time - lastTimeRef.current;
      lastTimeRef.current = time;
      const dt = Math.max(0.1, Math.min(8, elapsed / 16.67));

      update(dt);
      draw();

      if (isActiveRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const startAnimation = () => {
      if (animationFrameRef.current !== null) {
        return;
      }

      isActiveRef.current = true;
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      isActiveRef.current = false;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const mouseHandler = (event: MouseEvent) => {
      cursorRef.current.x = event.clientX;
      cursorRef.current.y = event.clientY;
    };

    setupCanvas();
    bigBang();

    const resizeHandler = () => {
      hasPendingResizeRef.current = true;
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                startAnimation();
              } else {
                stopAnimation();
              }
            },
            { rootMargin: "240px 0px" },
          )
        : null;

    observer?.observe(parent);

    if (!observer) {
      startAnimation();
    }

    window.addEventListener("resize", resizeHandler, { passive: true });

    if (mouseAdjust) {
      parent.addEventListener("mousemove", mouseHandler, { passive: true });
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", resizeHandler);
      stopAnimation();
      parent.removeEventListener("mousemove", mouseHandler);
    };
  }, [bgColor, easing, hyperspace, mouseAdjust, opacity, quantity, speed, starColor, warpFactor]);

  return (
    <div
      className={className}
      data-starfield-id={uidRef.current}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          position: "sticky",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      />
    </div>
  );
}
