import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resend } from "resend";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const port = Number(process.env.PORT || 4173);

function loadLocalEnv() {
  const envPath = path.join(rootDir, ".env.local");

  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMax = 8;
const rateLimitStore = new Map();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(body));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeText(value, fallback = "Nao informado") {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.socket.remoteAddress || "unknown";
}

function checkRateLimit(request) {
  const now = Date.now();
  const ip = getIp(request);
  const current = rateLimitStore.get(ip);

  if (!current || current.expiresAt <= now) {
    rateLimitStore.set(ip, { count: 1, expiresAt: now + rateLimitWindowMs });
    return true;
  }

  current.count += 1;
  return current.count <= rateLimitMax;
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > 128 * 1024) {
      throw new Error("Payload muito grande");
    }
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function validatePayload(payload) {
  const answers = payload?.answers || {};
  const metrics = payload?.metrics || {};
  const report = payload?.report || {};
  const missing = [];

  if (!normalizeText(answers.name, "")) missing.push("nome");
  if (!normalizeText(answers.companyName, "")) missing.push("empresa/projeto");
  if (!isEmail(answers.email)) missing.push("e-mail");
  if (!normalizeText(answers.phone, "")) missing.push("WhatsApp");
  if (!normalizeText(answers.segment, "")) missing.push("segmento");
  if (!normalizeText(answers.focus, "")) missing.push("servico/foco");
  if (!normalizeText(answers.budget, "")) missing.push("orcamento");
  if (!normalizeText(answers.timeline, "")) missing.push("prazo");
  if (answers.focus === "outro" && !normalizeText(answers.focusOther, "")) {
    missing.push("descricao de Outros");
  }
  if (!Array.isArray(answers.bottlenecks) || answers.bottlenecks.length === 0) {
    missing.push("respostas do diagnostico");
  }
  if (answers.bottlenecks?.includes("outro") && !normalizeText(answers.bottlenecksOther, "")) {
    missing.push("descricao do outro sinal");
  }
  if (!Number.isFinite(metrics.score)) missing.push("score");
  if (!Array.isArray(metrics.criticalAreas)) missing.push("areas criticas");
  if (!normalizeText(report.summary, "")) missing.push("resumo final");

  return missing;
}

function list(values) {
  return Array.isArray(values) && values.length > 0 ? values.join(", ") : "Nao informado";
}

function buildTextEmail(payload) {
  const { answers, metrics, report } = payload;
  return `
NOVO DIAGNOSTICO RECEBIDO - ALIENXIP

DADOS DO CONTATO
Nome: ${normalizeText(answers.name)}
Empresa/Projeto: ${normalizeText(answers.companyName)}
E-mail: ${normalizeText(answers.email)}
WhatsApp: ${normalizeText(answers.phone)}
Segmento: ${normalizeText(answers.segment)}

SERVICOS E RESPOSTAS
Servico/Foco: ${normalizeText(answers.focus)}
Outros: ${normalizeText(answers.focusOther)}
Gargalos/Sinais: ${list(answers.bottlenecks)}
Outro sinal descrito: ${normalizeText(answers.bottlenecksOther)}
Orcamento: ${normalizeText(answers.budget)}
Prazo: ${normalizeText(answers.timeline)}

RELATORIO FINAL
Empresa analisada: ${normalizeText(report.companyName)}
Resumo: ${normalizeText(report.summary)}
Eficiencia geral: ${metrics.score}%
Atrito tecnico: ${metrics.technicalFriction}%
Velocidade de escala: ${metrics.salesVelocity}%
Resistencia de marca: ${metrics.brandDifferentiation}%
Potencial de automacao: ${normalizeText(metrics.automationPotential)}
Areas criticas: ${list(metrics.criticalAreas)}

RECOMENDACOES
${Array.isArray(report.recommendations) ? report.recommendations.map((item, index) => `${index + 1}. ${item}`).join("\n") : "Nao informado"}
  `.trim();
}

function buildHtmlEmail(payload) {
  const { answers, metrics, report } = payload;
  const rows = [
    ["Nome", answers.name],
    ["Empresa/Projeto", answers.companyName],
    ["E-mail", answers.email],
    ["WhatsApp", answers.phone],
    ["Segmento", answers.segment],
    ["Servico/Foco", answers.focus],
    ["Outros", answers.focusOther],
    ["Gargalos/Sinais", list(answers.bottlenecks)],
    ["Outro sinal descrito", answers.bottlenecksOther],
    ["Orcamento", answers.budget],
    ["Prazo", answers.timeline],
  ];

  const metricRows = [
    ["Eficiencia geral", `${metrics.score}%`],
    ["Atrito tecnico", `${metrics.technicalFriction}%`],
    ["Velocidade de escala", `${metrics.salesVelocity}%`],
    ["Resistencia de marca", `${metrics.brandDifferentiation}%`],
    ["Potencial de automacao", metrics.automationPotential],
    ["Areas criticas", list(metrics.criticalAreas)],
  ];

  const renderRows = (items) =>
    items
      .map(
        ([label, value]) => `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #241534;color:#b98cff;font-weight:700;">${escapeHtml(label)}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #241534;color:#f4f1ea;">${escapeHtml(normalizeText(value))}</td>
          </tr>
        `,
      )
      .join("");

  const recommendations = Array.isArray(report.recommendations)
    ? report.recommendations.map((item) => `<li style="margin:0 0 10px;">${escapeHtml(item)}</li>`).join("")
    : "<li>Nao informado</li>";

  return `
    <div style="margin:0;padding:28px;background:#07040d;color:#f4f1ea;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:720px;margin:0 auto;border:1px solid #3b145d;background:#100818;border-radius:10px;overflow:hidden;">
        <div style="padding:26px 28px;background:#160a22;border-bottom:1px solid #3b145d;">
          <p style="margin:0 0 8px;color:#b98cff;letter-spacing:0.12em;text-transform:uppercase;font-size:12px;">ALIENXIP Diagnostico</p>
          <h1 style="margin:0;color:#ffffff;font-size:24px;line-height:1.25;">Novo diagnostico recebido</h1>
          <p style="margin:10px 0 0;color:#cfc4d8;">${escapeHtml(normalizeText(report.summary))}</p>
        </div>

        <div style="padding:24px 28px;">
          <h2 style="margin:0 0 12px;color:#ffffff;font-size:18px;">Dados preenchidos</h2>
          <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#0b0512;border:1px solid #241534;">
            ${renderRows(rows)}
          </table>

          <h2 style="margin:28px 0 12px;color:#ffffff;font-size:18px;">Relatorio final</h2>
          <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#0b0512;border:1px solid #241534;">
            ${renderRows(metricRows)}
          </table>

          <h2 style="margin:28px 0 12px;color:#ffffff;font-size:18px;">Recomendacoes</h2>
          <ol style="margin:0;padding-left:22px;color:#f4f1ea;">
            ${recommendations}
          </ol>
        </div>
      </div>
    </div>
  `;
}

async function handleDiagnosticEmail(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { message: "Metodo nao permitido" });
  }

  if (!checkRateLimit(request)) {
    return sendJson(response, 429, { message: "Muitas tentativas. Tente novamente em alguns minutos." });
  }

  if (!process.env.RESEND_API_KEY || !resend) {
    return sendJson(response, 500, { message: "RESEND_API_KEY nao configurada no Railway." });
  }

  if (!process.env.REPORT_RECIPIENT_EMAIL || !process.env.RESEND_FROM_EMAIL) {
    return sendJson(response, 500, { message: "Variaveis de e-mail do relatorio nao configuradas." });
  }

  try {
    const payload = await readJsonBody(request);
    const missing = validatePayload(payload);

    if (missing.length > 0) {
      return sendJson(response, 400, {
        message: `Campos obrigatorios ausentes ou invalidos: ${missing.join(", ")}.`,
      });
    }

    const subjectName = normalizeText(payload.answers.companyName || payload.answers.name);
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.REPORT_RECIPIENT_EMAIL,
      subject: `Novo diagnostico recebido - ${subjectName}`,
      html: buildHtmlEmail(payload),
      text: buildTextEmail(payload),
    });

    if (error) {
      console.error("Resend diagnostic delivery failed:", error);
      return sendJson(response, 502, { message: "Nao foi possivel enviar o diagnostico agora." });
    }

    return sendJson(response, 200, { ok: true, id: data?.id });
  } catch (error) {
    console.error("Diagnostic email handler failed:", error);
    return sendJson(response, 400, { message: "Payload de diagnostico invalido." });
  }
}

async function serveStatic(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(distDir, safePath);

  if (!filePath.startsWith(distDir) || !existsSync(filePath)) {
    filePath = path.join(distDir, "index.html");
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
  });

  createReadStream(filePath).pipe(response);
}

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (url.pathname === "/api/send-diagnostic-report") {
    await handleDiagnosticEmail(request, response);
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    sendJson(response, 404, { message: "API route not found" });
    return;
  }

  await serveStatic(request, response);
}).listen(port, () => {
  console.log(`ALIENXIP Railway server listening on port ${port}`);
  readFile(path.join(distDir, "index.html")).catch(() => {
    console.warn("dist/index.html not found. Run npm run build before starting the Railway server.");
  });
});
