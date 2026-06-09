import { useState } from "react";
import { motion } from "framer-motion";

export interface IdentityData {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  segment: string;
}

interface IdentitySyncCardProps {
  value: IdentityData;
  onChange: (data: IdentityData) => void;
  onNext: () => void;
}

const segments = [
  "Tecnologia",
  "Engenharia",
  "Educação",
  "Saúde",
  "Comércio",
  "Serviços",
  "Indústria",
  "Outro",
];

export function IdentitySyncCard({ value, onChange, onNext }: IdentitySyncCardProps) {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleNext = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!value.name?.trim()) newErrors.name = true;
    if (!value.companyName?.trim()) newErrors.companyName = true;
    if (!value.email?.trim() || !validateEmail(value.email)) newErrors.email = true;
    if (!value.phone?.trim() || value.phone.trim().length < 8) newErrors.phone = true;
    if (!value.segment) newErrors.segment = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const handleChangeField = (field: keyof IdentityData, val: string) => {
    onChange({ ...value, [field]: val });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="question-card-container identity-sync-container">
      <div className="question-card-header">
        <span className="question-sector-badge">SETOR ALFA-1: ASSINATURA DE TRIPULAÇÃO</span>
        <h2 className="question-text" style={{ fontSize: "20px" }}>
          Antes de iniciarmos, precisamos identificar sua operação.
        </h2>
      </div>

      <div className="identity-sync-grid">
        {/* Left Inputs Column */}
        <div className="identity-inputs-column">
          <div className="form-group">
            <label htmlFor="sync-name">Nome Completo</label>
            <input
              id="sync-name"
              type="text"
              className={`holo-input ${errors.name ? "has-error" : ""}`}
              value={value.name || ""}
              onChange={(e) => handleChangeField("name", e.target.value)}
              placeholder="Ex: Alan Shepard"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sync-company">Nome da Empresa</label>
            <input
              id="sync-company"
              type="text"
              className={`holo-input ${errors.companyName ? "has-error" : ""}`}
              value={value.companyName || ""}
              onChange={(e) => handleChangeField("companyName", e.target.value)}
              placeholder="Ex: Orbital Corp"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sync-email">E-mail Corporativo</label>
            <input
              id="sync-email"
              type="email"
              className={`holo-input ${errors.email ? "has-error" : ""}`}
              value={value.email || ""}
              onChange={(e) => handleChangeField("email", e.target.value)}
              placeholder="Ex: comandante@empresa.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sync-phone">WhatsApp de Contato</label>
            <input
              id="sync-phone"
              type="tel"
              className={`holo-input ${errors.phone ? "has-error" : ""}`}
              value={value.phone || ""}
              onChange={(e) => handleChangeField("phone", e.target.value)}
              placeholder="Ex: (11) 99999-9999"
            />
          </div>
        </div>

        {/* Right Segment Grid */}
        <div className="identity-segments-column">
          <label className="segments-grid-label">Segmento de Atuação</label>
          <div className={`segments-grid ${errors.segment ? "has-error-grid" : ""}`}>
            {segments.map((seg) => {
              const isSelected = value.segment === seg;
              return (
                <motion.button
                  key={seg}
                  type="button"
                  className={`segment-token-btn ${isSelected ? "is-active" : ""}`}
                  onClick={() => handleChangeField("segment", seg)}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(157, 24, 255, 0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                >
                  <span className="segment-token-dot" />
                  {seg}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="question-card-footer" style={{ marginTop: "40px", justifyContent: "flex-end" }}>
        <motion.button
          className="ctrl-btn ctrl-btn-primary"
          onClick={handleNext}
          type="button"
          style={{ padding: "14px 40px" }}
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          CONTINUAR ANÁLISE &rarr;
        </motion.button>
      </div>
    </div>
  );
}
