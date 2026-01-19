import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Awareness Reproduction', () => {
    test('AI can read and answer questions about uploaded file', async ({ page }) => {
        // 1. Navigate to home
        await page.goto('/');

        // 2. Clear any existing session (if needed) and set API key mockup if not strictly live (but we are testing against live-like behavior locally)
        // For local dev, we might need to assume the user sets a key or we have a mock.
        // Assuming the "Set API Key" dialog appears if not set.
        // We'll insert a dummy key for the UI state, but the actual response will come from the backend.

        // Check if API Mocking is needed. The instructions say "Integration run".
        // For reproduction of the *current* state (which connects to OpenAI), we might need a real key or just verify the UI message.
        // However, since we expect it to fail, we can just check the UI flow.

        // Bypass API Key dialog if present
        const apiKeyDialog = page.getByRole('dialog');
        if (await apiKeyDialog.isVisible()) {
            await page.getByPlaceholder('sk-...').fill('sk-dummy-key-for-ui-state');
            await page.getByRole('button', { name: 'Save Key' }).click();
        }

        // 3. Upload File
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(path.join(__dirname, 'fixtures/test-cv.txt'));

        // 4. Verify file appears in context (Files tab)
        // Note: The UI puts it in "Files" tab.
        await expect(page.getByText('test-cv.txt')).toBeVisible();

        // 5. Ask question
        await page.getByPlaceholder('Describe the vacancy...').fill('Where is John Doe located?');
        await page.getByRole('button', { name: 'Send' }).click(); // Send icon

        // 6. Assert Response
        // We expect the answer to contain "Colombo"
        const response = page.locator('.prose').last();
        await expect(response).toContainText('Colombo', { timeout: 15000 });

        // 7. Assert NO "I'm unable to view" message
        await expect(response).not.toContainText("unable to view or access files");
    });
});
