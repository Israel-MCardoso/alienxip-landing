"use client";

import React, { CSSProperties, ElementType, ReactNode, useRef } from "react";
import { HoverBorderGradient } from "./hover-border-gradient";

type CardContainerProps = {
  children: ReactNode;
  className?: string;
};

type CardBodyProps = {
  children: ReactNode;
  className?: string;
};

type CardItemProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  translateZ?: number | string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function CardContainer({ children, className = "" }: CardContainerProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    const rect = body.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const rotateY = ((pointerX / rect.width) - 0.5) * 9;
    const rotateX = ((pointerY / rect.height) - 0.5) * -7;

    body.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    body.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      className={`alienxip-card-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<CardBodyProps>(child)) {
          return child;
        }

        return React.cloneElement(child, {
          bodyRef,
        } as CardBodyProps & { bodyRef: typeof bodyRef });
      })}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
  bodyRef,
}: CardBodyProps & { bodyRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <HoverBorderGradient containerClassName="alienxip-card-border-shell">
      <div ref={bodyRef} className={`alienxip-card-body ${className}`}>
        {children}
      </div>
    </HoverBorderGradient>
  );
}

export function CardItem<T extends ElementType = "div">({
  as,
  children,
  className = "",
  translateZ = 0,
  style,
  ...props
}: CardItemProps<T>) {
  const Component = as || "div";
  const depth = typeof translateZ === "number" ? `${translateZ}px` : `${translateZ}px`;
  const itemStyle: CSSProperties = {
    ...(style as CSSProperties),
    transform: `translateZ(${depth})`,
  };

  return (
    <Component className={`alienxip-card-item ${className}`} style={itemStyle} {...props}>
      {children}
    </Component>
  );
}
