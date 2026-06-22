export interface DiagnosticPayload {
  answers: {
    name?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    segment?: string;
    focus?: string;
    focusOther?: string;
    bottlenecks?: string[];
    bottlenecksOther?: string;
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
  report: {
    companyName: string;
    recommendations: string[];
    summary: string;
  };
}

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

  await Promise.all([
    integrateEmail(payload),
    integrateSupabase(payload),
    integrateCRM(payload),
  ]);

  return true;
}

async function integrateEmail(payload: DiagnosticPayload): Promise<void> {
  const response = await fetch("/api/send-diagnostic-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Diagnostic email endpoint rejected the report");
  }
}

async function integrateSupabase(_payload: DiagnosticPayload): Promise<void> {
  // Future database persistence hook.
}

async function integrateCRM(_payload: DiagnosticPayload): Promise<void> {
  // Future CRM integration hook.
}
