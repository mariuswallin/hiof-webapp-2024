import { test, expect, type Page } from "@playwright/test";

let page: Page;

const removeCreatedHabit = async (page: Page, title: string) => {
  page.click(`button:has-text("[del]")`);
};

test.describe("Habits Page", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    await context.addCookies([
      {
        name: "user.id",
        value: "550e8400-e29b-41d4-a716-446655440000",
        domain: "localhost",
        path: "/",
      },
    ]);
    page = await context.newPage();
    await page.goto("/");
  });
  test("should list habits", async () => {
    const card = page.locator(".habit-card", { state: "visible" }).first();
    await card.waitFor();
    const habitCount = await page.locator(".habit-card").count();
    expect(habitCount).toBe(2);
  });
  test("should add a new habit", async () => {
    await page.fill('input[placeholder="Legg til tittel"]', "Ny testvane");
    await page.click('button:has-text("Legg til vane")');
    await expect(
      page.locator('.habit-card:has-text("Ny testvane")')
    ).toBeVisible();
  });
  test("should delete a habit", async () => {
    await page.fill(
      'input[placeholder="Legg til tittel"]',
      "Vane som skal slettes"
    );
    await page.click('button:has-text("Legg til vane")');
    await page.waitForSelector('.habit-card:has-text("Vane som skal slettes")');

    await page.click(
      '.habit-card:has-text("Vane som skal slettes") button:has-text("[del]")'
    );
    await expect(
      page.locator('.habit-card:has-text("Vane som skal slettes")')
    ).not.toBeVisible();
  });
  test("should update a habit", async () => {
    await page.fill(
      'input[placeholder="Legg til tittel"]',
      "Vane som skal oppdateres"
    );
    await page.click('button:has-text("Legg til vane")');
    await page.waitForSelector(
      '.habit-card:has-text("Vane som skal oppdateres")'
    );
    await page.click(
      '.habit-card:has-text("Vane som skal oppdateres") button:has-text("[endre]")'
    );
    await page.fill(
      'input[value="Vane som skal oppdateres"]',
      "Oppdatert vane"
    );
    await page.click('button:has-text("Endre vane")');
    await expect(
      page.locator('.habit-card:has-text("Oppdatert vane")')
    ).toBeVisible();
  });

  test("should update streak", async () => {
    await page.fill('input[placeholder="Legg til tittel"]', "Vane med streak");
    await page.click('button:has-text("Legg til vane")');
    const card = page.locator('.habit-card:has-text("Vane med streak")').last();
    await card.waitFor({ state: "visible" });

    await card.locator("button:has-text('Legg til streak')").click();
    const streakElement = card.locator("li");
    await streakElement.waitFor({ state: "visible" });
    const streakCount = await streakElement.count();
    console.log(`Number of streaks: ${streakCount}`);

    expect(streakCount).toBe(1);
  });
});
