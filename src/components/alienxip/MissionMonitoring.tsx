import { motion } from "framer-motion";
import { ScrambleText } from "../ui/ScrambleText";
import mission003Notebook from "../../assets/mission-003-notebook.png";
import mission003ScreenVideo from "../../assets/mission-003-screen.mp4";

export function MissionMonitoring() {
  return (
    <section
      className="mission-004"
      id="missao-004"
      aria-labelledby="mission-004-title"
      data-orbital-sector="004"
    >
      <motion.div
        className="mission-004-copy"
        initial={{ opacity: 0, y: 18, filter: "blur(7px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="mission-004-label">MISSÃO 004</p>
        <h2 id="mission-004-title">
          <ScrambleText text="Resultados não surgem." scrambleOnScroll />
          <br />
          <ScrambleText text="Eles são " scrambleOnScroll />
          <span>
            <ScrambleText text="monitorados." scrambleOnScroll />
          </span>
        </h2>
        <p>
          Toda transformação gera sinais.
          <br />
          Toda operação deixa métricas.
          <br />
          Toda evolução precisa ser medida.
        </p>
      </motion.div>

      <motion.div
        className="mission-004-visual"
        initial={{ opacity: 0, x: 48, scale: 0.96, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.32 }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        aria-hidden="true"
      >
        <div className="mission-004-screen-video">
          <video src={mission003ScreenVideo} autoPlay muted loop playsInline preload="metadata" />
        </div>
        <img src={mission003Notebook} alt="" draggable="false" />
      </motion.div>
    </section>
  );
}
