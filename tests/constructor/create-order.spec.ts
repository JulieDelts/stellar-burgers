import { test, expect } from '@playwright/test';

test('полный цикл создания заказа', async ({ page, context }) => {
  const accessToken =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNzNjZGZjNmExNzJkMDAxYjk5MWQxNyIsImlhdCI6MTc4NjYyNzc1NiwiZXhwIjoxNzg2NjI4OTU2fQ.FnBg7CvfYILyoLBvTMzQh96z1TJYIJXVdWYNTaWpNhs';

  await page.addInitScript(() => {
    localStorage.setItem('accessToken', accessToken);
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value: accessToken,
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.routeFromHAR('./tests/hars/auth-user.har', {
    url: '**/api/auth/user',
    update: false
  });

  await page.routeFromHAR('./tests/hars/orders.har', {
    url: '**/api/orders',
    update: false
  });

  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Julie' })).toBeVisible({
    timeout: 10000
  });

  const bunLink = page
    .getByRole('link', {
      name: /Краторная булка N-200i/
    })
    .first();

  await expect(bunLink).toBeVisible();

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

  await expect(fillingLink).toBeVisible();

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

  const constructor = page.getByTestId('burger-constructor');

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

  const orderModal = page.getByTestId('order-modal');

  await expect(orderModal).toBeVisible();

  await expect(orderModal.getByText('109108', { exact: true })).toBeVisible({
    timeout: 15000
  });

  await expect(
    orderModal.getByText('Ваш заказ начали готовить', {
      exact: true
    })
  ).toBeVisible();

  await expect(
    orderModal.getByText('Дождитесь готовности на орбитальной станции', {
      exact: true
    })
  ).toBeVisible();

  await orderModal.getByRole('button').click();

  await expect(orderModal).not.toBeVisible();

  await expect(
    constructor.getByText('Выберите булки', { exact: true })
  ).toHaveCount(2);

  await expect(
    constructor.getByText('Выберите начинку', { exact: true })
  ).toBeVisible();

  await expect(
    constructor.getByText('Биокотлета из марсианской Магнолии', { exact: true })
  ).toHaveCount(0);
});
