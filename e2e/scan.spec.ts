import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('UI Surface Scan', () => {
    const proofDir = path.resolve('docs/proof_bundle');
    if (!fs.existsSync(proofDir)) fs.mkdirSync(proofDir, { recursive: true });

    test('Capture Dashboard UI states (Bypass Auth)', async ({ page }) => {
        test.setTimeout(60000);

        // Inject Key directly to bypass Dialog issues
        await page.addInitScript(() => {
            window.sessionStorage.setItem('openai_key', 'sk-test-key-123456');
            window.sessionStorage.setItem('consent_given', 'true');
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // 3. Dashboard (Empty)
        // Should be visible immediately
        await expect(page.getByText('Start Analyzing a Vacancy')).toBeVisible({ timeout: 10000 });
        await page.screenshot({ path: path.join(proofDir, 'S3_Dashboard_Empty.png') });
        console.log('S3 Captured');

        // 4. File Upload UI (Empty)
        await page.getByRole('tab', { name: 'Files' }).click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(proofDir, 'S4_Context_Files.png') });
        console.log('S4 Captured');

        // 5. Links UI
        await page.getByRole('tab', { name: 'Links' }).click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(proofDir, 'S5_Context_Links.png') });
        console.log('S5 Captured');

        // 6. Text UI
        await page.getByRole('tab', { name: 'Text' }).click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(proofDir, 'S6_Context_Text.png') });
        console.log('S6 Captured');

        // 7. Personas UI (Empty)
        await page.getByRole('tab', { name: 'Personas' }).click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(proofDir, 'S7_Context_Personas.png') });
        console.log('S7 Captured');

        // 8. Notes Panel
        await page.getByRole('button').filter({ hasText: 'Notes' }).click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(proofDir, 'S8_Notes_Panel.png') });
        console.log('S8 Captured');

        // Re-verify Welcome (S1) by Clearing
        await page.evaluate(() => {
            window.sessionStorage.clear();
            window.location.reload();
        });
        // Wait for reload (S1)
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(proofDir, 'S1_Welcome_Verified.png') });
        console.log('S1 Re-Captured');
    });
});
