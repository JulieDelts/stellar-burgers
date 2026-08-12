import { test, expect } from '@playwright/test';

test.describe('Создание заказа', () => {
  test('полный цикл создания заказа', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'Bearer test-access-token');

      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.route('**/api/auth/user', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            user: {
              email: 'test@test.ru',
              name: 'Test User'
            }
          })
        });

        return;
      }

      await route.continue();
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            name: 'Краторная булка N-200i',
            order: {
              number: 123456
            }
          })
        });

        return;
      }

      await route.continue();
    });

    await page.goto('/');

    const bunLink = page
      .getByRole('link', {
        name: /Краторная булка N-200i/
      })
      .first();

    await expect(bunLink).toBeVisible({
      timeout: 10000
    });

    const bunCard = bunLink.locator('xpath=ancestor::li');

    await expect(bunCard).toBeVisible();

    const addBunButton = bunCard.getByRole('button', {
      name: 'Добавить'
    });

    await expect(addBunButton).toBeVisible();

    await addBunButton.click();

    const fillingName = 'Биокотлета из марсианской Магнолии';

    const fillingLink = page
      .getByRole('link', {
        name: new RegExp(fillingName)
      })
      .first();

    await expect(fillingLink).toBeVisible({
      timeout: 10000
    });

    const fillingCard = fillingLink.locator('xpath=ancestor::li');

    await expect(fillingCard).toBeVisible();

    const addFillingButton = fillingCard.getByRole('button', {
      name: 'Добавить'
    });

    await expect(addFillingButton).toBeVisible();

    await addFillingButton.click();

    const orderButton = page.getByRole('button', {
      name: 'Оформить заказ'
    });

    await expect(orderButton).toBeVisible();

    const constructor = orderButton.locator('xpath=ancestor::section');

    await expect(constructor).toBeVisible();

    await expect(
      constructor.getByText('Краторная булка N-200i (верх)', {
        exact: true
      })
    ).toBeVisible();

    const constructorFilling = constructor
      .locator('span.constructor-element__text')
      .filter({
        hasText: new RegExp(`^${fillingName}$`)
      });

    await expect(constructorFilling).toHaveCount(1);

    await expect(constructorFilling).toBeVisible();

    await expect(
      constructor.getByText('Краторная булка N-200i (низ)', {
        exact: true
      })
    ).toBeVisible();

    await expect(orderButton).toBeEnabled();

    await orderButton.click();

    await expect(
      page.getByText('идентификатор заказа', {
        exact: true
      })
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      page.getByText('123456', {
        exact: true
      })
    ).toBeVisible();

    await expect(
      page.getByText('Ваш заказ начали готовить', {
        exact: true
      })
    ).toBeVisible();

    await expect(
      page.getByText('Дождитесь готовности на орбитальной станции', {
        exact: true
      })
    ).toBeVisible();
  });
});
