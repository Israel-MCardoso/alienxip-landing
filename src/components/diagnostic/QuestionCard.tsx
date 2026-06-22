import { useState } from "react";
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
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  otherInputId?: string;
  otherInputLabel?: string;
  otherInputPlaceholder?: string;
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
  otherValue = "",
  onOtherChange,
  otherInputId = "other-service-description",
  otherInputLabel = "Descreva o serviço desejado",
  otherInputPlaceholder = "Ex: automação de atendimento, CRM, IA para WhatsApp...",
}: QuestionCardProps) {
  const [isMobileSelectOpen, setIsMobileSelectOpen] = useState(false);
  const [isOtherDialogOpen, setIsOtherDialogOpen] = useState(false);
  
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

    if (optionValue === "outro" && onOtherChange) {
      setIsOtherDialogOpen(true);
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

  const hasOtherSelected =
    value === "outro" || (Array.isArray(value) && value.includes("outro"));
  const selectedOptionLabel =
    type === "select"
      ? options.find((option) => option.value === value)?.label
      : undefined;

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
        <>
          {type === "select" && (
            <div className="mobile-select-wrapper">
              <span className="mobile-select-label">Selecionar opção</span>
              <button
                type="button"
                className="mobile-option-select"
                aria-expanded={isMobileSelectOpen}
                onClick={() => setIsMobileSelectOpen((open) => !open)}
              >
                <span>{selectedOptionLabel || "Selecione uma opção"}</span>
                <span className="mobile-select-chevron" aria-hidden="true">⌄</span>
              </button>
              {isMobileSelectOpen && (
                <div className="mobile-select-menu">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`mobile-select-option ${value === option.value ? "is-selected" : ""}`}
                      onClick={() => {
                        handleSelectOption(option.value);
                        setIsMobileSelectOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                      {option.desc && <small>{option.desc}</small>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

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
        </>
      )}

      {hasOtherSelected && onOtherChange && otherValue.trim() && (
        <button
          type="button"
          className="other-service-summary"
          onClick={() => setIsOtherDialogOpen(true)}
        >
          <span>Outro informado:</span>
          <strong>{otherValue}</strong>
        </button>
      )}

      {hasOtherSelected && onOtherChange && isOtherDialogOpen && (
        <div className="other-service-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby={`${otherInputId}-title`}>
          <motion.div
            className="other-service-dialog"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 id={`${otherInputId}-title`}>{otherInputLabel}</h3>
            <p>Informe manualmente a opção para que ela entre no relatório final.</p>
            <textarea
              id={`${otherInputId}-dialog`}
              value={otherValue}
              onChange={(event) => onOtherChange(event.target.value)}
              placeholder={otherInputPlaceholder}
              rows={4}
              autoFocus
            />
            <div className="other-service-dialog-actions">
              <button
                type="button"
                className="ctrl-btn"
                onClick={() => setIsOtherDialogOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="ctrl-btn ctrl-btn-primary"
                disabled={!otherValue.trim()}
                onClick={() => setIsOtherDialogOpen(false)}
              >
                Confirmar opção
              </button>
            </div>
          </motion.div>
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
