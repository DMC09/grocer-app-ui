import { test, expect } from "@playwright/test";

test.describe("Multi User Scenarios", () => {
  test("Group  Work Flow", async ({ browser }) => {
    const firstContext = await browser.newContext();
    const fA = await firstContext.newPage();

    const secondContext = await browser.newContext();
    const sA = await secondContext.newPage();

    let code: string | null = null;

    await test.step("FA: Sign in and redirect to homepage", async () => {
      await fA.goto("/");
      await expect(fA).toHaveURL("/login", {
        timeout: 120000,
      });
      await fA.getByPlaceholder("Your email address").click({ delay: 500 });
      await fA
        .getByPlaceholder("Your email address")
        .fill(process.env.PLAYWRIGHT_USERNAME as string, { timeout: 5000 });
      await fA.getByPlaceholder("Your password").click({ delay: 500 });
      await fA
        .getByPlaceholder("Your password")
        .fill(process.env.PLAYWRIGHT_PASSWORD as string, { timeout: 5000 });
      await fA
        .getByRole("button", { name: "Sign in", exact: true })
        .click({ delay: 500 });
      await expect(fA).toHaveURL("/dashboard", {
        timeout: 20000,
      });
    });

    await test.step("SA: Sign in and redirect to homepage", async () => {
      await sA.goto("/");
      await expect(sA).toHaveURL("/login", {
        timeout: 120000,
      });
      await sA.getByPlaceholder("Your email address").click({ delay: 500 });
      await sA
        .getByPlaceholder("Your email address")
        .fill(process.env.PLAYWRIGHTALT_USERNAME as string, { timeout: 5000 });
      await sA.getByPlaceholder("Your password").click({ delay: 500 });
      await sA
        .getByPlaceholder("Your password")
        .fill(process.env.PLAYWRIGHTALT_PASSWORD as string, { timeout: 5000 });
      await sA
        .getByRole("button", { name: "Sign in", exact: true })
        .click({ delay: 500 });
      await expect(sA).toHaveURL("/dashboard", {
        timeout: 20000,
      });
    });

    await test.step("FA: Verify no stores placeholder text", async () => {
      await expect(fA.getByText("No stores available...")).toBeVisible();
    });

    await test.step("SA: Verify no stores placeholder text", async () => {
      await expect(sA.getByText("No stores available...")).toBeVisible();
    });

    await test.step("FA: Go to Common item catalog", async () => {
      await fA.getByLabel("Profile Menu").click({ delay: 2000 });
      await fA.getByRole("menuitem", { name: "Settings" }).click();
      await expect(fA).toHaveURL("/settings", {
        timeout: 120000,
      });
      await fA.getByRole("tab", { name: "Common Items" }).click();
    });

    await test.step("SA: Go to Common item catalog", async () => {
      await sA.getByLabel("Profile Menu").click({ delay: 2000 });
      await sA.getByRole("menuitem", { name: "Settings" }).click();
      await expect(sA).toHaveURL("/settings", {
        timeout: 120000,
      });
      await sA.getByRole("tab", { name: "Common Items" }).click();
    });

    await test.step("FA: Add a new Common Item (Butter - Kerrygold Unsalted)", async () => {
      await fA.getByLabel("Add New Common item").click();
      await fA.getByLabel("Name").fill("Butter");
      await fA.getByLabel("Notes").fill("Kerrygold Unsalted");
      await fA.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("SA: Add a new Common Item (Butter - Kerrygold Salted)", async () => {
      await expect(sA).toHaveURL("/settings", {
        timeout: 120000,
      });
      await sA.getByLabel("Add New Common item").click();
      await sA.getByLabel("Name").fill("Butter");
      await sA.getByLabel("Notes").fill("Kerrygold Salted");
      await sA.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("FA: Go to the Home page", async () => {
      await fA.getByLabel("To Home").click();
    });

    await test.step("SA: Go to the Home page", async () => {
      await sA.getByLabel("To Home").click();
    });

    await test.step("FA: Add new store - Aldi", async () => {
      await fA.getByLabel("Open dashboard menu").first().click({ delay: 500 });
      await fA.getByRole("menuitem", { name: "Add new store" }).click();
      await fA.getByLabel("Name").fill("Aldi");
      await fA.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("SA: add new store - Kroger", async () => {
      await sA.getByLabel("Open dashboard menu").first().click({ delay: 500 });
      await sA.getByRole("menuitem", { name: "Add new store" }).click();
      await sA.getByLabel("Name").fill("Kroger");
      await sA.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("FA: Go in to Aldi store", async () => {
      await expect(fA.getByRole("button", { name: "Aldi" })).toBeVisible();
      await fA.getByRole("button", { name: "Aldi" }).click({ delay: 500 });
      await expect(fA).toHaveURL(new RegExp("/dashboard/grocerystores/*"), {
        timeout: 1200000,
      });
    });

    await test.step("SA: Go in to Kroger store", async () => {
      await expect(sA.getByRole("button", { name: "Kroger" })).toBeVisible();
      await sA.getByRole("button", { name: "Kroger" }).click({ delay: 500 });
      await expect(sA).toHaveURL(new RegExp("/dashboard/grocerystores/*"), {
        timeout: 1200000,
      });
    });

    await test.step("FA: Add new Item (Eggs - Large white) to Aldi store", async () => {
      await fA.getByLabel("Open grocery store menu").click({ delay: 500 });
      await fA
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await fA.getByLabel("Name").fill("Eggs");
      await fA.getByLabel("Notes").fill("Large white");
      await fA.getByLabel("Quantity").fill("1");
      await fA.getByRole("button", { name: "Submit" }).click({ delay: 500 });
    });

    await test.step("SA: Add new Item (Eggs - Large brown) to Kroger store", async () => {
      await sA.getByLabel("Open grocery store menu").click({ delay: 500 });
      await sA
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await sA.getByLabel("Name").fill("Eggs");
      await sA.getByLabel("Notes").fill("Large brown");
      await sA.getByLabel("Quantity").fill("1");
      await sA.getByRole("button", { name: "Submit" }).click({ delay: 500 });
    });

    await test.step("FA: Create Group (Z fighters)", async () => {
      await fA.getByLabel("Profile Menu").click();
      await fA.getByRole("menuitem", { name: "Settings" }).click();
      await expect(fA).toHaveURL("/settings", {
        timeout: 120000,
      });
      await fA.getByRole("tab", { name: "Group" }).click();
      await fA.getByLabel("Create new group").click();
      await fA.getByLabel("Group Name").fill("Z Fighters");
      await fA.getByRole("button", { name: "Submit" }).click();
      await expect(fA.getByText("Z Fighters")).toBeVisible({
        timeout: 2000,
      });
      await fA.getByRole("button", { name: "Share Code" }).click();
      await fA.getByLabel("Share Code").click();
      code = await fA.getByLabel("Share Code").innerText();
    });

    await test.step("SA: Join Group (Z fighters)", async () => {
      await sA.getByLabel("Profile Menu").click();
      await sA.getByRole("menuitem", { name: "Settings" }).click();
      await expect(sA).toHaveURL("/settings", {
        timeout: 120000,
      });
      await sA.getByRole("tab", { name: "Group" }).click();
      await sA.getByLabel("Join a group").click();
      await sA.getByLabel("Share Code", { exact: true }).click({ delay: 500 });

      await sA.getByLabel("Share Code", { exact: true }).fill(code as string);
      await sA.getByRole("button", { name: "Submit" }).click();

      await expect(sA.getByText("Z Fighters")).toBeVisible({
        timeout: 20000,
      });
    });

    await test.step("FA: Go to the home page", async () => {
      await fA.getByLabel("To Home").click();
    });

    await test.step("SA: Go to the home page", async () => {
      await sA.getByLabel("To Home").click();
    });

    await test.step("FA: Verify no stores place holder message", async () => {
      await expect(fA).toHaveURL("/dashboard", {
        timeout: 20000,
      });
      await expect(fA.getByText("No stores available...")).toBeVisible();
    });

    await test.step("SA: Verify no stores place holder message", async () => {
      await expect(sA).toHaveURL("/dashboard", {
        timeout: 20000,
      });
      await expect(sA.getByText("No stores available...")).toBeVisible();
    });

    await test.step("SA:Switch view to all items", async () => {
      await sA.getByLabel("Open dashboard menu").first().click({ delay: 500 });
      await sA.getByRole("menuitem", { name: "View all" }).first().click();
    });

    await test.step("SA: Verify no items message", async () => {
      await expect(sA.getByText("No items available...")).toBeVisible();
    });

    await test.step("FA: Add new Store Whole Foods", async () => {
      await fA.getByLabel("Open dashboard menu").first().click({ delay: 500 });
      await fA.getByRole("menuitem", { name: "Add new store" }).click();
      await fA.getByLabel("Name").fill("Whole Foods");
      await fA.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("FA: Go in to Whole Foods store", async () => {
      await expect(
        fA.getByRole("button", { name: "Whole Foods" })
      ).toBeVisible();
      await fA
        .getByRole("button", { name: "Whole Foods" })
        .click({ delay: 500 });
      await expect(fA).toHaveURL(new RegExp("/dashboard/grocerystores/*"), {
        timeout: 1200000,
      });
    });

    await test.step("FA: Add (Sour Cream - Light) to Whole Foods store", async () => {
      await fA.getByLabel("Open grocery store menu").click({ delay: 500 });
      await fA
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await fA.getByLabel("Name").fill("Sour Cream");
      await fA.getByLabel("Notes").fill("Light");
      await fA.getByLabel("Quantity").fill("1");
      await fA.getByRole("button", { name: "Submit" }).click({ delay: 500 });
    });

    await test.step("SA:Verify Sour Cream Light was added when in all items view", async () => {
      await expect(
        sA.getByRole("button", { name: "Sour Cream Light" })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("SA:Add (Salsa - Tostitos) item to Whole Foods store", async () => {
      await sA.getByLabel("Open dashboard menu").first().click({ delay: 500 });
      await sA
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 1000 });
      await fA.getByLabel("Name").fill("Salsa");
      await fA.getByLabel("Notes").fill("Tostitos");
      await fA.getByLabel("Quantity").fill("1");
      await fA.pause()
      // TODO: use dropdown to select "Whole foods"
      // INFO: the drop down is not showing whole foods. 
      // 1. edit logic to fetch the stores when opening an add item
      // 2. edit validation to includes special characters.
      // pull to refresh on the common items
      await fA.getByRole("button", { name: "Submit" }).click({ delay: 500 });
    });

    await test.step("SA:Add (Tortilla chips - Blue Corn) item w/out a store in all items view", async () => {
      await sA.getByLabel("Open dashboard menu").first().click({ delay: 500 });
      await sA
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await fA.getByLabel("Name").fill("Tortilla chips");
      await fA.getByLabel("Notes").fill("Blue Corn");
      await fA.getByLabel("Quantity").fill("1");
      await fA.getByRole("button", { name: "Submit" }).click({ delay: 500 });
    });

    await test.step("FA: Add (Salsa - Tostitos) to common item catalog via flag ", async () => {
      await fA.getByRole("button", { name: "Salsa Tostitos" }).click();
      await fA
        .getByRole("checkbox", { name: "Add to Common Items Catalog" })
        .check();
      await fA.keyboard.press("Escape");
    });

    await test.step("SA:Verify (Salsa - Tostitos) was added to common item catalog", async () => {
      // TODO:
      await sA.getByLabel("Profile Menu").click({ delay: 2000 });
      await sA.getByRole("menuitem", { name: "Settings" }).click();
      await expect(sA).toHaveURL("/settings", {
        timeout: 120000,
      });
      await sA.getByRole("tab", { name: "Common Items" }).click();
      await expect(
        sA.getByRole("button", {
          name: "Image of Salsa Salsa Tostitos",
        })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("FA: Leave Group", async () => {
      await fA.getByLabel("Profile Menu").click();
      await fA.getByRole("menuitem", { name: "Settings" }).click();
      await fA.getByRole("tab", { name: "Group" }).click();
      await fA.getByRole("button", { name: "Leave Group" }).click();
    });

    await test.step("SA: Leave group ", async () => {
      await sA.getByLabel("Profile Menu").click();
      await sA.getByRole("menuitem", { name: "Settings" }).click();
      await sA.getByRole("tab", { name: "Group" }).click();
      await sA.getByRole("button", { name: "Leave Group" }).click();
    });

    await test.step("FA: Verify Common Item Butter Kerrygold Unsalted ", async () => {
      await fA.getByRole("tab", { name: "Common Items" }).click();
      await expect(
        fA.getByRole("button", {
          name: "Image of Butter Butter Kerrygold Unsalted",
        })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("SA: Verify Butter Kerrygold Salted Common Item ", async () => {
      await sA.getByRole("tab", { name: "Common Items" }).click();
      await expect(
        sA.getByRole("button", {
          name: "Image of Butter Butter Kerrygold Salted",
        })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("FA: Delete Butter Kerrygold Unsalted Common Item ", async () => {
      await fA
        .getByRole("button", {
          name: "Image of Butter Butter Kerrygold Unsalted",
        })
        .click();
      await fA.getByLabel("Delete Common Item").click();
    });

    await test.step("SA: Delete Butter Kerrygold Salted Common Item ", async () => {
      await sA
        .getByRole("button", {
          name: "Image of Butter Butter Kerrygold Salted",
        })
        .click();
      await sA.getByLabel("Delete Common Item").click();
    });

    await test.step("FA: Go to home page ", async () => {
      await fA.getByLabel("To Home").click();
    });

    await test.step("SA: Go to home page ", async () => {
      await sA.getByLabel("To Home").click();
    });

    await test.step("FA: Verify Aldi store is still there ", async () => {
      await expect(fA.getByRole("button", { name: "Aldi" })).toBeVisible();
    });

    await test.step("SA: Verify Kroger store is still there", async () => {
      await expect(sA.getByRole("button", { name: "Kroger" })).toBeVisible();
    });

    await test.step("FA: Go in to Aldi  Store ", async () => {
      await fA.getByRole("button", { name: "Aldi" }).click({ delay: 500 });
      await expect(fA).toHaveURL(new RegExp("/dashboard/grocerystores/*"), {
        timeout: 1200000,
      });
    });

    await test.step("SA: Go in to Kroger Store ", async () => {
      await sA.getByRole("button", { name: "Kroger" }).click({ delay: 500 });
      await expect(sA).toHaveURL(new RegExp("/dashboard/grocerystores/*"), {
        timeout: 1200000,
      });
    });

    await test.step("FA: Delete Aldi store", async () => {
      await fA.getByLabel("Open grocery store menu").click();
      await fA.getByRole("menuitem", { name: "Delete Store" }).click();
      await expect(fA).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    await test.step("SA: Delete Kroger store", async () => {
      await sA.getByLabel("Open grocery store menu").click();
      await sA.getByRole("menuitem", { name: "Delete Store" }).click();
      await expect(sA).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    await test.step("FA: Sign out ", async () => {
      await fA.getByLabel("Profile Menu").click();
      await fA.getByRole("menuitem", { name: "Sign Out" }).click();
      await expect(fA).toHaveURL("/login", {
        timeout: 120000,
      });
      await fA.close();
    });

    await test.step("SA: Sign out ", async () => {
      await sA.getByLabel("Profile Menu").click();
      await sA.getByRole("menuitem", { name: "Sign Out" }).click();
      await expect(sA).toHaveURL("/login", {
        timeout: 120000,
      });
      await sA.close();
    });
  });
});
