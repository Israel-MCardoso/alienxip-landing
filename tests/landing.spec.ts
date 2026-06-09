import { expect, test } from "@playwright/test";

test("landing renders the critical conversion flow", async ({ page }, testInfo) => {
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
  await expect(page.getByRole("link", { name: /Iniciar diagnóstico estratégico/i }).first()).toBeVisible();

  await page.getByRole("link", { name: /Iniciar diagnóstico estratégico/i }).first().click();
  await expect(page.locator("#diagnostico")).toBeInViewport();

  await page.locator("#diagnostico").scrollIntoViewIfNeeded();
  const finalCta = page.locator(".mission-007-cta");
  await expect(finalCta).toHaveCount(1);
  await finalCta.scrollIntoViewIfNeeded();
  await expect(finalCta).toBeVisible();
  if (testInfo.project.name.includes("mobile")) {
    await finalCta.tap();
  } else {
    await finalCta.dispatchEvent("click");
  }
  await expect(page.locator(".diagnostic-overlay")).toBeVisible({ timeout: 15_000 });

  expect(consoleIssues).toEqual([]);
});
