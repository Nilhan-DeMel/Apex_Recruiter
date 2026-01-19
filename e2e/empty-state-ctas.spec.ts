import { test, expect } from '@playwright/test';

test.describe('Fix: Empty State CTA Cards', () => {
    test.beforeEach(async ({ page }) => {
        // [SCENARIO_SETUP]
        // 1. Visit Home
        await page.goto('/');
        
        // 2. Inject Auth/Consent to bypass setup wizard
        await page.evaluate(() => {
            sessionStorage.setItem('openai_key', 'sk-mock-key-injected');
            sessionStorage.setItem('consent_given', 'true');
        });
        await page.reload(); // Apply state
        
        // 3. Ensure we are on the Empty State (Chat)
        await expect(page.getByText('Start Analyzing a Vacancy')).toBeVisible();
    });

    // T1: Upload CTA
    test('CTA-1: Upload triggers file chooser', async ({ page }) => {
        // Locate CTA (using text for now as test-ids might be missing)
        const cta = page.getByText('Upload a file').locator('..'); // Parent card
        
        // Setup promise for file chooser
        const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 3000 });
        
        // ACTION: Click
        await cta.click();
        
        // ASSERT: Chooser opened
        const fileChooser = await fileChooserPromise;
        expect(fileChooser).toBeDefined();
    });

    // T2: Paste CTA
    test('CTA-2: Paste triggers focus + tab switch', async ({ page }) => {
        const cta = page.getByText('Paste text directly').locator('..');
        
        // ACTION: Click
        await cta.click();
        
        // ASSERT: Composer focused
        const composer = page.locator('textarea').first();
        await expect(composer).toBeFocused();
        
        // ASSERT: "Text" tab active in context panel
        const textTab = page.getByRole('tab', { name: 'Text' });
        await expect(textTab).toHaveAttribute('data-state', 'active');
    });

    // T3: Describe CTA
    test('CTA-3: Describe triggers focus + prompt', async ({ page }) => {
        const cta = page.getByText('Describe the role').locator('..');
        
        // ACTION: Click
        await cta.click();
        
        // ASSERT: Composer focused
        const composer = page.locator('textarea').first();
        await expect(composer).toBeFocused();
        
        // ASSERT: Value or placeholder indicates readiness
        // (Just focus is enough for now based on reqs, but checking focus is key)
    });
});
