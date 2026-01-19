import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Live Chat Scroll Verification', () => {
    const proofDir = path.resolve('docs/proof_bundle/chat_scroll_fix');
    if (!fs.existsSync(proofDir)) fs.mkdirSync(proofDir, { recursive: true });

    test('Composer reachable on Deployed URL (Cache Busted)', async ({ page }) => {
        test.setTimeout(90000);
        await page.setViewportSize({ width: 1366, height: 768 });

        // 1. LIVE URL + Cache Bust
        const targetUrl = `https://apex-recruiter-p1.web.app/?v=${Date.now()}`;
        console.log(`Navigating to ${targetUrl}`);
        await page.goto(targetUrl);

        try {
            // 2. Handle Consent
            const consentBtn = page.getByRole('button', { name: 'I Understand' });
            if (await consentBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
                await consentBtn.click();
            }

            // 3. Handle Key
            const keyInput = page.getByPlaceholder('sk-...');
            // Check for Auto-Open
            const isAutoOpen = await keyInput.isVisible().catch(() => false);
            if (isAutoOpen) {
                await keyInput.fill('sk-test-key-live-verify');
                await page.getByRole('button', { name: 'Save Key' }).click();
            } else {
                const setKeyBtn = page.getByRole('button', { name: 'Set API Key' }).first();
                if (await setKeyBtn.isVisible()) {
                    await setKeyBtn.click();
                    await keyInput.fill('sk-test-key-live-verify');
                    await page.getByRole('button', { name: 'Save Key' }).click();
                }
            }

            // 4. Verify Empty State
            await expect(page.getByText('Start Analyzing a Vacancy')).toBeVisible({ timeout: 15000 });

            // 5. Verify Composer
            // Use unique selector to avoid ContextPanel conflict
            const input = page.locator('div.shrink-0 textarea').first();

            // DEBUG CHECK
            await expect(input).toBeVisible({ timeout: 5000 });

            // 6. FLOOD CHAT
            console.log('Flooding chat on LIVE env...');
            for (let i = 1; i <= 15; i++) {
                await input.fill(`Message ${i} - Live Verification ` + 'X'.repeat(30));
                await page.keyboard.press('Enter');
                await page.waitForTimeout(150);
            }

            // 7. CAPTURE PROOF
            await page.waitForTimeout(2000);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            await page.screenshot({ path: path.join(proofDir, `Live_CacheBusted_${timestamp}.png`) });

            // 8. ASSERTIONS
            const composerVisible = await input.isVisible();
            if (!composerVisible) throw new Error('Composer is NOT visible on Live URL');
            await expect(input).toBeInViewport();

        } catch (e) {
            console.log('LIVE TEST FAILED:', e);
            await page.screenshot({ path: path.join(proofDir, 'Live_Debug_Fail.png'), fullPage: true });
            throw e;
        }
    });
});
