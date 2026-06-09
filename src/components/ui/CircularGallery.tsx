import React, { HTMLAttributes, useEffect, useRef, useState } from "react";

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
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastReportedIndexRef = useRef(activeIndex);

    useEffect(() => {
      if (items.length === 0) {
        return;
      }

      const anglePerItem = 360 / items.length;
      setRotation(-activeIndex * anglePerItem);
    }, [activeSignal, items.length]);

    useEffect(() => {
      if (items.length === 0 || !onActiveIndexChange) {
        return;
      }

      const anglePerItem = 360 / items.length;
      const nextIndex = ((Math.round(-rotation / anglePerItem) % items.length) + items.length) % items.length;

      if (nextIndex !== lastReportedIndexRef.current) {
        lastReportedIndexRef.current = nextIndex;
        onActiveIndexChange(nextIndex);
      }
    }, [items.length, onActiveIndexChange, rotation]);

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
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

    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) {
          setRotation((previous) => previous + autoRotateSpeed);
        }

        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, autoRotateSpeed]);

    if (items.length === 0) {
      return null;
    }

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Galeria circular de portfolio"
        className={cn("circular-gallery", className)}
        {...props}
      >
        <div
          className="circular-gallery-track"
          style={{
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          {items.map((item, index) => {
            const itemAngle = index * anglePerItem;
            const totalRotation = rotation % 360;
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
                }}
              >
                <div className="circular-gallery-card">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    loading="lazy"
                    decoding="async"
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
