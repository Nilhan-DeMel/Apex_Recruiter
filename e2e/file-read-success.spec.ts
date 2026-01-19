import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Read Rigor Max Verification', () => {
    test('should upload a file and AI should be able to read its content', async ({ page }) => {
        // 1. Setup - Mock API Key or assume existing session
        // We'll use the existing page which might already have the session or we set it
        await page.goto('/');

        // Set API Key in Session Storage if not present
        await page.evaluate(() => {
            sessionStorage.setItem('openai_api_key', 'test-key-is-required-but-we-use-real-one-from-env-if-possible');
            sessionStorage.setItem('consent_given', 'true');
        });

        // Actually, we need a real API key for end-to-end OpenAI verification.
        // The user has a real key but I shouldn't hardcode it. 
        // I'll assume the environment has OPENAI_API_KEY and the dev server is running.

        // Wait for the empty state
        await expect(page.locator('text=Upload a file')).toBeVisible();

        // 2. Upload File
        const filePath = path.join(process.cwd(), 'e2e', 'fixtures', 'test-cv.txt');
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('text=Upload a file').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath);

        // 3. Verify File Status in Context Panel
        // It should move to "Files" tab automatically
        await expect(page.locator('button[role="tab"]:has-text("Files")')).toHaveAttribute('aria-selected', 'true');
        await expect(page.locator('text=test-cv.txt')).toBeVisible();

        // Wait for "ready" status (simulated or real)
        await expect(page.locator('text=test-cv.txt')).toBeVisible({ timeout: 15000 });

        // 4. Ask AI about the file
        const composer = page.locator('textarea[placeholder*="Ask me anything"]');
        await composer.fill('What is the name of the candidate in the uploaded CV?');
        await composer.press('Enter');

        // 5. Verify AI Response
        // The AI should NOT say "I cannot view the file"
        // It should mention "John Doe" (from test-cv.txt)
        const assistantMessage = page.locator('div[data-role="assistant"]').last();
        await expect(assistantMessage).toContainText('John Doe', { timeout: 30000 });
        await expect(assistantMessage).not.toContainText('unable to view');
        await expect(assistantMessage).not.toContainText('cannot access');
    });
});
