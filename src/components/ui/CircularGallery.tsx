import React, { HTMLAttributes, useEffect, useRef } from "react";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;
  };
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  activeSignal?: number;
  radius?: number;
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      activeIndex = 0,
      onActiveIndexChange,
      activeSignal = 0,
      className,
      radius = 520,
      autoRotateSpeed = 0.018,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    
    const isDraggingRef = useRef(false);
    const isScrollingRef = useRef(false);
    const isTransitioningRef = useRef(false);
    
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const startRotationRef = useRef(0);
    const gestureDetectedRef = useRef<"none" | "horizontal" | "vertical">("none");
    
    const anglePerItem = 360 / items.length;
    const rotationRef = useRef(-activeIndex * anglePerItem);
    const lastReportedIndexRef = useRef(activeIndex);
    
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Merge forwarded ref with local ref
    const setRef = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    const updateDOM = (currentRotation: number, withTransition = false) => {
      if (!trackRef.current) return;
      
      if (withTransition) {
        isTransitioningRef.current = true;
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
        
        // Apply smooth transition
        trackRef.current.style.transition = "transform 350ms cubic-bezier(0.25, 1, 0.5, 1)";
        
        transitionTimeoutRef.current = setTimeout(() => {
          isTransitioningRef.current = false;
          if (trackRef.current) {
            trackRef.current.style.transition = "none";
          }
          const children = trackRef.current ? trackRef.current.children : [];
          for (let i = 0; i < children.length; i++) {
            const item = children[i] as HTMLElement;
            if (item) {
              item.style.transition = "none";
            }
          }
        }, 350);
      } else {
        if (!isTransitioningRef.current) {
          trackRef.current.style.transition = "none";
        }
      }
      
      trackRef.current.style.transform = `rotateY(${currentRotation}deg)`;
      
      // Update each item's opacity based on its angular position
      const children = trackRef.current.children;
      if (children.length === items.length) {
        for (let i = 0; i < items.length; i++) {
          const item = children[i] as HTMLElement;
          if (item) {
            const itemAngle = i * anglePerItem;
            const totalRotation = currentRotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.24, 1 - normalizedAngle / 150);
            
            if (withTransition) {
              item.style.transition = "opacity 350ms cubic-bezier(0.25, 1, 0.5, 1)";
            } else if (!isTransitioningRef.current) {
              item.style.transition = "none";
            }
            item.style.opacity = String(opacity);
          }
        }
      }
    };

    const checkIndexChange = (currentRotation: number) => {
      if (items.length === 0 || !onActiveIndexChange) return;
      const nextIndex = ((Math.round(-currentRotation / anglePerItem) % items.length) + items.length) % items.length;
      if (nextIndex !== lastReportedIndexRef.current) {
        lastReportedIndexRef.current = nextIndex;
        onActiveIndexChange(nextIndex);
      }
    };

    // Respond to external activeIndex / activeSignal changes (e.g. clicking buttons below)
    useEffect(() => {
      if (items.length === 0) {
        return;
      }
      const targetRotation = -activeIndex * anglePerItem;
      rotationRef.current = targetRotation;
      updateDOM(targetRotation, true);
    }, [activeSignal, items.length]);

    // Handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        if (isDraggingRef.current || isTransitioningRef.current) return;
        
        isScrollingRef.current = true;

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        
        rotationRef.current = scrollRotation;
        updateDOM(scrollRotation, false);

        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 150);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Frame-rate-independent auto-rotation
    useEffect(() => {
      let lastTime = performance.now();
      const autoRotate = (time: number) => {
        const shouldRotate = !isScrollingRef.current && !isDraggingRef.current && !isTransitioningRef.current;
        if (shouldRotate) {
          const delta = time - lastTime;
          const degreesPerMs = autoRotateSpeed / 16.67;
          rotationRef.current += degreesPerMs * delta;
          updateDOM(rotationRef.current, false);
          
          checkIndexChange(rotationRef.current);
        }
        lastTime = time;
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [autoRotateSpeed, items.length, onActiveIndexChange]);

    // Touch events for drag / swipe gesture
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;
        
        isDraggingRef.current = true;
        startXRef.current = e.touches[0].clientX;
        startYRef.current = e.touches[0].clientY;
        startRotationRef.current = rotationRef.current;
        gestureDetectedRef.current = "none";
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDraggingRef.current) return;
        if (e.touches.length !== 1) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - startXRef.current;
        const diffY = currentY - startYRef.current;

        if (gestureDetectedRef.current === "none") {
          const absX = Math.abs(diffX);
          const absY = Math.abs(diffY);
          
          if (absX > 10 || absY > 10) {
            if (absX > absY) {
              gestureDetectedRef.current = "horizontal";
            } else {
              gestureDetectedRef.current = "vertical";
              isDraggingRef.current = false;
            }
          }
        }

        if (gestureDetectedRef.current === "horizontal") {
          if (e.cancelable) {
            e.preventDefault();
          }
          
          const dragScale = 0.18;
          const currentRotation = startRotationRef.current + diffX * dragScale;
          
          rotationRef.current = currentRotation;
          updateDOM(currentRotation, false);
        }
      };

      const handleTouchEnd = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;

        if (gestureDetectedRef.current === "horizontal") {
          const targetIndex = ((Math.round(-rotationRef.current / anglePerItem) % items.length) + items.length) % items.length;
          const targetRotation = -targetIndex * anglePerItem;
          
          rotationRef.current = targetRotation;
          updateDOM(targetRotation, true);

          if (onActiveIndexChange) {
            onActiveIndexChange(targetIndex);
          }
        }
        gestureDetectedRef.current = "none";
      };

      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
      container.addEventListener("touchcancel", handleTouchEnd, { passive: true });

      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
        container.removeEventListener("touchcancel", handleTouchEnd);
      };
    }, [items.length, onActiveIndexChange, anglePerItem]);

    // Clean up timeouts on unmount
    useEffect(() => {
      return () => {
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
      };
    }, []);

    if (items.length === 0) {
      return null;
    }

    // Prepare initial values for the first render
    const initialRotation = rotationRef.current;

    return (
      <div
        ref={setRef}
        role="region"
        aria-label="Galeria circular de portfolio"
        className={cn("circular-gallery", className)}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          touchAction: "pan-y",
          ...props.style,
        }}
        {...props}
      >
        <div
          ref={trackRef}
          className="circular-gallery-track"
          style={{
            transform: `rotateY(${initialRotation}deg)`,
            transition: isTransitioningRef.current ? "transform 350ms cubic-bezier(0.25, 1, 0.5, 1)" : "none",
          }}
        >
          {items.map((item, index) => {
            const itemAngle = index * anglePerItem;
            const totalRotation = initialRotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.24, 1 - normalizedAngle / 150);

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                className="circular-gallery-item"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  opacity,
                  transition: isTransitioningRef.current ? "opacity 350ms cubic-bezier(0.25, 1, 0.5, 1)" : "none",
                }}
              >
                <div className="circular-gallery-card">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    style={{ objectPosition: item.photo.pos || "center" }}
                  />
                  <div className="circular-gallery-card-copy">
                    <h3>{item.common}</h3>
                    <em>{item.binomial}</em>
                    <p>{item.photo.by}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

CircularGallery.displayName = "CircularGallery";

export { CircularGallery };
