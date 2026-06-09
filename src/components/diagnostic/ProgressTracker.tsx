import { motion } from "framer-motion";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepsInfo: Array<{ title: string; subtitle: string }>;
}

export function ProgressTracker({ currentStep, totalSteps, stepsInfo }: ProgressTrackerProps) {
  return (
    <div className="tracker-hud">
      <div className="tracker-hud-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="hud-status-indicator" style={{ width: "6px", height: "6px", animation: "blink 1.5s infinite" }} />
          <span>STATUS: DIAGNÓSTICO ORBITAL EM CURSO</span>
        </div>
        <span>SETOR {currentStep + 1} DE {totalSteps}</span>
      </div>
      <div className="tracker-hud-steps">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div 
              key={index} 
              className={`tracker-hud-step-node ${isActive ? "is-active" : ""} ${isCompleted ? "is-completed" : ""}`}
              title={`${stepsInfo[index]?.title || `Sector ${index + 1}`}`}
              style={{ position: "relative", overflow: "hidden" }}
            >
              <motion.div 
                className="tracker-hud-step-fill"
                initial={{ width: "0%" }}
                animate={{ width: isActive || isCompleted ? "100%" : "0%" }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                style={{
                  background: isCompleted 
                    ? "#b95cff" 
                    : "linear-gradient(90deg, #9d18ff, #b95cff)",
                  boxShadow: isActive ? "0 0 10px rgba(157, 24, 255, 0.8)" : "none"
                }}
              />
              {isActive && (
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "25%",
                    background: "rgba(255, 255, 255, 0.35)",
                    filter: "blur(1px)",
                  }}
                  animate={{ left: ["-25%", "100%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="tracker-hud-header" style={{ marginTop: '4px' }}>
        <span>COORD_SYS: ALIENXIP-MOTHER-NODE-{(1023 + currentStep * 442).toString(16).toUpperCase()}</span>
        <span style={{ color: '#b95cff', textShadow: "0 0 8px rgba(185, 92, 255, 0.4)" }}>
          {stepsInfo[currentStep] ? stepsInfo[currentStep].subtitle.toUpperCase() : "AGUARDANDO"}
        </span>
      </div>
    </div>
  );
}
