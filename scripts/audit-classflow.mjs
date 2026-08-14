import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl =
  process.env.CLASSFLOW_CASE_URL ?? "https://itspmr.github.io/ClassFlow/";
const outputDirectory = path.resolve("artifacts/classflow-audit");
const viewports = [
  { height: 1_000, name: "desktop", width: 1_440 },
  { height: 768, name: "tablet", width: 1_024 },
  { height: 844, name: "mobile", width: 390 },
];
const forbiddenPublicText = [
  /adicione prints/i,
  /docs\/prints/i,
  /texto para linkedin/i,
  /sua_chave_aqui/i,
  /sua_url_aqui/i,
  /\btodo\b/i,
];

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch();
const report = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      colorScheme: "dark",
      reducedMotion: "reduce",
      viewport,
    });
    const page = await context.newPage();
    const errors = [];

    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));

    const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
    if (!response?.ok()) {
      throw new Error(
        `${viewport.name}: o case respondeu com status ${response?.status() ?? "desconhecido"}.`,
      );
    }

    await page.evaluate(async () => {
      const viewportHeight = window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      for (let y = 0; y < pageHeight; y += viewportHeight * 0.75) {
        window.scrollTo(0, y);
        await new Promise((resolve) => window.setTimeout(resolve, 30));
      }

      await Promise.all(
        [...document.images].map((image) =>
          image.decode().catch(() => undefined),
        ),
      );
      window.scrollTo(0, 0);
    });

    const pageState = await page.evaluate(() => {
      const overflowing = [...document.querySelectorAll("body *")]
        .filter((element) => {
          const rectangle = element.getBoundingClientRect();
          return rectangle.left < -1 || rectangle.right > window.innerWidth + 1;
        })
        .slice(0, 15)
        .map((element) => ({
          className: String(element.className),
          tag: element.tagName.toLowerCase(),
        }));

      return {
        bodyText: document.body.innerText,
        clientWidth: document.documentElement.clientWidth,
        imageFailures: [...document.images]
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.getAttribute("src")),
        imagesWithoutAlt: [...document.images]
          .filter((image) => !image.hasAttribute("alt"))
          .map((image) => image.getAttribute("src")),
        internalAnchorsWithoutTarget: [
          ...document.querySelectorAll('a[href^="#"]'),
        ]
          .map((link) => link.getAttribute("href"))
          .filter((href) => href && !document.querySelector(href)),
        overflowing,
        scrollOverflowing: [...document.querySelectorAll("body *")]
          .filter(
            (element) =>
              element.scrollWidth > element.clientWidth + 1 &&
              element.scrollWidth > window.innerWidth,
          )
          .slice(0, 15)
          .map((element) => ({
            className: String(element.className),
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            tag: element.tagName.toLowerCase(),
          })),
        scrollWidth: document.documentElement.scrollWidth,
        sectionIds: [...document.querySelectorAll("main > section")].map(
          (section) => section.id,
        ),
      };
    });

    const blockingAccessibilityViolations = (
      await new AxeBuilder({ page }).analyze()
    ).violations.filter(({ impact }) =>
      ["serious", "critical"].includes(impact),
    );

    const forbiddenMatches = forbiddenPublicText
      .filter((pattern) => pattern.test(pageState.bodyText))
      .map((pattern) => String(pattern));

    await page.screenshot({
      fullPage: true,
      path: path.join(outputDirectory, `classflow-${viewport.name}-full.png`),
    });
    await page.screenshot({
      path: path.join(outputDirectory, `classflow-${viewport.name}-hero.png`),
    });

    await page.locator("#evidence-title").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(
        outputDirectory,
        `classflow-${viewport.name}-evidence.png`,
      ),
    });

    if (errors.length) {
      throw new Error(
        `${viewport.name}: erros no navegador: ${errors.join(" | ")}`,
      );
    }
    if (pageState.scrollWidth > pageState.clientWidth + 1) {
      throw new Error(
        `${viewport.name}: overflow horizontal de ${pageState.scrollWidth - pageState.clientWidth}px: ${JSON.stringify({ geometry: pageState.overflowing, scroll: pageState.scrollOverflowing })}.`,
      );
    }
    if (pageState.overflowing.length) {
      throw new Error(
        `${viewport.name}: elementos fora da viewport: ${JSON.stringify(pageState.overflowing)}.`,
      );
    }
    if (pageState.imageFailures.length || pageState.imagesWithoutAlt.length) {
      throw new Error(
        `${viewport.name}: imagens inválidas: ${JSON.stringify({ failures: pageState.imageFailures, withoutAlt: pageState.imagesWithoutAlt })}.`,
      );
    }
    if (pageState.internalAnchorsWithoutTarget.length) {
      throw new Error(
        `${viewport.name}: âncoras sem destino: ${pageState.internalAnchorsWithoutTarget.join(", ")}.`,
      );
    }
    if (forbiddenMatches.length) {
      throw new Error(
        `${viewport.name}: conteúdo interno encontrado: ${forbiddenMatches.join(", ")}.`,
      );
    }
    if (blockingAccessibilityViolations.length) {
      const violationDetails = blockingAccessibilityViolations.map(
        ({ id, nodes }) => ({
          id,
          nodes: nodes.slice(0, 8).map(({ failureSummary, target }) => ({
            failureSummary,
            target,
          })),
        }),
      );
      throw new Error(
        `${viewport.name}: violações sérias/críticas: ${JSON.stringify(violationDetails)}.`,
      );
    }

    report.push({
      accessibility: "sem violações sérias ou críticas",
      errors,
      imageCount: await page.locator("img").count(),
      layout: {
        clientWidth: pageState.clientWidth,
        overflowing: pageState.overflowing,
        scrollWidth: pageState.scrollWidth,
      },
      sections: pageState.sectionIds,
      status: response.status(),
      viewport: viewport.name,
    });

    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(outputDirectory, "report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
