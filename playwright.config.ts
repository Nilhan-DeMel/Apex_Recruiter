import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    /* Maximum time one test can run for. */
    timeout: 60 * 1000,
    expect: {
        timeout: 15 * 1000,
    },
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3001',
        trace: 'on', // Always capture traces for evidence
        screenshot: 'on',
        video: 'retain-on-failure',
        actionTimeout: 30 * 1000,
        navigationTimeout: 60 * 1000,
    },
    projects: [
        {
            name: 'setup',
            testMatch: /global\.setup\.ts/,
        },
        {
            name: 'b-chrome-desktop',
            use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1920, height: 1080 } },
        },
        {
            name: 'b-edge-desktop',
            use: { ...devices['Desktop Edge'], channel: 'msedge', viewport: { width: 1920, height: 1080 } },
        },
        {
            name: 'v-laptop',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } },
        },
        {
            name: 'v-mobile',
            use: { ...devices['iPhone 14'] },
        },
    ],
});
