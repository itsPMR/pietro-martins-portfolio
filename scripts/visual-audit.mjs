import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:3000";
const outputDirectory = path.resolve("artifacts/browser-audit");

const viewports = [
  { height: 1_100, name: "desktop", width: 1_440 },
  { height: 768, name: "tablet", width: 1_024 },
  { height: 844, name: "mobile", width: 390 },
  { height: 720, name: "mobile-small", width: 320 },
];

const visualStops = [
  { name: "about", selector: "#about-title" },
  { name: "projects", selector: "#projects-title" },
  { name: "skills", selector: "#skills-title" },
  { name: "education", selector: "#education-title" },
  { name: "contact", selector: "#contato" },
];

const projectCases = ["classflow", "pmr-truco", "pmr-assist"];

await mkdir(outputDirectory, { recursive: true });

const isReachable = async () => {
  try {
    const response = await fetch(baseUrl);
    return response.ok;
  } catch {
    return false;
  }
};

let ownedServer;

if (!(await isReachable())) {
  const url = new URL(baseUrl);
  const isLocalHost = ["127.0.0.1", "localhost"].includes(url.hostname);
  if (!isLocalHost) {
    throw new Error(`O endereço de auditoria não respondeu: ${baseUrl}`);
  }

  const npmCli = process.env.npm_execpath;
  const build = npmCli
    ? spawnSync(process.execPath, [npmCli, "run", "build"], {
        stdio: "inherit",
        windowsHide: true,
      })
    : spawnSync("npm", ["run", "build"], {
        shell: process.platform === "win32",
        stdio: "inherit",
        windowsHide: true,
      });
  if (build.status !== 0) throw new Error("O build falhou antes da auditoria.");

  ownedServer = spawn(
    process.execPath,
    [
      path.resolve("node_modules/next/dist/bin/next"),
      "start",
      "--hostname",
      url.hostname,
      "--port",
      url.port || "3000",
    ],
    { stdio: "ignore", windowsHide: true },
  );

  const startedAt = Date.now();
  while (!(await isReachable())) {
    if (ownedServer.exitCode !== null || Date.now() - startedAt > 30_000) {
      ownedServer.kill();
      throw new Error("O servidor local não iniciou para a auditoria.");
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

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
    const modals = [];

    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const layout = await page.evaluate(() => {
      const overflowing = [...document.querySelectorAll("body *")]
        .filter((element) => {
          const rectangle = element.getBoundingClientRect();
          return rectangle.left < -1 || rectangle.right > window.innerWidth + 1;
        })
        .slice(0, 12)
        .map((element) => ({
          className: String(element.className),
          tag: element.tagName.toLowerCase(),
        }));

      return {
        clientWidth: document.documentElement.clientWidth,
        overflowing,
        scrollWidth: document.documentElement.scrollWidth,
        sections: [...document.querySelectorAll("main > section")].map(
          (section) => ({
            height: Math.round(section.getBoundingClientRect().height),
            id: section.id || String(section.className),
          }),
        ),
      };
    });

    await page.evaluate(async () => {
      const viewportHeight = window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      for (let y = 0; y < pageHeight; y += viewportHeight * 0.75) {
        window.scrollTo(0, y);
        await new Promise((resolve) => window.setTimeout(resolve, 45));
      }

      await Promise.all(
        [...document.images]
          .filter((image) => image.complete)
          .map((image) => image.decode().catch(() => undefined)),
      );
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(120);

    await page.screenshot({
      fullPage: true,
      path: path.join(outputDirectory, `portfolio-${viewport.name}-full.png`),
    });
    await page.screenshot({
      path: path.join(outputDirectory, `portfolio-${viewport.name}-hero.png`),
    });

    for (const stop of visualStops) {
      await page.locator(stop.selector).evaluate((element) => {
        const top = element.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo(0, Math.max(0, top));
      });
      await page.waitForTimeout(80);
      await page.screenshot({
        path: path.join(
          outputDirectory,
          `portfolio-${viewport.name}-${stop.name}.png`,
        ),
      });
    }

    for (const project of projectCases) {
      await page.locator(`[data-project="${project}"]`).click();
      const dialog = page.locator("#project-dialog");
      await dialog.waitFor({ state: "visible" });
      await page.waitForTimeout(520);

      const modalLayout = await page.evaluate(() => {
        const projectDialog = document.querySelector("#project-dialog");
        const scrollArea = document.querySelector(".project-dialog-scroll");

        return {
          bodyLocked: document.body.dataset.projectOpen === "true",
          dialogOverflow:
            (projectDialog?.scrollWidth ?? 0) -
            (projectDialog?.clientWidth ?? 0),
          scrollAreaOverflow:
            (scrollArea?.scrollWidth ?? 0) - (scrollArea?.clientWidth ?? 0),
        };
      });

      await page.screenshot({
        path: path.join(
          outputDirectory,
          `portfolio-${viewport.name}-${project}-open.png`,
        ),
      });
      modals.push({ layout: modalLayout, project });

      await dialog.getByRole("button", { name: /Fechar projeto/ }).click();
      await dialog.waitFor({ state: "detached" });
    }

    if (
      viewport.name === "desktop" &&
      process.env.UPDATE_PORTFOLIO_PREVIEW === "true"
    ) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: "public/images/portfolio-preview.png" });
    }

    report.push({ errors, layout, modals, viewport: viewport.name });
    await context.close();
  }
} finally {
  await browser.close();
  ownedServer?.kill();
}

const serializedReport = `${JSON.stringify(report, null, 2)}\n`;
await writeFile(path.join(outputDirectory, "report.json"), serializedReport);
console.log(serializedReport);
