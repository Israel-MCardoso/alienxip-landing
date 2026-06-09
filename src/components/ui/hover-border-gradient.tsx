"use client";

import { ElementType, ReactNode } from "react";

type HoverBorderGradientProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function HoverBorderGradient<T extends ElementType = "div">({
  as,
  children,
  className = "",
  containerClassName = "",
  ...props
}: HoverBorderGradientProps<T>) {
  const Component = as || "div";

  return (
    <Component className={`hover-border-gradient ${containerClassName}`} {...props}>
      <span className="hover-border-gradient-glow" aria-hidden="true" />
      <span className={`hover-border-gradient-content ${className}`}>{children}</span>
    </Component>
  );
}
