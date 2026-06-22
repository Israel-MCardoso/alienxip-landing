export function getDiagnosticUrl() {
  const configuredUrl = import.meta.env.NEXT_PUBLIC_DIAGNOSTIC_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/diagnostico`;
  }

  return "/diagnostico";
}

export function isDiagnosticEntry() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.pathname.startsWith("/diagnostico") || window.location.hostname.startsWith("diagnostico.");
}
