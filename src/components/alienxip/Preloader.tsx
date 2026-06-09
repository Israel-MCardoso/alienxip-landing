import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

const NUM_ROWS = 5;
const ROW_DURATION = 0.6;
const STAGGER = 0.08;

export function Preloader({ onComplete }: PreloaderProps) {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    // Phase 1: Text Fade In & Visible (2.0s total)
    const textOutTimer = setTimeout(() => {
      setShowText(false);
    }, 2000);

    // Phase 2: Text Fade Out (0.8s) -> Trigger complete to start exit animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(textOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="preloader-container"
      initial={{ backgroundColor: "rgba(8, 8, 10, 1)" }}
      animate={{ backgroundColor: "rgba(8, 8, 10, 1)" }}
      exit={{ 
        backgroundColor: "rgba(8, 8, 10, 0)",
        transition: { duration: 0.01 } // instantly transparent when exit starts to show the reveal
      }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        pointerEvents: "all",
      }}
    >
      {/* Welcome Text */}
      <AnimatePresence>
        {showText && (
          <motion.div
            className="preloader-text-wrapper"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: [0.215, 0.610, 0.355, 1.000] }}
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            <h1 className="preloader-welcome-text">Bem-vindo(a) a ALIENXIP</h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double Stairs Transition Rows (now in black, acting as the backdrop itself) */}
      <div 
        className="preloader-stairs-container" 
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {[...Array(NUM_ROWS)].map((_, i) => (
          <motion.div
            key={i}
            className="preloader-stair-row"
            custom={i}
            initial={{ x: "0%" }} // Already covering the screen on mount
            exit={{
              x: "100%",
              transition: {
                duration: ROW_DURATION,
                ease: [0.76, 0, 0.24, 1],
                delay: i * STAGGER,
              },
            }}
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "#08080a", // Match theme dark background
              willChange: "transform",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
