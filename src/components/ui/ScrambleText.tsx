import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScrambleWordProps {
  word: string;
  characters: string;
  speed: number;
  steps: number;
  triggerRef?: React.RefObject<HTMLElement | null>;
  triggerState?: boolean;
}

function ScrambleWord({
  word,
  characters,
  speed,
  steps,
  triggerRef,
  triggerState,
}: ScrambleWordProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);
  const originalTextRef = useRef<string>(word);

  // Keep original word updated
  useEffect(() => {
    originalTextRef.current = word;
    if (elementRef.current) {
      elementRef.current.textContent = word;
    }
  }, [word]);

  const startScramble = () => {
    const el = elementRef.current;
    if (!el) return;

    const original = originalTextRef.current;
    if (!original) return;

    // Clear any active timer
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    let step = 0;

    const tick = () => {
      let result = "";
      for (let i = 0; i < original.length; i++) {
        // Yuta Abe logic: step > (i / original.length) * steps resolves the character
        const resolved = step > (i / original.length) * steps;
        if (resolved) {
          result += original[i];
        } else {
          result += characters[Math.floor(Math.random() * characters.length)];
        }
      }

      el.textContent = result;
      step++;

      if (step <= steps) {
        timerRef.current = window.setTimeout(tick, speed);
      } else {
        el.textContent = original;
      }
    };

    tick();
  };

  useEffect(() => {
    // Listen to mouseenter if triggerRef is provided
    const triggerEl = triggerRef ? triggerRef.current : elementRef.current;
    if (!triggerEl) return;

    triggerEl.addEventListener("mouseenter", startScramble);

    return () => {
      triggerEl.removeEventListener("mouseenter", startScramble);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [triggerRef, triggerRef?.current]);

  // Scramble once triggerState becomes true
  useEffect(() => {
    if (triggerState) {
      startScramble();
    }
  }, [triggerState]);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        verticalAlign: "baseline",
      }}
    >
      {/* Invisible layout holder that preserves original width, height and baseline */}
      <span style={{ opacity: 0, pointerEvents: "none" }} aria-hidden="true">
        {word}
      </span>
      {/* Absolute positioned active scramble text overlay */}
      <span
        ref={elementRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          display: "inline-block",
          width: "100%",
          height: "100%",
        }}
      >
        {word}
      </span>
    </span>
  );
}

interface ScrambleTextProps {
  text: string;
  characters?: string;
  speed?: number;
  steps?: number;
  triggerRef?: React.RefObject<HTMLElement | null>;
  triggerState?: boolean;
  scrambleOnScroll?: boolean;
  className?: string;
}

export function ScrambleText({
  text,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  speed = 55,
  steps = 10,
  triggerRef,
  triggerState: externalTriggerState,
  scrambleOnScroll = false,
  className,
}: ScrambleTextProps) {
  const [scrollInView, setScrollInView] = useState(false);
  const triggerState = externalTriggerState || (scrambleOnScroll && scrollInView);

  const lines = text.split("\n");

  const content = (
    <>
      {lines.map((line, lineIdx) => {
        const words = line.split(" ");
        return (
          <span key={lineIdx} style={{ display: "inline" }}>
            {words.map((word, wordIdx) => (
              <span key={wordIdx} style={{ display: "inline" }}>
                <ScrambleWord
                  word={word}
                  characters={characters}
                  speed={speed}
                  steps={steps}
                  triggerRef={triggerRef}
                  triggerState={triggerState}
                />
                {wordIdx < words.length - 1 ? " " : ""}
              </span>
            ))}
            {lineIdx < lines.length - 1 ? <br /> : ""}
          </span>
        );
      })}
    </>
  );

  if (scrambleOnScroll) {
    return (
      <motion.span
        className={className}
        onViewportEnter={() => setScrollInView(true)}
        viewport={{ once: true, amount: 0.3 }}
        style={{ display: "inline" }}
      >
        {content}
      </motion.span>
    );
  }

  return <span className={className}>{content}</span>;
}
