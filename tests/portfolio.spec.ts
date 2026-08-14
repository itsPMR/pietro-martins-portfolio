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

  const sectionOrder = await page
    .locator("main > section")
    .evaluateAll((sections) => sections.map((section) => section.id));
  expect(sectionOrder).toEqual([
    "topo",
    "sobre",
    "projetos",
    "tecnologias",
    "formacao",
    "contato",
  ]);

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Explorar projeto ClassFlow" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Explorar projeto PMR Truco" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Explorar projeto PMR Assist" }),
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
    page.getByRole("link", { name: /Currículo/i }).first(),
  ).toHaveAttribute("href", "/downloads/curriculo-pietro-martins.pdf");

  await page
    .getByRole("button", { name: "Explorar projeto PMR Truco" })
    .click();
  const trucoDialog = page.getByRole("dialog", { name: "PMR Truco" });
  await expect(trucoDialog).toBeVisible();
  await expect(
    trucoDialog.getByRole("link", { name: "Abrir projeto" }),
  ).toHaveAttribute("href", "https://pmr-truco.vercel.app");
  await expect(
    trucoDialog.getByRole("link", { name: "Abrir projeto" }),
  ).toHaveAttribute("target", "_blank");
  await page.keyboard.press("Escape");
  await expect(trucoDialog).toBeHidden();

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

  await page
    .getByRole("button", { name: "Explorar projeto PMR Assist" })
    .click();
  const modalDimensions = await page.evaluate(() => {
    const dialog = document.querySelector<HTMLElement>("#project-dialog");
    const scrollArea = document.querySelector<HTMLElement>(
      ".project-dialog-scroll",
    );

    return {
      bodyClientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.documentElement.scrollWidth,
      dialogClientWidth: dialog?.clientWidth ?? 0,
      dialogScrollWidth: dialog?.scrollWidth ?? 0,
      scrollAreaClientWidth: scrollArea?.clientWidth ?? 0,
      scrollAreaScrollWidth: scrollArea?.scrollWidth ?? 0,
    };
  });

  expect(modalDimensions.bodyScrollWidth).toBeLessThanOrEqual(
    modalDimensions.bodyClientWidth + 1,
  );
  expect(modalDimensions.dialogScrollWidth).toBeLessThanOrEqual(
    modalDimensions.dialogClientWidth + 1,
  );
  expect(modalDimensions.scrollAreaScrollWidth).toBeLessThanOrEqual(
    modalDimensions.scrollAreaClientWidth + 1,
  );
});

test("opens every case and supports keyboard, backdrop and minimize closing", async ({
  page,
}) => {
  const classFlowTrigger = page.getByRole("button", {
    name: "Explorar projeto ClassFlow",
  });
  await classFlowTrigger.click();

  const classFlowDialog = page.getByRole("dialog", { name: "ClassFlow" });
  const classFlowClose = classFlowDialog.getByRole("button", {
    name: "Fechar projeto ClassFlow",
  });
  await expect(classFlowDialog).toBeVisible();
  await expect(classFlowClose).toBeFocused();
  await expect(page.locator("body")).toHaveAttribute(
    "data-project-open",
    "true",
  );
  await expect(
    classFlowDialog.getByRole("heading", {
      name: "ClassFlow",
      level: 2,
    }),
  ).toBeVisible();
  await expect(
    classFlowDialog.getByRole("link", { name: "Ler documentação" }),
  ).toHaveAttribute("href", "https://itspmr.github.io/ClassFlow/");

  await classFlowDialog
    .getByRole("link", { name: "Ler documentação" })
    .evaluate((link) => {
      link.addEventListener("click", (event) => event.preventDefault(), {
        once: true,
      });
      link.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });
  await expect(classFlowDialog).toBeVisible();

  const lastDialogButton = classFlowDialog.getByRole("button", {
    name: "Voltar aos projetos",
  });
  await lastDialogButton.focus();
  await page.keyboard.press("Tab");
  await expect(
    classFlowDialog.getByRole("button", {
      name: "Minimizar projeto ClassFlow",
    }),
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(classFlowDialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveAttribute(
    "data-project-open",
    "true",
  );
  await expect(classFlowTrigger).toBeFocused();

  const trucoTrigger = page.getByRole("button", {
    name: "Explorar projeto PMR Truco",
  });
  await trucoTrigger.click();
  const trucoDialog = page.getByRole("dialog", { name: "PMR Truco" });
  await expect(trucoDialog).toBeVisible();

  if ((page.viewportSize()?.width ?? 0) > 672) {
    await page
      .locator(".project-modal-root")
      .click({ position: { x: 4, y: 4 } });
  } else {
    await trucoDialog
      .getByRole("button", { name: "Fechar projeto PMR Truco" })
      .click();
  }
  await expect(trucoDialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveAttribute(
    "data-project-open",
    "true",
  );
  await expect(trucoTrigger).toBeFocused();

  const assistTrigger = page.getByRole("button", {
    name: "Explorar projeto PMR Assist",
  });
  await assistTrigger.click();
  const assistDialog = page.getByRole("dialog", { name: "PMR Assist" });
  await expect(assistDialog).toBeVisible();
  await assistDialog
    .getByRole("button", { name: "Minimizar projeto PMR Assist" })
    .click();
  await expect(assistDialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveAttribute(
    "data-project-open",
    "true",
  );
  await expect(assistTrigger).toBeFocused();
});

test("navigation anchors follow the new section order", async ({ page }) => {
  const expectedHrefs = [
    "#sobre",
    "#projetos",
    "#tecnologias",
    "#formacao",
    "#contato",
  ];
  const desktopHrefs = await page
    .locator(".desktop-nav a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  const mobileHrefs = await page
    .locator(".mobile-nav nav a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));

  expect(desktopHrefs).toEqual(expectedHrefs);
  expect(mobileHrefs).toEqual(expectedHrefs);

  for (const href of expectedHrefs) {
    await expect(page.locator(href)).toHaveCount(1);
  }

  if ((page.viewportSize()?.width ?? 0) > 900) {
    for (const href of expectedHrefs) {
      await page.locator(`.desktop-nav a[href="${href}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${href}$`));
    }
  }
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
  const firstLink = mobileNavigation.getByRole("link", { name: /Sobre/ });

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

test("expanded project has no serious or critical accessibility violations", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Explorar projeto ClassFlow" })
    .click();
  await expect(page.getByRole("dialog", { name: "ClassFlow" })).toBeVisible();

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
