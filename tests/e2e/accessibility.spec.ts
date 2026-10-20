import { test, expect } from './fixtures';

test('search supports keyboard opening, focus containment, Escape and focus return', async ({ page }) => {
  await page.goto('/atlas');
  const trigger = page.getByRole('button', { name: 'Search CosmoLens', exact: true });
  await trigger.focus(); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Search CosmoLens' });
  const input = dialog.getByRole('textbox', { name: 'Search objects and journeys' });
  await expect(input).toBeFocused();
  await input.fill('Jupiter');
  await expect(dialog.getByRole('link').first()).toBeVisible();
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press(index % 2 ? 'Shift+Tab' : 'Tab');
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await input.focus(); await page.keyboard.press('Shift+Tab');
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
  await trigger.click(); await expect(input).toBeFocused();
});

test('mobile navigation exposes every destination and closes after selection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const open = page.getByRole('button', { name: 'Open navigation' });
  await open.click();
  const nav = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(nav.getByRole('link')).toHaveCount(8);
  await nav.getByRole('link', { name: 'Observe', exact: true }).click();
  await expect(page).toHaveURL(/\/observe$/); await expect(nav).not.toBeVisible();
  await open.click(); await expect(nav.getByRole('link', { name: 'Observe', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.keyboard.press('Escape'); await expect(open).toBeFocused();
});

test('skip link reaches the main landmark', async ({ page }) => {
  await page.goto('/atlas'); await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});


test('desktop navigation replaces the mobile menu at wide widths', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/atlas');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open navigation' })).not.toBeVisible();
});
