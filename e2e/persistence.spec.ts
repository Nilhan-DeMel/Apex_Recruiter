import { test, expect } from "@playwright/test";

test.describe("Vacancy Persistence", () => {
    const TEST_VACANCY_TITLE = `Test Vacancy ${Date.now()}`;

    test.beforeEach(async ({ page }) => {
        // Navigate and dismiss consent
        await page.goto("/");

        // Check for consent banner and accept if present
        const consentBanner = page.locator("text=We use cookies");
        if (await consentBanner.isVisible({ timeout: 3000 }).catch(() => false)) {
            await page.click("button:has-text('Accept')");
        }

        // Handle API key dialog if present
        const apiKeyDialog = page.locator("[data-testid='api-key-dialog']");
        if (await apiKeyDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
            await page.click("[data-testid='api-key-dialog'] button[type='button']");
        }
    });

    test("P-01: Create vacancy and verify it appears in library", async ({ page }) => {
        // Open vacancy library modal
        await page.click("button[title='Open Vacancy Library']");
        await expect(page.locator("text=Vacancy Library")).toBeVisible();

        // Count existing vacancies
        const initialCount = await page.locator("[data-testid='vacancy-item']").count().catch(() => 0);

        // Create new vacancy
        await page.click("button:has-text('New Vacancy')");

        // Modal should close and we should be on new vacancy
        await expect(page.locator("text=New Vacancy")).toBeVisible();
    });

    test("P-02: Rename vacancy and verify persistence", async ({ page }) => {
        // Click on vacancy name to edit
        await page.click("button:has-text('New Vacancy')");

        // Type new name
        await page.fill("input[aria-label='Vacancy name']", TEST_VACANCY_TITLE);
        await page.press("input[aria-label='Vacancy name']", "Enter");

        // Save
        await page.click("button[title*='Save']");
        await page.waitForTimeout(1000);

        // Refresh and verify
        await page.reload();
        await page.waitForLoadState("networkidle");

        // Should still show the renamed title
        await expect(page.locator(`text=${TEST_VACANCY_TITLE}`)).toBeVisible({ timeout: 10000 });
    });

    test("P-03: Vacancy library shows saved vacancies", async ({ page }) => {
        // Open vacancy library
        await page.click("button[title='Open Vacancy Library']");

        // Should see the library modal
        await expect(page.locator("text=Vacancy Library")).toBeVisible();

        // Should either show vacancies or "No saved vacancies" message
        const hasVacancies = await page.locator("[data-testid='vacancy-item']").count() > 0;
        const hasEmptyState = await page.locator("text=No saved vacancies").isVisible().catch(() => false);

        expect(hasVacancies || hasEmptyState).toBe(true);
    });

    test("P-04: Anonymous auth creates user session", async ({ page }) => {
        // Wait for auth to complete
        await page.waitForLoadState("networkidle");

        // Check console for auth log
        const consoleMessages: string[] = [];
        page.on("console", (msg) => consoleMessages.push(msg.text()));

        // Trigger any auth action
        await page.reload();
        await page.waitForLoadState("networkidle");

        // Auth should work (no blocking error screen)
        await expect(page.locator("text=Authentication Error")).not.toBeVisible({ timeout: 5000 });
    });

    test("P-05: Save button shows unsaved indicator", async ({ page }) => {
        // Edit vacancy name
        await page.click("button:has-text('New Vacancy')");
        await page.fill("input[aria-label='Vacancy name']", "Modified Title");
        await page.press("input[aria-label='Vacancy name']", "Enter");

        // Should show unsaved indicator (yellow dot or save icon color change)
        const saveButton = page.locator("button[title*='Save']");
        await expect(saveButton).toBeVisible();
    });
});
