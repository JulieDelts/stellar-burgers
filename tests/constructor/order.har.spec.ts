import { test, expect } from '@playwright/test';

test('записать HAR для создания заказа', async ({ browser }) => {
  const context = await browser.newContext({
    recordHar: {
      path: './tests/hars/orders.har',
      content: 'embed',
      mode: 'full',
      urlFilter: '**/api/orders'
    }
  });

  const page = await context.newPage();

  const accessToken =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNzNjZGZjNmExNzJkMDAxYjk5MWQxNyIsImlhdCI6MTc4NjYyNzc1NiwiZXhwIjoxNzg2NjI4OTU2fQ.FnBg7CvfYILyoLBvTMzQh96z1TJYIJXVdWYNTaWpNhs';

  await page.addInitScript(
    ({ accessToken }) => {
      localStorage.setItem('accessToken', accessToken);
    },
    { accessToken }
  );

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

  await page.goto('/');

  const bunLink = page
    .getByRole('link', {
      name: /Краторная булка N-200i/
    })
    .first();

  await expect(bunLink).toBeVisible({
    timeout: 10000
  });

  await bunLink
    .locator('xpath=ancestor::li')
    .getByRole('button', {
      name: 'Добавить'
    })
    .click();

  const fillingName = 'Биокотлета из марсианской Магнолии';

  const fillingLink = page
    .getByRole('link', {
      name: new RegExp(fillingName)
    })
    .first();

  await expect(fillingLink).toBeVisible({
    timeout: 10000
  });

  await fillingLink
    .locator('xpath=ancestor::li')
    .getByRole('button', {
      name: 'Добавить'
    })
    .click();

  const orderButton = page.getByRole('button', {
    name: 'Оформить заказ'
  });

  await expect(orderButton).toBeEnabled();

  const orderResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/api/orders')
  );

  await orderButton.click();

  const orderResponse = await orderResponsePromise;

  expect(orderResponse.ok()).toBeTruthy();

  await expect(
    page.getByText('идентификатор заказа', {
      exact: true
    })
  ).toBeVisible({
    timeout: 15000
  });

  await context.close();
});
