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

    await expect(
      page
        .getByRole('heading')
        .filter({
          hasText: /./
        })
        .last()
    ).toBeVisible();
  });

  test('отображение данных выбранного ингредиента в модальном окне', async ({
    page
  }) => {
    const firstIngredient = page.locator('a[href^="/ingredients/"]').first();

    const ingredientName = (
      await firstIngredient.locator('p').last().textContent()
    )?.trim();

    await firstIngredient.click();

    await expect(page).toHaveURL(/\/ingredients\/[^/]+$/);

    if (ingredientName) {
      await expect(
        page.getByRole('heading', {
          name: ingredientName,
          exact: true
        })
      ).toBeVisible();
    }

    await expect(
      page.getByText('Калории, ккал', {
        exact: true
      })
    ).toBeVisible();

    await expect(
      page.getByText('Белки, г', {
        exact: true
      })
    ).toBeVisible();

    await expect(
      page.getByText('Жиры, г', {
        exact: true
      })
    ).toBeVisible();

    await expect(
      page.getByText('Углеводы, г', {
        exact: true
      })
    ).toBeVisible();
  });

  test('закрытие модального окна по клику на крестик', async ({ page }) => {
    const firstIngredient = page.locator('a[href^="/ingredients/"]').first();

    await firstIngredient.click();

    await expect(page).toHaveURL(/\/ingredients\/[^/]+$/);

    const closeButton = page
      .getByRole('button')
      .filter({
        has: page.locator('svg')
      })
      .last();

    await expect(closeButton).toBeVisible();

    await closeButton.click();

    await expect(page).toHaveURL('/');

    await expect(
      page.getByRole('heading', {
        name: 'Булки',
        exact: true
      })
    ).toBeVisible();
  });

  test('закрытие модального окна по клику на оверлей', async ({ page }) => {
    const firstIngredient = page.locator('a[href^="/ingredients/"]').first();

    await firstIngredient.click();

    await expect(page).toHaveURL(/\/ingredients\/[^/]+$/);

    await page.mouse.click(10, 10);

    await expect(page).toHaveURL('/');

    await expect(
      page.getByRole('heading', {
        name: 'Булки',
        exact: true
      })
    ).toBeVisible();
  });
});
