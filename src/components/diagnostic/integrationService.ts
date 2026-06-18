export interface DiagnosticPayload {
  answers: {
    name?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    segment?: string;
    focus?: string;
    bottlenecks?: string[];
    budget?: string;
    timeline?: string;
  };
  metrics: {
    score: number;
    technicalFriction: number;
    salesVelocity: number;
    brandDifferentiation: number;
    automationPotential: string;
    criticalAreas: string[];
  };
}

/**
 * Handles sending the compiled strategic telemetry signals to integration providers.
 * Easily swap the mock implementations below with real SDK calls.
 */
export async function sendDiagnosticTransmission(payload: DiagnosticPayload): Promise<boolean> {
  try {
    const history = JSON.parse(localStorage.getItem("alienxip_diagnostics") || "[]");
    history.push({
      id: `xip-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...payload,
    });
    localStorage.setItem("alienxip_diagnostics", JSON.stringify(history));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("LocalStorage Buffer Error:", error);
    }
  }

  // Execute integration queue concurrently
  const results = await Promise.allSettled([
    integrateEmail(payload),
    integrateSupabase(payload),
    integrateCRM(payload),
  ]);

  const allSuccess = results.every((r) => r.status === "fulfilled");
  return allSuccess;
}

/**
 * 1. EMAIL INTEGRATION (E.g. Resend, SendGrid, Amazon SES)
 * Configured to send form data to comercial@alienxip.com.br via mailto link.
 */
async function integrateEmail(payload: DiagnosticPayload): Promise<void> {
  const email = "comercial@alienxip.com.br";
  const subject = "Novo relatório recebido pela landing page da ALIENXIP";
  
  const body = `
==================================================
RELATÓRIO DE DIAGNÓSTICO E TELEMETRIA - ALIENXIP
==================================================

DADOS DO COMANDANTE:
--------------------------------------------------
Nome: ${payload.answers.name || "Não informado"}
Empresa: ${payload.answers.companyName || "Não informada"}
E-mail: ${payload.answers.email || "Não informado"}
WhatsApp: ${payload.answers.phone || "Não informado"}

MÉTRICAS ORBITAIS:
--------------------------------------------------
Eficiência Geral (Maturidade): ${payload.metrics.score}%
Atrito Técnico (Fricção): ${payload.metrics.technicalFriction}%
Velocidade de Escala (Vendas): ${payload.metrics.salesVelocity}%
Resistência de Marca: ${payload.metrics.brandDifferentiation}%
Potencial de Automação: ${payload.metrics.automationPotential}
Áreas Críticas: ${payload.metrics.criticalAreas.join(", ")}

DADOS DO DIAGNÓSTICO:
--------------------------------------------------
Segmento: ${payload.answers.segment || "Não informado"}
Foco Principal: ${payload.answers.focus || "Não informado"}
Gargalos Identificados:
${payload.answers.bottlenecks && payload.answers.bottlenecks.length > 0 
  ? payload.answers.bottlenecks.map(b => `- ${b}`).join("\n") 
  : "Nenhum gargalo selecionado"}
Orçamento Estimado: ${payload.answers.budget || "Não informado"}
Cronograma (Timeline): ${payload.answers.timeline || "Não informado"}

==================================================
Gerado automaticamente via Landing Page ALIENXIP
==================================================
  `.trim();

  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  window.location.href = mailtoUrl;
}

/**
 * 2. DATABASE INTEGRATION (Supabase, Firebase, Custom PostgreSQL API)
 */
async function integrateSupabase(_payload: DiagnosticPayload): Promise<void> {
  // To integrate, replace with:
  // const { data, error } = await supabase.from('leads').insert([{
  //   name: payload.answers.name,
  //   email: payload.answers.email,
  //   company: payload.answers.companyName,
  //   phone: payload.answers.phone,
  //   segment: payload.answers.segment,
  //   score: payload.metrics.score,
  //   data: payload
  // }]);
}

/**
 * 3. CRM INTEGRATION (E.g. RD Station, HubSpot, ActiveCampaign)
 */
async function integrateCRM(_payload: DiagnosticPayload): Promise<void> {
  // To integrate, replace with:
  // fetch('https://api.rd.services/platform/conversions', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     event_type: "CONVERSION",
  //     event_family: "CDP",
  //     payload: {
  //       email: payload.answers.email,
  //       name: payload.answers.name,
  //       personal_phone: payload.answers.phone,
  //       company: payload.answers.companyName,
  //       cf_segmento: payload.answers.segment,
  //       cf_maturidade: payload.metrics.score
  //     }
  //   })
  // })
}
