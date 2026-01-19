import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Rigor Max: Critical Workflows', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Clear storage to ensure fresh state
        await page.evaluate(() => {
            sessionStorage.clear();
            localStorage.clear();
        });
        await page.reload();

        // Handle Consent if present
        // Handle Consent if present (wait for hydration)
        try {
            const consentBtn = page.getByRole('button', { name: 'I Understand' });
            // Wait briefly for it to appear
            await consentBtn.waitFor({ state: 'visible', timeout: 3000 });
            await consentBtn.click();
            await expect(consentBtn).toBeHidden();
        } catch (e) {
            // Consent banner didn't appear, proceed
        }
    });

    test('W-01: Secure Setup (Auth & Key Flow)', async ({ page }) => {
        // Wait for hydration/dialog race
        await page.waitForTimeout(2000);

        // Handle Auto-Open Dialog (Edge/Production can be fast)
        const autoDialog = page.getByRole('dialog');
        if (await autoDialog.isVisible()) {
            if (await autoDialog.isVisible()) {
                await page.keyboard.press('Escape');
                await expect(autoDialog).toBeHidden();
            }
        }

        // [I-01] Header Key Button (Initially "Set API Key")
        const headerKeyBtn = page.locator('header').getByRole('button', { name: 'Set API Key' });
        await expect(headerKeyBtn).toBeVisible();

        // [I-14] API Key Dialog Input & Eye
        await headerKeyBtn.click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();

        const keyInput = dialog.getByPlaceholder('sk-...');
        await expect(keyInput).toBeVisible();

        // Test Eye Icon [I-14] visibility toggle
        await keyInput.fill('sk-fake-key');
        const eyeBtn = dialog.getByRole('button', { name: 'Show API Key' });
        if (await eyeBtn.isVisible()) {
            await eyeBtn.click();
            await expect(keyInput).toHaveAttribute('type', 'text');
        }

        // Submit
        await dialog.getByRole('button', { name: 'Save Key' }).click();
    });

    test('W-02: Data Ingestion (Context Tabs)', async ({ page }) => {
        // Pre-condition: User must be auth'd to see tabs
        await page.waitForTimeout(1000);
        await page.evaluate(() => {
            sessionStorage.setItem('openai_key', 'sk-mock-key-injected');
            sessionStorage.setItem('consent_given', 'true');
        });
        await page.reload();
        await page.waitForTimeout(2000); // Wait for hydration

        // Handle Auto-Open Dialog if injection failed (Failsafe)
        const autoDialog = page.getByRole('dialog');
        if (await autoDialog.isVisible()) {
            await page.keyboard.press('Escape');
        }

        // [I-08, I-09, I-10, I-11] Tab Triggers
        const tabs = ['Files', 'Links', 'Text', 'Personas'];
        for (const t of tabs) {
            await page.getByRole('tab', { name: t }).click();
            await expect(page.getByRole('tab', { name: t })).toHaveAttribute('data-state', 'active');
        }

        // [I-10] Text Paste Flow
        await page.getByRole('tab', { name: 'Text' }).click();

        // Handle Empty State (Click Paste Text button first)
        const pasteBtn = page.getByRole('button', { name: 'Paste Text' });
        // Wait for animation
        await page.waitForTimeout(500);
        if (await pasteBtn.isVisible()) {
            await pasteBtn.click();
        }

        // Updated placeholder to match actual UI and avoid ambiguity
        const textarea = page.getByPlaceholder('Paste the job description text here...');
        await textarea.fill('We are looking for a Senior React Engineer.');
    });

    test('W-03: Chat & Icon Interaction', async ({ page }) => {
        // Pre-condition: Auth'd
        await page.waitForTimeout(1000);
        await page.evaluate(() => {
            sessionStorage.setItem('openai_key', 'sk-mock-key-injected');
            sessionStorage.setItem('consent_given', 'true');
        });
        await page.reload();
        await page.waitForTimeout(2000); // Wait for hydration

        // Handle Auto-Open Dialog if injection failed (Failsafe)
        const autoDialog = page.getByRole('dialog');
        if (await autoDialog.isVisible()) {
            await page.keyboard.press('Escape');
        }

        // [I-05] Paperclip
        // Correct way to find parent button: filter or xpath
        const paperclipBtn = page.locator('button').filter({ has: page.locator('.lucide-paperclip') }).first();
        await expect(paperclipBtn).toBeVisible();

        // [I-06] Sparkles (Generate)
        const sparklesBtn = page.locator('button').filter({ has: page.locator('.lucide-sparkles') }).first();
        await expect(sparklesBtn).toBeVisible();

        // [I-07] Send Button
        const sendBtn = page.locator('button').filter({ has: page.locator('.lucide-send') }).first();
        await expect(sendBtn).toBeVisible(); // Might be disabled if empty input

        // Type to enable send
        const textarea = page.locator('textarea').first();
        await textarea.fill('Hello');
        // Force input event just in case
        await textarea.dispatchEvent('input');
        await expect(sendBtn).toBeEnabled();
    });

    test('I-12, I-13: Notes Panel', async ({ page }) => {
        // [I-12] Toggle Notes (StickyNote)
        // [I-13] Chevron
        const notesHeader = page.getByText('Quick Notes');
        if (await notesHeader.isVisible()) {
            // Try collapsing/expanding
            const chevron = page.locator('button').filter({ has: page.locator('.lucide-chevron-up') }).first();
            if (await chevron.isVisible()) {
                await chevron.click();
            }
        }
    });

});
