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

type StarData = [number, number, number, number, number, number, number, boolean];

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
    arr: StarData[];
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
    arr: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (!canvas || !parent) {
      return undefined;
    }

    const ratio = quantity / 2;
    const compSpeed = hyperspace ? speed * warpFactor : speed;
    const fill = hyperspace ? `rgba(0,0,0,${opacity})` : bgColor;

    const measureViewport = () => {
      const data = starRef.current;
      data.w = canvas.clientWidth || parent.clientWidth || window.innerWidth;
      data.h = canvas.clientHeight || parent.clientHeight || window.innerHeight;
      data.x = Math.round(data.w / 2);
      data.y = Math.round(data.h / 2);
      data.z = (data.w + data.h) / 2;
      data.colorRatio = 1 / data.z;

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
      data.arr = Array.from({ length: quantity }, () => [
        Math.random() * data.w * 2 - data.x * 2,
        Math.random() * data.h * 2 - data.y * 2,
        Math.round(Math.random() * data.z),
        0,
        0,
        0,
        0,
        true,
      ]);
    };

    const setupCanvas = () => {
      measureViewport();
      const data = starRef.current;
      data.ctx = canvas.getContext("2d");
      canvas.width = data.w;
      canvas.height = data.h;

      if (data.ctx) {
        data.ctx.fillStyle = fill;
        data.ctx.strokeStyle = starColor;
      }
    };

    const resize = () => {
      const data = starRef.current;
      const oldStars = data.arr.map((star) => [...star] as StarData);
      measureViewport();
      data.cw = data.ctx?.canvas.width ?? 0;
      data.ch = data.ctx?.canvas.height ?? 0;

      if (!data.ctx || (data.cw === data.w && data.ch === data.h)) {
        return;
      }

      const rw = data.cw ? data.w / data.cw : 1;
      const rh = data.ch ? data.h / data.ch : 1;

      data.ctx.canvas.width = data.w;
      data.ctx.canvas.height = data.h;

      if (!oldStars.length) {
        bigBang();
      } else {
        data.arr = oldStars.map((star) => {
          const next = [...star] as StarData;
          next[0] = star[0] * rw;
          next[1] = star[1] * rh;
          next[3] = data.x + (next[0] / next[2]) * ratio;
          next[4] = data.y + (next[1] / next[2]) * ratio;
          return next;
        });
      }

      data.ctx.fillStyle = fill;
      data.ctx.strokeStyle = starColor;
    };

    const update = () => {
      const data = starRef.current;
      mouseRef.current.x = mouseAdjust ? (cursorRef.current.x - data.x) / easing : 0;
      mouseRef.current.y = mouseAdjust ? (cursorRef.current.y - data.y) / easing : 0;

      data.arr = data.arr.map((star) => {
        const next = [...star] as StarData;
        next[7] = true;
        next[5] = next[3];
        next[6] = next[4];
        next[0] += mouseRef.current.x >> 4;

        if (next[0] > data.x << 1) {
          next[0] -= data.w << 1;
          next[7] = false;
        }
        if (next[0] < -data.x << 1) {
          next[0] += data.w << 1;
          next[7] = false;
        }

        next[1] += mouseRef.current.y >> 4;
        if (next[1] > data.y << 1) {
          next[1] -= data.h << 1;
          next[7] = false;
        }
        if (next[1] < -data.y << 1) {
          next[1] += data.h << 1;
          next[7] = false;
        }

        next[2] -= compSpeed;
        if (next[2] > data.z) {
          next[2] -= data.z;
          next[7] = false;
        }
        if (next[2] < 0) {
          next[2] += data.z;
          next[7] = false;
        }

        next[3] = data.x + (next[0] / next[2]) * ratio;
        next[4] = data.y + (next[1] / next[2]) * ratio;
        return next;
      });
    };

    const draw = () => {
      const data = starRef.current;
      const ctx = data.ctx;

      if (!ctx) {
        return;
      }

      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, data.w, data.h);
      ctx.strokeStyle = starColor;

      data.arr.forEach((star) => {
        if (star[5] > 0 && star[5] < data.w && star[6] > 0 && star[6] < data.h && star[7]) {
          ctx.lineWidth = (1 - data.colorRatio * star[2]) * 2;
          ctx.beginPath();
          ctx.moveTo(star[5], star[6]);
          ctx.lineTo(star[3], star[4]);
          ctx.stroke();
          ctx.closePath();
        }
      });
    };

    const animate = () => {
      if (hasPendingResizeRef.current) {
        resize();
        hasPendingResizeRef.current = false;
      }

      update();
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
    <div className={className} data-starfield-id={uidRef.current}>
      <canvas ref={canvasRef} />
    </div>
  );
}
