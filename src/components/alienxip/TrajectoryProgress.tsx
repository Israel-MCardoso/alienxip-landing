import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ScrollRange = {
  reveal: number;
  start: number;
  end: number;
};

export function TrajectoryProgress() {
  const progressValue = useMotionValue(0);
  const rangeRef = useRef<ScrollRange>({ reveal: 0, start: 0, end: 1 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateRange = () => {
      const firstMission = document.querySelector<HTMLElement>('[data-orbital-sector="001"]');
      const missionStart = firstMission ? firstMission.getBoundingClientRect().top + window.scrollY : window.innerHeight;
      const pageEnd = Math.max(missionStart + 1, document.documentElement.scrollHeight - window.innerHeight);

      rangeRef.current = {
        reveal: Math.max(0, missionStart - window.innerHeight * 0.12),
        start: missionStart,
        end: pageEnd,
      };
    };

    const updateScroll = () => {
      const range = rangeRef.current;
      const scrollY = window.scrollY;
      const nextProgress = Math.min(1, Math.max(0, (scrollY - range.start) / (range.end - range.start || 1)));

      progressValue.set(nextProgress);
      setIsVisible(scrollY >= range.reveal);
    };

    const handleUpdate = () => {
      updateRange();
      updateScroll();
    };

    handleUpdate();
    const resizeObserver = new ResizeObserver(handleUpdate);
    resizeObserver.observe(document.documentElement);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("load", handleUpdate);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("load", handleUpdate);
    };
  }, [progressValue]);

  const progress = useSpring(progressValue, { stiffness: 80, damping: 24, mass: 0.5 });

  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  const glowOpacity = useTransform(progress, [0, 0.55, 1], [0.22, 0.62, 0.9]);

  return (
    <motion.div
      className="trajectory-progress"
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-hidden="true"
    >
      <span>TRAJETÓRIA EM CURSO</span>
      <div className="trajectory-progress-track">
        <motion.i style={{ scaleX, opacity: glowOpacity }} />
      </div>
    </motion.div>
  );
}
