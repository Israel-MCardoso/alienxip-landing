import { motion, MotionValue, useTransform } from "framer-motion";

type ScrollCueProps = {
  progress: MotionValue<number>;
};

export function ScrollCue({ progress }: ScrollCueProps) {
  const opacity = useTransform(progress, [0, 0.16], [1, 0]);
  const y = useTransform(progress, [0, 0.16], [0, 18]);

  return (
    <motion.a
      className="scroll-cue"
      href="#missao-001"
      style={{ opacity, y }}
      aria-label="Iniciar missão"
    >
      <motion.span
        className="scroll-arrow"
        aria-hidden="true"
        animate={{ y: [0, 7, 0], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        ↓
      </motion.span>
      <span>Iniciar missão</span>
      <span className="scroll-glint" aria-hidden="true" />
    </motion.a>
  );
}
