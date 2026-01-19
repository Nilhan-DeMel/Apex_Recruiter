import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ARTIFACT_DIR = path.resolve("docs/proof_bundle/deploy_sync");

test("Reproduce UI Mismatch", async ({ browser }) => {
    // Ensure dirs exist
    ["screenshots", "meta"].forEach(d => {
        const p = path.join(ARTIFACT_DIR, d);
        if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Capture LOCAL (New UI)
    console.log("Capturing LOCAL...");
    try {
        await page.goto("http://localhost:3000", { timeout: 10000 });
        await page.waitForTimeout(2000); // Wait for hydration
        await page.screenshot({ path: path.join(ARTIFACT_DIR, "screenshots/local_new_ui.png") });

        const localHead = await page.evaluate(() => document.head.innerHTML);
        fs.writeFileSync(path.join(ARTIFACT_DIR, "meta/local_head_assets.txt"), localHead);
    } catch (e) {
        console.error("Local capture failed:", e);
    }

    // 2. Capture LIVE (Old UI)
    console.log("Capturing LIVE...");
    try {
        await page.goto("https://apex-recruiter-p1.web.app/", { timeout: 15000 });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(ARTIFACT_DIR, "screenshots/live_old_ui.png") });

        const liveHead = await page.evaluate(() => document.head.innerHTML);
        fs.writeFileSync(path.join(ARTIFACT_DIR, "meta/live_head_assets.txt"), liveHead);
    } catch (e) {
        console.error("Live capture failed:", e);
    }
});
