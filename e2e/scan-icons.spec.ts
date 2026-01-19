import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Harvest UI Icons', async ({ page }) => {
    // 1. Visit App & Bypass Auth (Mock Mode for pure UI scan)
    await page.goto('/');

    // Attempt to clear consent/key if manifest
    const consentBtn = page.getByRole('button', { name: 'I Understand' });
    if (await consentBtn.isVisible()) await consentBtn.click();

    // 2. Scan Strategy
    // Look for all SVG elements and their parents
    const iconSnapshot = await page.evaluate(() => {
        const icons = [];
        document.querySelectorAll('svg, .lucide').forEach((el, idx) => {
            const parentBtn = el.closest('button');
            const parentLink = el.closest('a');
            const interactive = parentBtn || parentLink;

            icons.push({
                id: `UI-ICON-${idx}`,
                tagName: el.tagName,
                classList: Array.from(el.classList).join(' '),
                parentTag: interactive ? interactive.tagName : el.parentElement?.tagName,
                parentId: interactive ? interactive.id : el.parentElement?.id,
                parentText: interactive ? interactive.innerText : '',
                ariaLabel: interactive ? interactive.getAttribute('aria-label') : el.getAttribute('aria-label'),
                isVisible: (el.getBoundingClientRect().width > 0)
            });
        });
        return icons;
    });

    // 3. Dump Registry
    console.log('HARVESTED ICONS:', JSON.stringify(iconSnapshot, null, 2));

    const dumpPath = path.resolve('docs/icon_registry.ui_harvest.json');
    fs.writeFileSync(dumpPath, JSON.stringify(iconSnapshot, null, 2));

    // 4. Screenshots
    await page.screenshot({ path: 'docs/proof_bundle/screenshots/harvest_desktop.png', fullPage: true });

});
