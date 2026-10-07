import { expect, test } from "@playwright/test";

test("user can change churn, understand ARR, and reset the scenario", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Confirm baseline ARR
  const outcomesSection = page
    .getByRole("heading", { name: "Outcomes" })
    .locator("..");

  const arrCard = outcomesSection
    .locator(".kpi-card")
    .filter({ hasText: /^ARR/ });

  const arrValue = arrCard.locator(".kpi-value");

  await expect(arrValue).toHaveText("£2,518,275");
  await expect(arrCard).toContainText("No change vs baseline");

  const baselineArr = await arrValue.innerText();

  // 2. Change churn
  const churnSlider = page.getByRole("slider", {
    name: /monthly churn/i,
  });

  await expect(churnSlider).toHaveValue("1.5");

  await churnSlider.focus();
  await churnSlider.press("ArrowLeft");

  await expect(churnSlider).toHaveValue("1.4");

  // 3. Confirm ARR changes in the expected direction
  await expect(arrValue).not.toHaveText(baselineArr);
  await expect(arrCard).toContainText(/\+£.*vs baseline/);

  // 4. Open the causal explanation


  await page
  .getByRole("button", { name: "ARR", exact: true })
  .click();

  await expect(
  page.getByText("MRR × 12", { exact: true }),
).toBeVisible();

  // Drill one level deeper
  await page
  .getByRole("button", { name: "Explore MRR", exact: true })
  .click();

 await expect(
  page.getByText("Ending customers × Monthly price", {
    exact: true,
  }),
).toBeVisible();

  // 5. Reset
  await page
    .getByRole("button", { name: /reset scenario/i })
    .click();

  // 6. Confirm baseline returns
  await expect(churnSlider).toHaveValue("1.5");
  await expect(arrValue).toHaveText(baselineArr);
  await expect(arrCard).toContainText("No change vs baseline");
});