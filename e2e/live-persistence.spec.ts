import { test, expect } from "@playwright/test";

test.describe("Live Persistence Smoke Test", () => {
    test.beforeEach(async ({ page }) => {
        // Clear storage to force fresh auth
        await page.context().clearCookies();
        // await page.evaluate(() => localStorage.clear()); // Domain dependent
    });

    test("Create, save, refresh, and verify vacancy persists", async ({ page }) => {
        const timestamp = Date.now();
        const vacancyTitle = `Live Test ${timestamp}`;

        console.log(`Starting persistence test for: ${vacancyTitle}`);

        // 1. Go to app
        await page.goto("/");

        // 2. Auth Wait (Critical)
        // If auth fails here, test fails
        await page.waitForLoadState("networkidle");

        // Check for auth error banner
        const errorBanner = page.locator('text=Sign in failed');
        if (await errorBanner.isVisible()) {
            console.error("Auth failed - cannot proceed with persistence test");
            throw new Error("Auth block prevented persistence test");
        }

        // Wait for auth provider to settle
        await page.waitForTimeout(3000);

        // 3. Open Vacancy Library
        // If "vacancy-library-trigger" is not found, header might not be loaded
        await page.click('[data-testid="vacancy-library-trigger"]');
        await page.waitForSelector('[data-testid="vacancy-library-modal"]');

        // 4. Create new vacancy
        await page.click('[data-testid="new-vacancy-button"]');
        // Wait for new vacancy to load (modal closes or title updates)
        await page.waitForTimeout(2000);

        // 5. Rename vacancy
        // Click header title to edit
        await page.click('[data-testid="edit-vacancy-title"]');
        await page.fill('[data-testid="vacancy-title-input"]', vacancyTitle);
        await page.click('[data-testid="confirm-rename"]');
        await page.waitForTimeout(500); // Wait for optimistic update

        // 6. Save explicitly
        await page.click('[data-testid="save-vacancy"]');
        // Wait for Firestore write (snackbar or just time)
        await page.waitForTimeout(2000);

        console.log("Vacancy saved. Refreshing...");

        // 7. Refresh page
        await page.reload();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(3000); // Re-auth

        // 8. Verify persistence
        await page.click('[data-testid="vacancy-library-trigger"]');
        await page.waitForSelector('[data-testid="vacancy-library-modal"]');

        // Check if title exists in list
        const vacancyItem = page.locator(`[data-testid="vacancy-item"]`, { hasText: vacancyTitle });
        await expect(vacancyItem).toBeVisible();

        console.log("Persistence verified! Cleaning up...");

        // 9. Clean up: delete vacancy
        // Assuming delete button is inside the vacancy item row
        await vacancyItem.locator('[data-testid="delete-vacancy"]').click();
        await page.click('[data-testid="confirm-delete"]');
        await page.waitForTimeout(1000);

        await expect(vacancyItem).not.toBeVisible();
    });
});
