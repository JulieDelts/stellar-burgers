import { test, expect } from '@playwright/test';

test('записать HAR для получения данных пользователя', async ({
  page,
  context
}) => {
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

  await page.routeFromHAR('./tests/hars/auth-user.har', {
    url: '**/api/auth/user',
    update: true
  });

  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Julie' })).toBeVisible({
    timeout: 15000
  });
});
