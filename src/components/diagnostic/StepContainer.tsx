import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepContainerProps {
  currentStepId: string | number;
  children: ReactNode;
}

export function StepContainer({ currentStepId, children }: StepContainerProps) {
  return (
    <div className="step-container" style={{ position: "relative", width: "100%" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.03, y: -10 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
