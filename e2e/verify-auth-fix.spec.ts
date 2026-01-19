import { test, expect } from "@playwright/test";

test.describe("Auth Fix Verification", () => {
    test("Verify anonymous auth succeeds without API key error", async ({ page }) => {
        // Collect console logs to check for success/error messages
        const fs = require('fs');
        const logFile = 'browser_logs.txt';
        try { fs.writeFileSync(logFile, ''); } catch (e) { }

        page.on("console", msg => {
            const text = msg.text();
            fs.appendFileSync(logFile, `[CONSOLE] ${text}\n`);
        });

        page.on("pageerror", err => {
            fs.appendFileSync(logFile, `[PAGE_ERROR] ${err.message}\n`);
        });

        // Go to home page
        await page.goto("/");

        // Wait for network to settle
        await page.waitForLoadState("networkidle");

        // Wait a bit to ensure auth completes
        await page.waitForTimeout(3000);

        // Analyze logs
        const logContent = fs.readFileSync(logFile, 'utf8');
        const consoleMessages = logContent.split('\n');

        const hasApiKeyError = consoleMessages.some(msg => msg.includes("auth/api-key-not-valid"));
        expect(hasApiKeyError, "Should not see API key error in console").toBe(false);

        const hasSuccessLog = consoleMessages.some(msg => msg.includes("[Auth] Signed in anonymously"));
        const hasExistingUserLog = consoleMessages.some(msg => msg.includes("User already authenticated"));

        if (!hasSuccessLog && !hasExistingUserLog) {
            console.log("\n--- BROWSER LOGS START ---");
            console.log(logContent);
            console.log("--- BROWSER LOGS END ---\n");
        }

        expect(hasSuccessLog || hasExistingUserLog, "Should see auth success log").toBe(true);

        // Take a screenshot for proof
        await page.screenshot({ path: "proof_bundle/auth_success_proof.png" });
    });
});
