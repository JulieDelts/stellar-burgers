import { test, expect } from '@playwright/test';

test.describe('Добавление ингредиентов в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /соберите бургер/i })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Булки', exact: true })
    ).toBeVisible();
  });

  test('добавление булки в конструктор', async ({ page }) => {
    const bunsHeading = page.getByRole('heading', {
      name: 'Булки',
      exact: true
    });

    const bunsList = bunsHeading.locator('~ ul');

    await bunsHeading.scrollIntoViewIfNeeded();

    await bunsList.getByRole('button', { name: 'Добавить' }).first().click();

    await expect(page.getByText('(верх)', { exact: false })).toBeVisible();

    await expect(page.getByText('(низ)', { exact: false })).toBeVisible();
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    const mainsHeading = page.getByRole('heading', {
      name: 'Начинки',
      exact: true
    });

    const mainsList = mainsHeading.locator('~ ul');

    await mainsHeading.scrollIntoViewIfNeeded();

    await mainsList.getByRole('button', { name: 'Добавить' }).first().click();

    await expect(
      page.getByText('Выберите начинку', { exact: true })
    ).not.toBeVisible();
  });

  test('добавление соуса в конструктор', async ({ page }) => {
    const saucesHeading = page.getByRole('heading', {
      name: 'Соусы',
      exact: true
    });

    const saucesList = saucesHeading.locator('~ ul');

    await saucesHeading.scrollIntoViewIfNeeded();

    await saucesList.getByRole('button', { name: 'Добавить' }).first().click();

    await expect(
      page.getByText('Выберите начинку', { exact: true })
    ).not.toBeVisible();
  });

  test('добавление нескольких ингредиентов разных типов', async ({ page }) => {
    const bunsHeading = page.getByRole('heading', {
      name: 'Булки',
      exact: true
    });

    const bunsList = bunsHeading.locator('~ ul');

    await bunsHeading.scrollIntoViewIfNeeded();

    await bunsList.getByRole('button', { name: 'Добавить' }).first().click();

    await expect(page.getByText('(верх)', { exact: false })).toBeVisible();

    await expect(page.getByText('(низ)', { exact: false })).toBeVisible();
    const mainsHeading = page.getByRole('heading', {
      name: 'Начинки',
      exact: true
    });

    const mainsList = mainsHeading.locator('~ ul');

    await mainsHeading.scrollIntoViewIfNeeded();

    await mainsList.getByRole('button', { name: 'Добавить' }).first().click();

    await expect(
      page.getByText('Выберите начинку', { exact: true })
    ).not.toBeVisible();

    const saucesHeading = page.getByRole('heading', {
      name: 'Соусы',
      exact: true
    });

    const saucesList = saucesHeading.locator('~ ul');

    await saucesHeading.scrollIntoViewIfNeeded();

    await saucesList.getByRole('button', { name: 'Добавить' }).first().click();

    await expect(page.getByText('(верх)', { exact: false })).toBeVisible();

    await expect(page.getByText('(низ)', { exact: false })).toBeVisible();

    await expect(
      page.getByText('Выберите начинку', { exact: true })
    ).not.toBeVisible();
  });
});
