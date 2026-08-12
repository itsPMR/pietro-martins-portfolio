import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("presents the professional narrative and selected projects", async ({
  page,
}) => {
  await expect(page).toHaveTitle("Pietro Martins | Desenvolvedor em formação");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(
    page.getByRole("heading", { level: 1, name: /Pietro Martins/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "ClassFlow" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "PMR Truco" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "PMR Assist" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /primeira oportunidade/i }),
  ).toBeVisible();
});

test("exposes verified destinations and the downloadable resume", async ({
  page,
}) => {
  await expect(
    page.getByRole("link", { name: "GitHub" }).first(),
  ).toHaveAttribute("href", "https://github.com/itsPMR");
  await expect(
    page.getByRole("link", { name: "LinkedIn" }).first(),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/pietropmr/");
  await expect(
    page.getByRole("link", { name: "Abrir projeto" }),
  ).toHaveAttribute("href", "https://pmr-truco.vercel.app");
  await expect(
    page.getByRole("link", { name: /Currículo/i }).first(),
  ).toHaveAttribute("href", "/downloads/curriculo-pietro-martins.pdf");

  const resumeResponse = await page.request.get(
    "/downloads/curriculo-pietro-martins.pdf",
  );
  expect(resumeResponse.ok()).toBeTruthy();
  expect(resumeResponse.headers()["content-type"]).toContain("application/pdf");
});

test("serves complete local metadata without accidental indexing", async ({
  page,
}) => {
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "http://localhost:3000",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/opengraph-image/,
  );

  const [robotsResponse, sitemapResponse, socialImageResponse] =
    await Promise.all([
      page.request.get("/robots.txt"),
      page.request.get("/sitemap.xml"),
      page.request.get("/opengraph-image"),
    ]);

  expect(await robotsResponse.text()).toContain("Disallow: /");
  expect(await sitemapResponse.text()).toContain("http://localhost:3000");
  expect(socialImageResponse.headers()["content-type"]).toContain("image/png");
});

test("has no horizontal overflow", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
});

test("mobile navigation traps focus, closes with Escape and focuses a destination", async ({
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 1_000) > 900,
    "Mobile-only interaction",
  );

  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await toggle.click();
  const closeToggle = page.getByRole("button", { name: "Fechar menu" });
  const mobileNavigation = page.getByRole("navigation", {
    name: "Navegação mobile",
  });
  const firstLink = mobileNavigation.getByRole("link", { name: /Projetos/ });

  await expect(closeToggle).toHaveAttribute("aria-expanded", "true");
  await expect(firstLink).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(closeToggle).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();

  await toggle.click();
  await mobileNavigation.getByRole("link", { name: /Sobre/ }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#sobre")).toBeFocused();
});

test("has no serious or critical automated accessibility violations", async ({
  page,
}) => {
  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = results.violations.filter(({ impact }) =>
    ["serious", "critical"].includes(impact ?? ""),
  );

  expect(blockingViolations).toEqual([]);
});

test("mobile menu has no serious or critical accessibility violations", async ({
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 1_000) > 900,
    "Mobile-only interaction",
  );

  await page.getByRole("button", { name: "Abrir menu" }).click();
  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = results.violations.filter(({ impact }) =>
    ["serious", "critical"].includes(impact ?? ""),
  );

  expect(blockingViolations).toEqual([]);
});
