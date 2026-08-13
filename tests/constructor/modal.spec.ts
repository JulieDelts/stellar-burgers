import { test, expect } from '@playwright/test';

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/**',
      update: false
    });

    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        name: 'Булки',
        exact: true
      })
    ).toBeVisible();
  });

  test('открытие модального окна ингредиента', async ({ page }) => {
    const firstIngredient = page.locator('a[href^="/ingredients/"]').first();

    await expect(firstIngredient).toBeVisible();

    await firstIngredient.click();

    await expect(page).toHaveURL(/\/ingredients\/[^/]+$/);

    const modal = page.getByTestId('order-modal');

    await expect(modal).toBeVisible();
  });

  test('отображение данных выбранного ингредиента в модальном окне', async ({
    page
  }) => {
    const firstIngredient = page.locator('a[href^="/ingredients/"]').first();

    const ingredientName = (
      await firstIngredient.locator('p').last().textContent()
    )?.trim();

    expect(ingredientName).toBeTruthy();

    await firstIngredient.click();

    await expect(page).toHaveURL(/\/ingredients\/[^/]+$/);

    const modal = page.getByTestId('order-modal');

    await expect(modal).toBeVisible();

    await expect(
      modal.getByRole('heading', {
        name: ingredientName!,
        exact: true
      })
    ).toBeVisible();

    await expect(
      modal.getByText('Калории, ккал', {
        exact: true
      })
    ).toBeVisible();

    await expect(
      modal.getByText('Белки, г', {
        exact: true
      })
    ).toBeVisible();

    await expect(
      modal.getByText('Жиры, г', {
        exact: true
      })
    ).toBeVisible();

    await expect(
      modal.getByText('Углеводы, г', {
        exact: true
      })
    ).toBeVisible();
  });

  test('закрытие модального окна по клику на крестик', async ({ page }) => {
    const firstIngredient = page.locator('a[href^="/ingredients/"]').first();

    await firstIngredient.click();

    await expect(page).toHaveURL(/\/ingredients\/[^/]+$/);

    const modal = page.getByTestId('order-modal');

    await expect(modal).toBeVisible();

    const closeButton = modal.getByRole('button');

    await expect(closeButton).toBeVisible();

    await closeButton.click();

    await expect(page).toHaveURL('/');

    await expect(
      page.getByRole('heading', {
        name: 'Булки',
        exact: true
      })
    ).toBeVisible();

    await expect(modal).not.toBeVisible();
  });

  test('закрытие модального окна по клику на оверлей', async ({ page }) => {
    const firstIngredient = page.locator('a[href^="/ingredients/"]').first();

    await firstIngredient.click();

    await expect(page).toHaveURL(/\/ingredients\/[^/]+$/);

    const modal = page.getByTestId('order-modal');

    await expect(modal).toBeVisible();

    await page.mouse.click(10, 10);

    await expect(page).toHaveURL('/');

    await expect(
      page.getByRole('heading', {
        name: 'Булки',
        exact: true
      })
    ).toBeVisible();

    await expect(modal).not.toBeVisible();
  });
});
