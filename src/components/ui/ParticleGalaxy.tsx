import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { WebGLErrorBoundary, WebGLFallback } from "./webgl-error-boundary";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

export interface ParticleGalaxyProps {
  className?: string;
  particleCount?: number;
  particleSize?: number;
  rotationSpeed?: number;
  spiralArms?: number;
  colors?: [string, string, string];
  mouseInfluence?: number;
  autoRotate?: boolean;
  blendMode?: "additive" | "normal";
  spread?: number;
  density?: number;
  glow?: number;
  cameraMovement?: boolean;
  centerConcentration?: number;
  verticalSpread?: number;
  pulsate?: boolean;
  pulsateSpeed?: number;
  enableZoom?: boolean;
  enableDrag?: boolean;
  enableTouch?: boolean;
  damping?: number;
  minZoom?: number;
  maxZoom?: number;
  orientation?: "horizontal" | "vertical";
  minRadius?: number;
}

export function ParticleGalaxy({
  className,
  particleCount = 10000,
  particleSize = 0.02,
  rotationSpeed = 0.001,
  spiralArms = 3,
  colors = ["#4f46e5", "#8b5cf6", "#ec4899"],
  mouseInfluence = 0.5,
  autoRotate = true,
  blendMode = "additive",
  spread = 2.5,
  density = 0.7,
  glow = 60,
  cameraMovement = true,
  centerConcentration = 0.5,
  verticalSpread = 1,
  pulsate = true,
  pulsateSpeed = 1,
  enableZoom = true,
  enableDrag = true,
  enableTouch = true,
  damping = 0.1,
  minZoom = 1.5,
  maxZoom = 10,
  orientation = "horizontal",
  minRadius = 0,
}: ParticleGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | undefined>(undefined);
  const isActiveRef = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hasWebGLError, setHasWebGLError] = useState(false);

  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0, z: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0, z: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const targetZoomRef = useRef(3);
  const currentZoomRef = useRef(3);
  const colorKey = colors.join("|");

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (hasWebGLError || !canvasRef.current || !containerRef.current || dimensions.width === 0 || dimensions.height === 0) {
      return;
    }

    try {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000);
      camera.position.z = 3;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      renderer.setSize(dimensions.width, dimensions.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);
      const colorPalette = colors.map((color) => new THREE.Color(color));

      for (let i = 0; i < particleCount; i += 1) {
        const i3 = i * 3;
        const actualMinRadius = minRadius > 0 ? minRadius : 0;
        const radius = actualMinRadius + Math.pow(Math.random(), centerConcentration) * (spread - actualMinRadius);
        const spinAngle = radius * spiralArms;
        const branchAngle = ((i % spiralArms) / spiralArms) * Math.PI * 2 + spinAngle;
        const randomnessStrength = 0.3 * (spread / 2.5);
        
        let randomX = 0;
        let randomY = 0;
        let randomZ = 0;

        if (orientation === "vertical") {
          randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomnessStrength;
          randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomnessStrength;
          const zFalloff = verticalSpread === 1 ? Math.pow(Math.random(), 3) : Math.random();
          randomZ = zFalloff * (Math.random() < 0.5 ? 1 : -1) * randomnessStrength * verticalSpread;

          positions[i3] = Math.cos(branchAngle) * radius + randomX;
          positions[i3 + 1] = Math.sin(branchAngle) * radius + randomY;
          positions[i3 + 2] = randomZ;
        } else {
          randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomnessStrength;
          const yFalloff = verticalSpread === 1 ? Math.pow(Math.random(), 3) : Math.random();
          randomY = yFalloff * (Math.random() < 0.5 ? 1 : -1) * randomnessStrength * verticalSpread;
          randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomnessStrength;

          positions[i3] = Math.cos(branchAngle) * radius + randomX;
          positions[i3 + 1] = randomY;
          positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ;
        }

        const mixedColor = colorPalette[i % colorPalette.length].clone();
        const centerDistance = radius / spread;

        if (blendMode === "normal") {
          mixedColor.lerp(new THREE.Color("#000000"), centerDistance * 0.5);
        } else {
          mixedColor.lerp(new THREE.Color("#ffffff"), 1 - centerDistance);
        }

        particleColors[i3] = mixedColor.r;
        particleColors[i3 + 1] = mixedColor.g;
        particleColors[i3 + 2] = mixedColor.b;
        scales[i] = Math.random();
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
      geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: particleSize * 100 },
          uGlow: { value: glow / 100 },
          uDensity: { value: density },
          uPulsate: { value: pulsate ? 1.0 : 0.0 },
          uPulsateSpeed: { value: pulsateSpeed },
        },
        vertexShader: `
          uniform float uTime;
          uniform float uSize;
          uniform float uPulsate;
          uniform float uPulsateSpeed;
          attribute float scale;
          attribute vec3 color;
          varying vec3 vColor;

          void main() {
            vColor = color;
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            if (uPulsate > 0.5) {
              float pulsateValue = sin(uTime * uPulsateSpeed + position.x * 10.0) * 0.5 + 0.5;
              modelPosition.y += pulsateValue * 0.02;
            }

            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
            gl_PointSize = uSize * scale * (1.0 / -viewPosition.z);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          uniform float uGlow;
          uniform float uDensity;

          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = uGlow / distanceToCenter - (uGlow * 2.0);
            strength = max(0.0, strength);
            gl_FragColor = vec4(vColor, strength * uDensity);
          }
        `,
        transparent: true,
        blending: blendMode === "additive" ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const handleMouseMove = (event: MouseEvent) => {
        if (isDraggingRef.current) {
          return;
        }

        const rect = container.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      };

      const handleMouseLeave = () => {
        if (!isDraggingRef.current) {
          mouseRef.current.x = 0;
          mouseRef.current.y = 0;
        }
      };

      const handleMouseDown = (event: MouseEvent) => {
        if (!enableDrag) {
          return;
        }

        isDraggingRef.current = true;
        previousMouseRef.current = { x: event.clientX, y: event.clientY };
        container.style.cursor = "grabbing";
      };

      const handleMouseMoveGlobal = (event: MouseEvent) => {
        if (!isDraggingRef.current || !enableDrag) {
          return;
        }

        const deltaX = event.clientX - previousMouseRef.current.x;
        const deltaY = event.clientY - previousMouseRef.current.y;
        targetRotationRef.current.y += deltaX * 0.005;
        targetRotationRef.current.x += deltaY * 0.005;
        targetRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationRef.current.x));
        previousMouseRef.current = { x: event.clientX, y: event.clientY };
      };

      const handleMouseUp = () => {
        if (!enableDrag) {
          return;
        }

        isDraggingRef.current = false;
        container.style.cursor = enableDrag ? "grab" : "default";
      };

      const handleWheel = (event: WheelEvent) => {
        if (!enableZoom) {
          return;
        }

        event.preventDefault();
        targetZoomRef.current += event.deltaY * 0.001;
        targetZoomRef.current = Math.max(minZoom, Math.min(maxZoom, targetZoomRef.current));
      };

      let touchStartDistance = 0;
      let touchStartZoom = 3;
      const getTouchDistance = (touches: TouchList) => {
        if (touches.length < 2) {
          return 0;
        }

        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
      };

      const handleTouchStart = (event: TouchEvent) => {
        if (!enableTouch) {
          return;
        }

        if (event.touches.length === 2) {
          touchStartDistance = getTouchDistance(event.touches);
          touchStartZoom = targetZoomRef.current;
        } else if (event.touches.length === 1 && enableDrag) {
          isDraggingRef.current = true;
          previousMouseRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }
      };

      const handleTouchMove = (event: TouchEvent) => {
        if (!enableTouch) {
          return;
        }

        if (event.touches.length === 2 && enableZoom) {
          event.preventDefault();
          const currentDistance = getTouchDistance(event.touches);
          const zoomFactor = touchStartDistance / currentDistance;
          targetZoomRef.current = Math.max(minZoom, Math.min(maxZoom, touchStartZoom * zoomFactor));
        } else if (event.touches.length === 1 && isDraggingRef.current && enableDrag) {
          const deltaX = event.touches[0].clientX - previousMouseRef.current.x;
          const deltaY = event.touches[0].clientY - previousMouseRef.current.y;
          targetRotationRef.current.y += deltaX * 0.005;
          targetRotationRef.current.x += deltaY * 0.005;
          targetRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationRef.current.x));
          previousMouseRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }
      };

      const handleTouchEnd = () => {
        if (!enableTouch) {
          return;
        }

        isDraggingRef.current = false;
        touchStartDistance = 0;
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMoveGlobal);
      document.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart, { passive: false });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });
      container.addEventListener("touchend", handleTouchEnd);
      container.style.cursor = enableDrag ? "grab" : "default";

      const startTime = performance.now();
      const animate = () => {
        const elapsedTime = (performance.now() - startTime) / 1000;

        material.uniforms.uTime.value = elapsedTime;
        currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * damping;
        currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * damping;
        currentRotationRef.current.z += (targetRotationRef.current.z - currentRotationRef.current.z) * damping;

        if (autoRotate && !isDraggingRef.current) {
          if (orientation === "vertical") {
            targetRotationRef.current.z += rotationSpeed;
          } else {
            targetRotationRef.current.y += rotationSpeed;
          }
        }

        const targetTiltX = !isDraggingRef.current && mouseInfluence > 0 ? mouseRef.current.y * mouseInfluence * 0.3 : 0;
        const targetTiltY = !isDraggingRef.current && mouseInfluence > 0 ? mouseRef.current.x * mouseInfluence * 0.3 : 0;
        currentTiltRef.current.x += (targetTiltX - currentTiltRef.current.x) * 0.05;
        currentTiltRef.current.y += (targetTiltY - currentTiltRef.current.y) * 0.05;
        particles.rotation.x = currentRotationRef.current.x + currentTiltRef.current.x;
        particles.rotation.y = currentRotationRef.current.y + currentTiltRef.current.y;
        particles.rotation.z = currentRotationRef.current.z;

        currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * damping;
        camera.position.z = currentZoomRef.current;

        if (cameraMovement && !isDraggingRef.current) {
          camera.position.x = Math.sin(elapsedTime * 0.1) * 0.2;
          camera.position.y = Math.cos(elapsedTime * 0.15) * 0.2;
        } else if (isDraggingRef.current) {
          camera.position.x += (0 - camera.position.x) * 0.1;
          camera.position.y += (0 - camera.position.y) * 0.1;
        }

        camera.lookAt(scene.position);
        renderer.render(scene, camera);

        if (isActiveRef.current) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      const startAnimation = () => {
        if (frameRef.current !== undefined) {
          return;
        }

        isActiveRef.current = true;
        frameRef.current = requestAnimationFrame(animate);
      };

      const stopAnimation = () => {
        isActiveRef.current = false;

        if (frameRef.current !== undefined) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = undefined;
        }
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
              { rootMargin: "520px 0px" },
            )
          : null;

      observer?.observe(container);

      if (!observer) {
        startAnimation();
      }

      return () => {
        observer?.disconnect();
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMoveGlobal);
        document.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);

        stopAnimation();

        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    } catch {
      setHasWebGLError(true);
      return undefined;
    }
  }, [
    hasWebGLError,
    dimensions,
    particleCount,
    particleSize,
    rotationSpeed,
    spiralArms,
    colorKey,
    mouseInfluence,
    autoRotate,
    blendMode,
    spread,
    density,
    glow,
    cameraMovement,
    centerConcentration,
    verticalSpread,
    pulsate,
    pulsateSpeed,
    enableZoom,
    enableDrag,
    enableTouch,
    damping,
    minZoom,
    maxZoom,
    orientation,
    minRadius,
  ]);

  if (hasWebGLError) {
    return (
      <div ref={containerRef} className={cn("particle-galaxy", className)}>
        <WebGLFallback className="particle-galaxy-fallback" />
      </div>
    );
  }

  return (
    <WebGLErrorBoundary fallback={<WebGLFallback className="particle-galaxy particle-galaxy-fallback" />}>
      <div ref={containerRef} className={cn("particle-galaxy", className)}>
        <canvas ref={canvasRef} className="particle-galaxy-canvas" />
      </div>
    </WebGLErrorBoundary>
  );
}
