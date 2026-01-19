import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ARTIFACT_DIR = path.resolve("docs/proof_bundle/deploy_sync");
const LIVE_URL = "https://apex-recruiter-p1.web.app/";

test("Verify Live Sync Success", async ({ browser }) => {
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    // Add a cache-busting header if needed, but incognito context should be fine
    const page = await context.newPage();

    console.log(`Navigating to ${LIVE_URL}...`);
    await page.goto(LIVE_URL, { waitUntil: "networkidle", timeout: 30000 });

    // Wait for hydration and dynamic content
    await page.waitForTimeout(3000);

    // 1. Capture SUCCESS screenshot
    const successShotPath = path.join(ARTIFACT_DIR, "screenshots/live_new_ui_verified.png");
    await page.screenshot({ path: successShotPath, fullPage: true });
    console.log(`Success screenshot saved to ${successShotPath}`);

    // 2. Capture Head Asset Fingerprint
    const liveHead = await page.evaluate(() => document.head.innerHTML);
    fs.writeFileSync(path.join(ARTIFACT_DIR, "meta/live_head_assets_verified.txt"), liveHead);

    // 3. Assertions for NEW UI elements
    // We expect the "Apex" logo to be present
    await expect(page.locator("text=Apex")).toBeVisible();

    // Check for the pencil icon button (edit name)
    const pencilBtn = page.locator('button:has(svg.lucide-pencil)');
    await expect(pencilBtn).toBeVisible({ timeout: 10000 });

    // Check for the save icon button
    const saveBtn = page.locator('button:has(svg.lucide-save)');
    await expect(saveBtn).toBeVisible();

    // Check for the vacancy library (folder icon)
    const folderBtn = page.locator('button:has(svg.lucide-folder)');
    await expect(folderBtn).toBeVisible();

    console.log("Live Sync VERIFIED: New UI elements detected.");
});
