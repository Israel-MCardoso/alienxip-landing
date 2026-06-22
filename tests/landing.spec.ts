import { expect, test } from "@playwright/test";

test("landing routes the critical conversion flow to the diagnostic experience", async ({ page }) => {
  const consoleIssues: string[] = [];
  page.on("console", (message) => {
    const text = message.text();
    const isHeadlessGpuNoise =
      text.includes("GL Driver Message") && text.includes("GPU stall due to ReadPixels");

    if (["error", "warning"].includes(message.type()) && !isHeadlessGpuNoise) {
      consoleIssues.push(`${message.type()}: ${message.text()}`);
    }
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Tecnologia para empresas/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Iniciar diagn.stico estrat.gico/i }).first()).toBeVisible();

  await page.getByRole("link", { name: /Iniciar diagn.stico estrat.gico/i }).first().click();
  await expect(page).toHaveURL(/\/diagnostico$/);
  await expect(page.locator(".diagnostic-overlay")).toBeVisible({ timeout: 15_000 });

  expect(consoleIssues).toEqual([]);
});

test("mobile diagnostic uses a service dropdown with other description and automatic report delivery", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "mobile-only service selection flow");

  await page.route("**/api/send-diagnostic-report", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, id: "test-email-id" }),
    });
  });

  await page.goto("/diagnostico");

  const favicon = page.locator('link[rel~="icon"]');
  await expect(favicon).toHaveAttribute("href", /favicon/i);
  await expect(page.locator(".diagnostic-overlay")).toBeVisible({ timeout: 15_000 });

  await page.locator("#sync-name").fill("Ada Lovelace");
  await page.locator("#sync-company").fill("Orbital Labs");
  await page.locator("#sync-email").fill("ada@orbital.test");
  await page.locator("#sync-phone").fill("(11) 99999-9999");
  await page.getByRole("button", { name: /Servi.os/i }).tap();
  await page.getByRole("button", { name: /CONTINUAR AN.LISE/i }).tap();

  const serviceSelect = page.locator(".mobile-option-select").first();
  await expect(serviceSelect).toBeVisible();
  await serviceSelect.click({ force: true });
  await expect(page.locator(".mobile-select-menu")).toBeVisible();
  await page.locator(".mobile-select-option", { hasText: "Outro" }).tap();

  const otherDescription = page.locator("#other-service-description-dialog");
  await expect(otherDescription).toBeVisible();
  await otherDescription.fill("Quero uma automacao de atendimento para WhatsApp e CRM");
  await page.getByRole("button", { name: /Confirmar op..o/i }).tap();
  await page.getByRole("button", { name: /GERAR LEITURA PRELIMINAR/i }).tap();

  await page.locator(".option-card", { hasText: "Retrabalho" }).tap();
  await page.getByRole("button", { name: /CONTINUAR VARREDURA/i }).tap();
  await page.locator(".mobile-option-select").click({ force: true });
  await page.locator(".mobile-select-option", { hasText: /Entre R\$ 10\.000 e R\$ 30\.000/i }).click({ force: true });
  await page.locator(".question-card-footer .ctrl-btn-primary").click({ force: true });
  await expect(page.getByText(/SETOR EPSILON/i)).toBeVisible();
  await page.locator(".mobile-option-select").click({ force: true });
  await page.locator(".mobile-select-option", { hasText: /Curto prazo/i }).click({ force: true });
  await page.locator(".question-card-footer .ctrl-btn-primary").click({ force: true });

  await expect(page.getByText(/Efici.ncia Orbital Geral/i)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/A..ES CR.TICAS DE FASE/i)).toBeVisible();
  await expect(page.getByText(/TRANSMITINDO RELAT.RIO/i)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/TRANSMISS.O RECEBIDA/i)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("button", { name: /ENVIAR TRANSMISS.O/i })).toHaveCount(0);
  await expect(page.getByText(/O relat.rio foi enviado automaticamente/i)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Voltar para a Terra/i })).toBeVisible();

  const reportScroll = await page.evaluate(() => {
    const overlay = document.querySelector(".diagnostic-overlay");
    if (!overlay) return null;
    overlay.scrollTop = overlay.scrollHeight;
    const bottom = overlay.scrollTop;
    overlay.scrollTop = 0;
    return {
      bottom,
      top: overlay.scrollTop,
      canScroll: overlay.scrollHeight > overlay.clientHeight,
    };
  });
  expect(reportScroll?.canScroll).toBe(true);
  expect(reportScroll?.bottom).toBeGreaterThan(0);
  expect(reportScroll?.top).toBe(0);

  const diagnostics = await page.evaluate(() => localStorage.getItem("alienxip_diagnostics"));
  expect(diagnostics).toContain("Quero uma automacao de atendimento para WhatsApp e CRM");
});
