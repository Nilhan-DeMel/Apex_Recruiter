import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Chat Scroll Bug (Cache Clear)', () => {
    const proofDir = path.resolve('docs/proof_bundle/chat_scroll_fix');
    if (!fs.existsSync(proofDir)) fs.mkdirSync(proofDir, { recursive: true });

    test('Composer reachable after fresh session overflow', async ({ page }) => {
        test.setTimeout(90000);
        await page.setViewportSize({ width: 1366, height: 768 });

        // 1. CLEAR CACHE SIMULATION
        await page.goto('/');

        // 2. Handle Consent
        try {
            const consentBtn = page.getByRole('button', { name: 'I Understand' });
            await consentBtn.waitFor({ state: 'visible', timeout: 5000 });
            await consentBtn.click();
            await expect(consentBtn).toBeHidden({ timeout: 5000 }); // Wait for it to go
        } catch (e) {
            console.log('Consent logic skipped or failed', e);
        }

        // 3. Handle API Key
        try {
            const keyInput = page.getByPlaceholder('sk-...');
            // Check for Auto-Open
            const isAutoOpen = await keyInput.isVisible().catch(() => false);
            if (isAutoOpen) {
                console.log('Dialog auto-opened.');
                await keyInput.fill('sk-test-key-999999');
                await page.getByRole('button', { name: 'Save Key' }).click();
            } else {
                // Try Manual
                const setKeyBtn = page.getByRole('button', { name: 'Set API Key' }).first();
                if (await setKeyBtn.isVisible()) {
                    console.log('Clicking Set API Key manually.');
                    await setKeyBtn.click();
                    await keyInput.waitFor({ state: 'visible' });
                    await keyInput.fill('sk-test-key-999999');
                    await page.getByRole('button', { name: 'Save Key' }).click();
                }
            }
            // Wait for Dialog to close
            await expect(keyInput).toBeHidden({ timeout: 5000 });
        } catch (e) {
            console.log('API Key logic failed', e);
            await page.screenshot({ path: path.join(proofDir, 'Debug_ApiKey_Fail.png') });
        }

        // 4. Verify Composer Visibility (Critical Step)
        await page.waitForTimeout(1000); // Settle
        const input = page.locator('textarea');

        try {
            await expect(input).toBeVisible({ timeout: 5000 });
        } catch (e) {
            console.log('Composer NOT visible. Taking debug screenshot.');
            await page.screenshot({ path: path.join(proofDir, 'Debug_Composer_Fail.png'), fullPage: true });
            throw e;
        }

        // 5. FLOOD CHAT
        console.log('Flooding chat...');
        for (let i = 1; i <= 15; i++) {
            await input.fill(`Message ${i} ` + 'X'.repeat(30));
            await page.keyboard.press('Enter');
        }

        // 6. ASSERTIONS
        const composerVisible = await input.isVisible();
        if (!composerVisible) {
            await page.screenshot({ path: path.join(proofDir, 'Debug_AfterFlood_Fail.png') });
            throw new Error('Composer is NOT visible after flood');
        }

        await expect(input).toBeInViewport();

        // Success capture
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await page.screenshot({ path: path.join(proofDir, `Repro_CacheClear_${timestamp}.png`) });
    });
});
