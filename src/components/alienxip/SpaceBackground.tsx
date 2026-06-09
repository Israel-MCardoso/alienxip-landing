import { motion, MotionValue, useReducedMotion, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import heroBackground from "../../../Fundo da Hero.png";
import heroVideo from "../../assets/hero-video.mp4";

type SpaceBackgroundProps = {
  progress: MotionValue<number>;
};

export function SpaceBackground({ progress }: SpaceBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const planetY = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [0, -42]);
  const planetScale = useTransform(progress, [0, 1], reduceMotion ? [1, 1] : [1.08, 1.02]);
  const starY = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [0, -18]);
  const hazeY = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [0, 32]);

  useMotionValueEvent(progress, "change", (latest) => {
    if (reduceMotion) return;
    const video = videoRef.current;
    if (video && !isNaN(video.duration) && video.duration > 0) {
      video.currentTime = latest * video.duration;
    }
  });

  const handleCanPlay = () => {
    setIsVideoReady(true);
    const video = videoRef.current;
    if (video && !isNaN(video.duration)) {
      video.currentTime = progress.get() * video.duration;
    }
  };

  return (
    <div className="space-background" aria-hidden="true">
      <div className="space-base" />
      <motion.div
        className="planet-layer"
        style={{
          backgroundImage: `url("${heroBackground}")`,
          y: planetY,
          scale: planetScale,
        }}
      />
      {!reduceMotion && (
        <video
          ref={videoRef}
          className={`hero-video-bg ${isVideoReady ? "is-ready" : ""}`}
          src={heroVideo}
          muted
          playsInline
          preload="auto"
          controls={false}
          onCanPlay={handleCanPlay}
        />
      )}
      <motion.div className="star-layer star-layer-a" style={{ y: starY }} />
      <motion.div className="star-layer star-layer-b" style={{ y: hazeY }} />
      <motion.div className="nebula-layer" style={{ y: hazeY }} />
      <div className="horizon-glow" />
      <div className="purple-shadow" />
      <div className="grain-layer" />
      <motion.i className="rare-particle particle-a" />
      <motion.i className="rare-particle particle-b" />
      <motion.i className="rare-particle particle-c" />
    </div>
  );
}

