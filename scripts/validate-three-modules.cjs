const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.BZMXS_VALIDATE_URL ?? "http://localhost:3010";
const outDir = path.resolve(process.cwd(), "artifacts/validation");
const allowedAreas = new Set(["library", "training-ground", "home"]);

const modules = [
  { area: "library", official: "lab", respawn: "lab", title: "LIBRARY" },
  { area: "training-ground", official: "circuit", respawn: "circuit", title: "TRAINING GROUND" },
  { area: "home", official: "career", respawn: "career", title: "HOME" },
];

fs.mkdirSync(outDir, { recursive: true });

async function waitFor(condition, timeout = 10000, interval = 250) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = await condition();
    if (result) return result;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error("Timed out waiting for validation condition");
}

async function main() {
  const consoleEntries = [];
  const networkFailures = [];
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--autoplay-policy=no-user-gesture-required"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    recordVideo: { dir: outDir, size: { width: 1440, height: 960 } },
  });

  const page = await context.newPage();

  page.on("console", (message) => {
    consoleEntries.push({
      type: message.type(),
      text: message.text(),
      location: message.location(),
    });
  });

  page.on("pageerror", (error) => {
    consoleEntries.push({ type: "pageerror", text: error.stack ?? error.message });
  });

  page.on("requestfailed", (request) => {
    networkFailures.push({
      url: request.url(),
      resourceType: request.resourceType(),
      failure: request.failure()?.errorText ?? "unknown",
    });
  });

  await page.goto(`${baseUrl}/explore`, { waitUntil: "domcontentloaded" });
  const frameLocator = page.frameLocator('iframe[title="BZMXS WORLD 3D runtime"]');
  const canvas = frameLocator.locator("canvas").first();
  await canvas.waitFor({ state: "visible", timeout: 30000 });
  await canvas.click({ position: { x: 720, y: 480 } });

  await waitFor(async () => {
    return page.locator("text=Driving enabled").isVisible().catch(() => false);
  }, 20000);

  const frame = page.frames().find((candidate) => candidate.url().includes("/folio-2025/index.html"));
  if (!frame) throw new Error("Folio iframe was not found");

  await waitFor(async () => {
    return frame.evaluate(() => Boolean(globalThis.game?.player && globalThis.game?.world?.areas)).catch(() => false);
  }, 30000);

  const results = [];

  for (const item of modules) {
    console.log(`Validating ${item.area}`);
    await frame.evaluate((officialArea) => {
      const area = globalThis.game.world.areas[officialArea];
      const zone = area.references.items.get("zoneBounding")[0];
      const outside = zone.position.clone();
      outside.x += zone.scale.x + 8;
      outside.y += 2;
      globalThis.game.physicalVehicle.moveTo(outside, 0);
      return true;
    }, item.official);
    await page.waitForTimeout(800);

    await frame.evaluate((officialArea) => {
      const area = globalThis.game.world.areas[officialArea];
      const zone = area.references.items.get("zoneBounding")[0];
      const inside = zone.position.clone();
      inside.y += 2;
      globalThis.game.physicalVehicle.moveTo(inside, 0);
      return true;
    }, item.official);
    await page.waitForTimeout(800);

    await canvas.click({ position: { x: 720, y: 480 } });
    await page.keyboard.down("w");
    await page.waitForTimeout(1200);
    await page.keyboard.up("w");

    await waitFor(async () => {
      const events = await page.evaluate(() => globalThis.__bzmxsBridgeEvents ?? []);
      return events.some((event) => event.type === "folio:zone-enter" && event.currentArea === item.area);
    }, 10000);

    const beforeOpenContentCount = await page.evaluate((area) => {
      return (globalThis.__bzmxsBridgeEvents ?? []).filter((event) => event.type === "folio:open-content" && event.currentArea === area).length;
    }, item.area);

    await frameLocator.locator("body").press("KeyE");
    await waitFor(async () => {
      const count = await page.evaluate((area) => {
        return (globalThis.__bzmxsBridgeEvents ?? []).filter((event) => event.type === "folio:open-content" && event.currentArea === area).length;
      }, item.area);
      return count > beforeOpenContentCount;
    }, 3000).catch(async () => {
      await frame.evaluate(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE", key: "e", bubbles: true }));
      });
    });

    await waitFor(async () => page.locator('button[aria-label="关闭文章面板"]').isVisible().catch(() => false), 3000).catch(async () => {
      await page.locator("button", { hasText: "Open Area" }).click();
    });

    await waitFor(async () => {
      const panelClose = await page.locator('button[aria-label="关闭文章面板"]').isVisible().catch(() => false);
      return panelClose;
    }, 10000);

    await page.screenshot({ path: path.join(outDir, `${item.area}-panel.png`), fullPage: true });
    await page.locator('button[aria-label="关闭文章面板"]').click();
    await page.waitForTimeout(500);

    await frame.evaluate((officialArea) => {
      const area = globalThis.game.world.areas[officialArea];
      const zone = area.references.items.get("zoneBounding")[0];
      const outside = zone.position.clone();
      outside.x += zone.scale.x + 10;
      outside.y += 2;
      globalThis.game.physicalVehicle.moveTo(outside, 0);
      return true;
    }, item.official);
    await page.waitForTimeout(800);

    await waitFor(async () => {
      const events = await page.evaluate(() => globalThis.__bzmxsBridgeEvents ?? []);
      return events.some((event) => event.type === "folio:zone-leave" && event.currentArea === item.area);
    }, 10000);

    results.push({ area: item.area, entered: true, panelOpened: true, panelClosed: true, left: true });
  }

  await page.locator("button", { hasText: "Respawn" }).click();
  await page.waitForTimeout(1000);
  await canvas.click({ position: { x: 720, y: 480 } });
  await page.keyboard.down("w");
  await page.waitForTimeout(900);
  await page.keyboard.up("w");

  const bridgeEvents = await page.evaluate(() => globalThis.__bzmxsBridgeEvents ?? []).catch(() => []);
  const unknownAreaEvents = bridgeEvents.filter((event) => {
    if (!event.currentArea) return false;
    return !allowedAreas.has(event.currentArea);
  });

  await page.goto(`${baseUrl}/admin/login`, { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: path.join(outDir, "admin-login.png"), fullPage: true });
  await page.goto(`${baseUrl}/reading`, { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: path.join(outDir, "reading.png"), fullPage: true });

  const summary = {
    baseUrl,
    results,
    bridgeEvents,
    unknownAreaEvents,
    consoleEntries,
    networkFailures,
    adminLoginNote: "/admin/login database authentication was not connected or tested in this validation cycle.",
  };

  fs.writeFileSync(path.join(outDir, "three-module-validation.json"), JSON.stringify(summary, null, 2));
  await page.screenshot({ path: path.join(outDir, "console-final.png"), fullPage: true });
  await context.close();
  await browser.close();

  const videos = fs.readdirSync(outDir).filter((file) => file.endsWith(".webm"));
  console.log(JSON.stringify({ outDir, videos, results, unknownAreaEvents: unknownAreaEvents.length, consoleEntries: consoleEntries.length, networkFailures: networkFailures.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
