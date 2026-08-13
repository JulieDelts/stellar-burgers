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
    const constructor = page.getByTestId('burger-constructor');

    const bunsHeading = page.getByRole('heading', {
      name: 'Булки',
      exact: true
    });

    const bunsList = bunsHeading.locator('~ ul');
    const firstBun = bunsList.locator('li').first();

    await bunsHeading.scrollIntoViewIfNeeded();

    const bunName = firstBun.locator('p').last();
    const bunNameText = (await bunName.textContent())!.trim();

    await firstBun.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText(`${bunNameText} (верх)`, { exact: false })
    ).toBeVisible();

    await expect(
      constructor.getByText(`${bunNameText} (низ)`, { exact: false })
    ).toBeVisible();
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    const constructor = page.getByTestId('burger-constructor');

    const mainsHeading = page.getByRole('heading', {
      name: 'Начинки',
      exact: true
    });

    const mainsList = mainsHeading.locator('~ ul');
    const firstMain = mainsList.locator('li').first();

    await mainsHeading.scrollIntoViewIfNeeded();

    const mainName = firstMain.locator('p').last();
    const mainNameText = (await mainName.textContent())!.trim();

    await firstMain.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText(mainNameText, { exact: true })
    ).toBeVisible();
  });

  test('добавление соуса в конструктор', async ({ page }) => {
    const constructor = page.getByTestId('burger-constructor');

    const saucesHeading = page.getByRole('heading', {
      name: 'Соусы',
      exact: true
    });

    const saucesList = saucesHeading.locator('~ ul');
    const firstSauce = saucesList.locator('li').first();

    await saucesHeading.scrollIntoViewIfNeeded();

    const sauceName = firstSauce.locator('p').last();
    const sauceNameText = (await sauceName.textContent())!.trim();

    await firstSauce.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText(sauceNameText, { exact: true })
    ).toBeVisible();
  });

  test('добавление нескольких ингредиентов разных типов', async ({ page }) => {
    const constructor = page.getByTestId('burger-constructor');

    const bunsHeading = page.getByRole('heading', {
      name: 'Булки',
      exact: true
    });

    const bunsList = bunsHeading.locator('~ ul');
    const firstBun = bunsList.locator('li').first();

    await bunsHeading.scrollIntoViewIfNeeded();

    const bunName = firstBun.locator('p').last();
    const bunNameText = (await bunName.textContent())!.trim();

    await firstBun.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText(`${bunNameText} (верх)`, { exact: false })
    ).toBeVisible();

    await expect(
      constructor.getByText(`${bunNameText} (низ)`, { exact: false })
    ).toBeVisible();

    const mainsHeading = page.getByRole('heading', {
      name: 'Начинки',
      exact: true
    });

    const mainsList = mainsHeading.locator('~ ul');
    const firstMain = mainsList.locator('li').first();

    await mainsHeading.scrollIntoViewIfNeeded();

    const mainName = firstMain.locator('p').last();
    const mainNameText = (await mainName.textContent())!.trim();

    await firstMain.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText(mainNameText, { exact: true })
    ).toBeVisible();

    const saucesHeading = page.getByRole('heading', {
      name: 'Соусы',
      exact: true
    });

    const saucesList = saucesHeading.locator('~ ul');
    const firstSauce = saucesList.locator('li').first();

    await saucesHeading.scrollIntoViewIfNeeded();

    const sauceName = firstSauce.locator('p').last();
    const sauceNameText = (await sauceName.textContent())!.trim();

    await firstSauce.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText(sauceNameText, { exact: true })
    ).toBeVisible();
  });
});
