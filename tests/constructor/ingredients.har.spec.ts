import { test, expect } from '@playwright/test';

test('записать HAR с данными ингредиентов', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: true
  });

  await page.goto('/');

  await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
});
