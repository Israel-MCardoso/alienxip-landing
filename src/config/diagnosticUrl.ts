declare const process: any;

export function getDiagnosticUrl() {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "/diagnostico";
  }

  const envUrl = 
    (typeof import.meta !== "undefined" && import.meta.env?.NEXT_PUBLIC_DIAGNOSTIC_URL) ||
    (typeof process !== "undefined" && process?.env?.NEXT_PUBLIC_DIAGNOSTIC_URL);

  return envUrl || "https://alienxip.com.br/diagnostico";
}

export function isDiagnosticEntry() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.pathname.startsWith("/diagnostico") || window.location.hostname.startsWith("diagnostico.");
}
