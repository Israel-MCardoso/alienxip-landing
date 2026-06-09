import {
  motion,
  MotionStyle,
  MotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import shipImage from "../../assets/alienxip-ship-clean.webp";

type ShipScrollPathProps = {
  progress: MotionValue<number>;
};

export function ShipScrollPath({ progress }: ShipScrollPathProps) {
  const reduceMotion = useReducedMotion();
  const easedProgress = useTransform(progress, (value) => {
    const t = Math.min(1, Math.max(0, value));
    return t * t * (3 - 2 * t);
  });

  const x = useTransform(
    easedProgress,
    [0, 0.34, 0.68, 1],
    reduceMotion ? ["0vw", "0vw", "0vw", "0vw"] : ["0vw", "-8vw", "-22vw", "-38vw"],
  );
  const y = useTransform(
    easedProgress,
    [0, 0.34, 0.68, 1],
    reduceMotion ? ["0vh", "0vh", "0vh", "0vh"] : ["0vh", "-3vh", "-9vh", "-17vh"],
  );
  const scale = useTransform(
    easedProgress,
    [0, 0.34, 0.68, 1],
    reduceMotion ? [0.86, 0.86, 0.86, 0.86] : [1.18, 0.9, 0.58, 0.34],
  );
  const rotate = useTransform(
    easedProgress,
    [0, 0.34, 0.68, 1],
    reduceMotion ? [0, 0, 0, 0] : [0, -1, -3, -5],
  );
  const opacity = useTransform(easedProgress, [0, 0.34, 0.68, 1], [1, 0.96, 0.82, 0.55]);
  const atmosphericBlur = useTransform(
    easedProgress,
    [0, 0.34, 0.68, 1],
    ["blur(0px)", "blur(0px)", "blur(0.4px)", "blur(1px)"],
  );
  const trailOpacity = useTransform(easedProgress, [0, 0.34, 0.68, 1], [0.7, 0.5, 0.25, 0.06]);
  const trailScaleX = useTransform(easedProgress, [0, 0.34, 0.68, 1], [1.12, 0.85, 0.55, 0.25]);
  const trailBlur = useTransform(easedProgress, [0, 0.34, 0.68, 1], ["blur(18px)", "blur(16px)", "blur(14px)", "blur(10px)"]);
  const engineOpacity = useTransform(easedProgress, [0, 0.34, 0.68, 1], [0.62, 0.48, 0.28, 0.08]);
  const pathLength = useTransform(easedProgress, [0, 1], [0.06, 0.88]);
  const pathOpacity = useTransform(easedProgress, [0, 0.55, 1], [0.04, 0.025, 0]);

  const wrapperStyle = {
    "--ship-x": x,
    "--ship-y": y,
    "--ship-scale": scale,
    "--ship-rotate": rotate,
    opacity,
    filter: atmosphericBlur,
  } as unknown as MotionStyle;

  const trailStyle = {
    "--trail-scale-x": trailScaleX,
    opacity: trailOpacity,
    filter: trailBlur,
  } as unknown as MotionStyle;

  return (
    <div className="ship-field" aria-hidden="true">
      <svg className="orbital-path" viewBox="0 0 1200 760" preserveAspectRatio="none">
        <motion.path
          d="M 1040 520 C 936 500 796 458 648 386 C 508 318 382 246 230 172"
          fill="none"
          stroke="rgba(168,139,255,0.14)"
          strokeWidth="1"
          strokeDasharray="4 22"
          pathLength={pathLength}
          style={{ opacity: pathOpacity }}
        />
      </svg>

      <motion.div className="ship-wrapper" style={wrapperStyle}>
        <motion.span className="ship-trail" style={trailStyle} />
        <motion.span className="engine-glow engine-glow-a" style={{ opacity: engineOpacity }} />
        <motion.span className="engine-glow engine-glow-b" style={{ opacity: engineOpacity }} />
        <img src={shipImage} alt="" className="ship-image" draggable="false" />
      </motion.div>
    </div>
  );
}
