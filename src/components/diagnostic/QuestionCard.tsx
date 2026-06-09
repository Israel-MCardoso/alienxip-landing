import { motion } from "framer-motion";

export interface Option {
  value: string;
  label: string;
  desc?: string;
}

interface QuestionCardProps {
  sector: string;
  question: string;
  description?: string;
  type: "text" | "select" | "multiselect";
  options?: Option[];
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  canPrev: boolean;
  canNext: boolean;
  nextLabel?: string;
}

export function QuestionCard({
  sector,
  question,
  description,
  type,
  options = [],
  value,
  onChange,
  onNext,
  onPrev,
  canPrev,
  canNext,
  nextLabel,
}: QuestionCardProps) {
  
  const handleSelectOption = (optionValue: string) => {
    if (type === "select") {
      onChange(optionValue);
    } else if (type === "multiselect") {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v) => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    }
  };

  const isOptionSelected = (optionValue: string) => {
    if (type === "select") {
      return value === optionValue;
    }
    if (type === "multiselect") {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return false;
  };

  return (
    <div className="question-card-container">
      <div className="question-card-header">
        <span className="question-sector-badge">{sector}</span>
        <h2 className="question-text">{question}</h2>
        {description && <p className="question-description">{description}</p>}
      </div>

      {type === "text" && (
        <div className="holo-input-wrapper">
          <input
            type="text"
            className="holo-input"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Insira as coordenadas..."
            autoFocus
          />
          <div className="holo-input-border" />
        </div>
      )}

      {(type === "select" || type === "multiselect") && (
        <div className={(type === "multiselect" || options.length > 4) ? "multiselect-grid" : "options-grid"}>
          {options.map((option) => {
            const selected = isOptionSelected(option.value);
            return (
              <motion.div
                key={option.value}
                className={`option-card ${selected ? "is-selected" : ""}`}
                onClick={() => handleSelectOption(option.value)}
                whileHover={{ x: 6, backgroundColor: "rgba(157, 24, 255, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
              >
                <div className="option-text-wrap">
                  <span className="option-title">{option.label}</span>
                  {option.desc && <span className="option-desc">{option.desc}</span>}
                </div>
                <div className="option-checkbox-indicator">
                  {selected && (
                    <motion.svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="question-card-footer">
        <motion.button
          className="ctrl-btn"
          onClick={onPrev}
          disabled={!canPrev}
          type="button"
          whileHover={canPrev ? { scale: 1.02, x: -2 } : {}}
          whileTap={canPrev ? { scale: 0.98 } : {}}
        >
          &lt; Voltar
        </motion.button>
        <motion.button
          className="ctrl-btn ctrl-btn-primary"
          onClick={onNext}
          disabled={!canNext}
          type="button"
          whileHover={canNext ? { scale: 1.02, x: 2 } : {}}
          whileTap={canNext ? { scale: 0.98 } : {}}
        >
          {nextLabel || "Avançar >"}
        </motion.button>
      </div>
    </div>
  );
}
