import {
  test,
  expect,
  type Page,
  type Locator,
  type BrowserContext,
} from "@playwright/test";

let page: Page;
let context: BrowserContext;

const removeCreatedHabit = async (deleteButton: Locator) => {
  console.log("deleteButton", deleteButton);

  await deleteButton.click();
};

const removeAllTestHabits = async () => {
  const habitList = await page
    .locator(".habit-card")
    .filter({ hasText: /test/i })
    .all();

  const habitDeleteButtons = await Promise.all(
    habitList.map((habit) => habit.locator("button:has-text('[del]')"))
  );

  for (const habit of habitDeleteButtons) {
    await removeCreatedHabit(habit);
  }
};

const createRandomTitle = (title: string) => {
  const randomTextString = Math.random().toString(36).substring(7);
  return `${title} ${randomTextString}`;
};

test.describe("Habits Page", () => {
  // test.afterAll(async () => {
  //   if (page) {
  //     await removeAllTestHabits();
  //     await page.close();
  //   }
  //   if (context) {
  //     await context.close();
  //   }
  // });
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
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
    const habitCount = await page.locator(".habit-card").count();
    expect(habitCount).toBeGreaterThanOrEqual(0);
  });
  test("should add a new habit", async () => {
    const title = createRandomTitle("Ny testvane");
    await page.fill('input[placeholder="Legg til tittel"]', title);
    await page.click('button:has-text("Legg til vane")');
    await expect(
      page.locator(`.habit-card:has-text("${title}")`)
    ).toBeVisible();
  });
  test("should delete a habit", async () => {
    const title = createRandomTitle("Testvane som skal slettes");

    await page.fill('input[placeholder="Legg til tittel"]', title);
    await page.click('button:has-text("Legg til vane")');

    const habitLocator = page.locator(`.habit-card:has-text("${title}")`);

    await habitLocator.locator('button:has-text("[del]")').click();

    await expect(
      page.locator(`.habit-card:has-text("${title}")`)
    ).not.toBeVisible();
  });
  test("should update a habit", async () => {
    const title = createRandomTitle("Testvane som skal oppdateres");
    await page.fill('input[placeholder="Legg til tittel"]', title);
    await page.click('button:has-text("Legg til vane")');
    await page.waitForSelector(`.habit-card:has-text("${title}")`);

    await page.click(
      `.habit-card:has-text("${title}") button:has-text("[endre]")`
    );
    const updatedTitle = createRandomTitle("Oppdatert testvane");
    await page.fill(`input[value="${title}"]`, updatedTitle);
    await page.click(`button:has-text("Endre vane")`);
    await page.waitForResponse("**/v1/habits");
    await expect(
      page.locator(`.habit-card:has-text("${updatedTitle}")`)
    ).toBeVisible();
  });
  test("should update streak", async () => {
    const title = createRandomTitle("Testvane med streak");
    await page.fill('input[placeholder="Legg til tittel"]', title);
    await page.click('button:has-text("Legg til vane")');
    const card = await page.locator(`.habit-card:has-text("${title}")`);
    await card.locator("button:has-text('Legg til streak')").click();
    await page.waitForResponse("**/v1/habits/**/streaks");
    const streakElements = await card
      .locator('[data-testid="streak-item"]')
      .all();
    await expect(
      page.locator(`.habit-card:has-text("${title}")`)
    ).toBeVisible();
    expect(streakElements).toHaveLength(1);
  });
  test("should remove all test habits", async () => {
    await removeAllTestHabits();
    const habitCount = await page.locator(".habit-card").count();
    expect(habitCount).toBe(0);
  });
});
