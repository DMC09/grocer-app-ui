import { test, expect } from "@playwright/test";

test.describe("Multi User Scenarios", () => {
  test("Group  Work Flow", async ({ browser }) => {
    const firstContext = await browser.newContext();
    const firstAccount = await firstContext.newPage();

    const secondContext = await browser.newContext();
    const secondAccount = await secondContext.newPage();

    let code: string | null = null;

    await test.step("FA: Sign in and redirect to homepage", async () => {
      await firstAccount.goto("/");
      await expect(firstAccount).toHaveURL("/login", {
        timeout: 120000,
      });
      await firstAccount
        .getByPlaceholder("Your email address")
        .click({ delay: 500 });
      await firstAccount
        .getByPlaceholder("Your email address")
        .fill(process.env.PLAYWRIGHT_USERNAME as string, { timeout: 5000 });
      await firstAccount
        .getByPlaceholder("Your password")
        .click({ delay: 500 });
      await firstAccount
        .getByPlaceholder("Your password")
        .fill(process.env.PLAYWRIGHT_PASSWORD as string, { timeout: 5000 });
      await firstAccount
        .getByRole("button", { name: "Sign in", exact: true })
        .click({ delay: 500 });
      await expect(firstAccount).toHaveURL("/dashboard", {
        timeout: 20000,
      });
    });

    await test.step("SA: Sign in and redirect to homepage", async () => {
      await secondAccount.goto("/");
      await expect(secondAccount).toHaveURL("/login", {
        timeout: 120000,
      });
      await secondAccount
        .getByPlaceholder("Your email address")
        .click({ delay: 500 });
      await secondAccount
        .getByPlaceholder("Your email address")
        .fill(process.env.PLAYWRIGHTALT_USERNAME as string, { timeout: 5000 });
      await secondAccount
        .getByPlaceholder("Your password")
        .click({ delay: 500 });
      await secondAccount
        .getByPlaceholder("Your password")
        .fill(process.env.PLAYWRIGHTALT_PASSWORD as string, { timeout: 5000 });
      await secondAccount
        .getByRole("button", { name: "Sign in", exact: true })
        .click({ delay: 500 });
      await expect(secondAccount).toHaveURL("/dashboard", {
        timeout: 20000,
      });
    });

    await test.step("FA: Verify no stores placeholder text", async () => {
      await expect(firstAccount.getByText("No Stores added....")).toBeVisible();
    });

    await test.step("SA: Verify no stores placeholder text", async () => {
      await expect(
        secondAccount.getByText("No Stores added....")
      ).toBeVisible();
    });

    await test.step("FA: Go to Common item catalog", async () => {
      await firstAccount.getByLabel("Profile Menu").click({ delay: 2000 });
      await firstAccount.getByRole("menuitem", { name: "Settings" }).click();
      await expect(firstAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await firstAccount.getByRole("tab", { name: "Common Items" }).click();
    });

    await test.step("SA: Go to Common item catalog", async () => {
      await secondAccount.getByLabel("Profile Menu").click({ delay: 2000 });
      await secondAccount.getByRole("menuitem", { name: "Settings" }).click();
      await expect(secondAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await secondAccount.getByRole("tab", { name: "Common Items" }).click();
    });

    await test.step("FA: Add a new Common Item (Butter - Kerrygold Unsalted)", async () => {
      await firstAccount.getByLabel("Add New Common item").click();
      await firstAccount.getByLabel("Name").fill("Butter");
      await firstAccount.getByLabel("Notes").fill("Kerrygold Unsalted");
      await firstAccount.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("SA: Add a new Common Item (Butter - Kerrygold Salted)", async () => {
      await expect(secondAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await secondAccount.getByLabel("Add New Common item").click();
      await secondAccount.getByLabel("Name").fill("Butter");
      await secondAccount.getByLabel("Notes").fill("Kerrygold Salted");
      await secondAccount.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("FA: Go to the Home page", async () => {
      await firstAccount.getByLabel("To Home").click();
    });

    await test.step("SA: Go to the Home page", async () => {
      await secondAccount.getByLabel("To Home").click();
    });

    await test.step("FA: Add new store - Aldi", async () => {
      await firstAccount
        .getByLabel("Open dashboard menu")
        .first()
        .click({ delay: 500 });
      await firstAccount
        .getByRole("menuitem", { name: "Add new store" })
        .click();
      await firstAccount.getByLabel("Name").fill("Aldi");
      await firstAccount.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("SA: add new store - Kroger", async () => {
      await secondAccount
        .getByLabel("Open dashboard menu")
        .first()
        .click({ delay: 500 });
      await secondAccount
        .getByRole("menuitem", { name: "Add new store" })
        .click();
      await secondAccount.getByLabel("Name").fill("Kroger");
      await secondAccount.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("FA: Go in to Aldi store", async () => {
      await expect(
        firstAccount.getByRole("button", { name: "Aldi" })
      ).toBeVisible();
      await firstAccount
        .getByRole("button", { name: "Aldi" })
        .click({ delay: 500 });
      await expect(firstAccount).toHaveURL(
        new RegExp("/dashboard/grocerystores/*"),
        {
          timeout: 1200000,
        }
      );
    });

    await test.step("SA: Go in to Kroger store", async () => {
      await expect(
        firstAccount.getByRole("button", { name: "Kroger" })
      ).toBeVisible();
      await firstAccount
        .getByRole("button", { name: "Kroger" })
        .click({ delay: 500 });
      await expect(firstAccount).toHaveURL(
        new RegExp("/dashboard/grocerystores/*"),
        {
          timeout: 1200000,
        }
      );
    });

    await test.step("FA: Add new Item (Eggs - Large white) to Aldi store", async () => {
      await firstAccount
        .getByLabel("Open grocery store menu")
        .click({ delay: 500 });
      await firstAccount
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await firstAccount.getByLabel("Name").fill("Eggs");
      await firstAccount.getByLabel("Notes").fill("Large white");
      await firstAccount.getByLabel("Quantity").fill("1");
      await firstAccount
        .getByRole("button", { name: "Submit" })
        .click({ delay: 500 });
    });

    await test.step("SA: Add new Item (Eggs - Large brown) to Kroger store", async () => {
      await secondAccount
        .getByLabel("Open grocery store menu")
        .click({ delay: 500 });
      await secondAccount
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await secondAccount.getByLabel("Name").fill("Eggs");
      await secondAccount.getByLabel("Notes").fill("Large brown");
      await secondAccount.getByLabel("Quantity").fill("1");
      await secondAccount
        .getByRole("button", { name: "Submit" })
        .click({ delay: 500 });
    });

    await test.step("FA: Create Group (Z fighters)", async () => {
      await firstAccount.getByLabel("Profile Menu").click();
      await firstAccount.getByRole("menuitem", { name: "Settings" }).click();
      await expect(firstAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await firstAccount.getByRole("tab", { name: "Group" }).click();
      await firstAccount.getByLabel("Create new group").click();
      await firstAccount.getByLabel("Group Name").fill("Z Fighters");
      await firstAccount.getByRole("button", { name: "Submit" }).click();
      await expect(firstAccount.getByText("Z Fighters")).toBeVisible({
        timeout: 2000,
      });
    });

    await test.step("SA: Join Group (Z fighters)", async () => {
      await secondAccount.getByLabel("Profile Menu").click();
      await secondAccount.getByRole("menuitem", { name: "Settings" }).click();
      await expect(secondAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await secondAccount.getByRole("tab", { name: "Group" }).click();
      await secondAccount.getByLabel("Join a group").click();
      await secondAccount
        .getByLabel("Share Code", { exact: true })
        .click({ delay: 500 });

      await secondAccount
        .getByLabel("Share Code", { exact: true })
        .fill(code as string);
      await secondAccount.getByRole("button", { name: "Submit" }).click();

      await expect(secondAccount.getByText("Z Fighters")).toBeVisible({
        timeout: 20000,
      });
    });

    await test.step("FA: Go to the home page", async () => {
      await firstAccount.getByLabel("To Home").click();
    });

    await test.step("SA: Go to the home page", async () => {
      await secondAccount.getByLabel("To Home").click();
    });

    await test.step("FA: Verify no stores place holder message", async () => {
      await expect(firstAccount).toHaveURL("/dashboard", {
        timeout: 20000,
      });
      await expect(
        firstAccount.getByText("No stores available...")
      ).toBeVisible();
    });

    await test.step("SA: Verify no stores place holder message", async () => {
      await expect(secondAccount).toHaveURL("/dashboard", {
        timeout: 20000,
      });
      await expect(
        secondAccount.getByText("No stores available...")
      ).toBeVisible();
    });

    await test.step("SA:Switch view to all items", async () => {
      await secondAccount
        .getByLabel("Open dashboard menu")
        .first()
        .click({ delay: 500 });
      await secondAccount
        .getByRole("menuitem", { name: "View all" })
        .first()
        .click();
    });

    await test.step("SA: Verify no items message", async () => {
      await expect(
        secondAccount.getByText("No items available...")
      ).toBeVisible();
    });

    await test.step("FA: Add new Store Whole Foods", async () => {
      await firstAccount
        .getByLabel("Open dashboard menu")
        .first()
        .click({ delay: 500 });
      await firstAccount
        .getByRole("menuitem", { name: "Add new store" })
        .click();
      await firstAccount.getByLabel("Name").fill("Whole Foods");
      await firstAccount.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("FA: Go in to Whole Foods store", async () => {
      await expect(
        firstAccount.getByRole("button", { name: "Whole Foods" })
      ).toBeVisible();
      await firstAccount
        .getByRole("button", { name: "Whole Foods" })
        .click({ delay: 500 });
      await expect(firstAccount).toHaveURL(
        new RegExp("/dashboard/grocerystores/*"),
        {
          timeout: 1200000,
        }
      );
    });

    await test.step("FA: Add (Sour Cream - Light) to Whole Foods store", async () => {
      await firstAccount
        .getByLabel("Open grocery store menu")
        .click({ delay: 500 });
      await firstAccount
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await firstAccount.getByLabel("Name").fill("Sour Cream");
      await firstAccount.getByLabel("Notes").fill("Light");
      await firstAccount.getByLabel("Quantity").fill("1");
      await firstAccount
        .getByRole("button", { name: "Submit" })
        .click({ delay: 500 });
    });

    await test.step("SA:Verify Sour Cream Light was added when in all items view", async () => {
      await expect(
        secondAccount.getByRole("button", { name: "Sour Cream Light" })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("SA:Add (Tortilla chips - Blue Corn) item w/out a store in all items view", async () => {
      await secondAccount
        .getByLabel("Open dashboard menu")
        .first()
        .click({ delay: 500 });
      await secondAccount
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await firstAccount.getByLabel("Name").fill("Tortilla chips");
      await firstAccount.getByLabel("Notes").fill("Blue Corn");
      await firstAccount.getByLabel("Quantity").fill("1");
      await firstAccount
        .getByRole("button", { name: "Submit" })
        .click({ delay: 500 });
    });

    await test.step("SA:Add (Salsa - Tostitos) item to Whole Foods store", async () => {
      await secondAccount
        .getByLabel("Open dashboard menu")
        .first()
        .click({ delay: 500 });
      await secondAccount
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await firstAccount.getByLabel("Name").fill("Salsa");
      await firstAccount.getByLabel("Notes").fill("Tostitos");
      await firstAccount.getByLabel("Quantity").fill("1");
      // TODO: use dropdown to select "Whole foods"
      await firstAccount
        .getByRole("button", { name: "Submit" })
        .click({ delay: 500 });
    });

    await test.step("FA: Add (Salsa - Tostitos) to common item catalog via flag ", async () => {
      // TODO:
      await firstAccount
        .getByRole("button", { name: "Salsa Tostitos" })
        .click();
      await firstAccount
        .getByRole("checkbox", { name: "Add to Common Items Catalog" })
        .check();
      await firstAccount.keyboard.press("Escape");
    });

    await test.step("SA:Verify (Salsa - Tostitos) was added to common item catalog", async () => {
      // TODO:
      await secondAccount.getByLabel("Profile Menu").click({ delay: 2000 });
      await secondAccount.getByRole("menuitem", { name: "Settings" }).click();
      await expect(secondAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await secondAccount.getByRole("tab", { name: "Common Items" }).click();
      await expect(
        secondAccount.getByRole("button", {
          name: "Image of Salsa Salsa Tostitos",
        })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("FA: Leave Group", async () => {
      await firstAccount.getByLabel("Profile Menu").click();
      await firstAccount.getByRole("menuitem", { name: "Settings" }).click();
      await firstAccount.getByRole("tab", { name: "Group" }).click();
      await firstAccount.getByRole("button", { name: "Leave Group" }).click();
    });

    await test.step("SA: Leave group ", async () => {
      await secondAccount.getByLabel("Profile Menu").click();
      await secondAccount.getByRole("menuitem", { name: "Settings" }).click();
      await secondAccount.getByRole("tab", { name: "Group" }).click();
      await secondAccount.getByRole("button", { name: "Leave Group" }).click();
    });

    await test.step("FA: Verify Common Item Butter Kerrygold Unsalted ", async () => {
      await firstAccount.getByRole("tab", { name: "Common Items" }).click();
      await expect(
        firstAccount.getByRole("button", {
          name: "Image of Butter Butter Kerrygold Unsalted",
        })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("SA: Verify Butter Kerrygold Salted Common Item ", async () => {
      await secondAccount.getByRole("tab", { name: "Common Items" }).click();
      await expect(
        secondAccount.getByRole("button", {
          name: "Image of Butter Butter Kerrygold Salted",
        })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("FA: Delete Butter Kerrygold Unsalted Common Item ", async () => {
      await firstAccount
        .getByRole("button", {
          name: "Image of Butter Butter Kerrygold Unsalted",
        })
        .click();
      await firstAccount.getByLabel("Delete Common Item").click();
    });

    await test.step("SA: Delete Common Item ", async () => {
      await secondAccount
        .getByRole("button", {
          name: "Image of Butter Butter Kerrygold Salted",
        })
        .click();
      await secondAccount.getByLabel("Delete Common Item").click();
    });

    await test.step("FA: Go to home page ", async () => {
      await firstAccount.getByLabel("To Home").click();
    });

    await test.step("SA: Go to home page ", async () => {
      await secondAccount.getByLabel("To Home").click();
    });

    await test.step("FA: Verify Aldi store is still there ", async () => {
      await expect(
        firstAccount.getByRole("button", { name: "Aldi" })
      ).toBeVisible();
    });

    await test.step("SA: Verify Kroger store is still there", async () => {
      await expect(
        secondAccount.getByRole("button", { name: "Kroger" })
      ).toBeVisible();
    });

    await test.step("FA: Go in to Store ", async () => {
      await firstAccount
        .getByRole("button", { name: "Aldi" })
        .click({ delay: 500 });
      await expect(firstAccount).toHaveURL(
        new RegExp("/dashboard/grocerystores/*"),
        {
          timeout: 1200000,
        }
      );
    });

    await test.step("SA: Go in to Store ", async () => {
      await secondAccount
        .getByRole("button", { name: "Kroger" })
        .click({ delay: 500 });
      await expect(secondAccount).toHaveURL(
        new RegExp("/dashboard/grocerystores/*"),
        {
          timeout: 1200000,
        }
      );
    });

    await test.step("FA: Delete store", async () => {
      await firstAccount.getByLabel("Open grocery store menu").click();
      await firstAccount
        .getByRole("menuitem", { name: "Delete Store" })
        .click();
      await expect(firstAccount).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    await test.step("SA: Delete store", async () => {
      await secondAccount.getByLabel("Open grocery store menu").click();
      await secondAccount
        .getByRole("menuitem", { name: "Delete Store" })
        .click();
      await expect(secondAccount).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    await test.step("FA: Sign out ", async () => {
      await firstAccount.getByLabel("Profile Menu").click();
      await firstAccount.getByRole("menuitem", { name: "Sign Out" }).click();
      await expect(firstAccount).toHaveURL("/login", {
        timeout: 120000,
      });
      await firstAccount.close();
    });

    await test.step("SA: Sign out ", async () => {
      await secondAccount.getByLabel("Profile Menu").click();
      await secondAccount.getByRole("menuitem", { name: "Sign Out" }).click();
      await expect(secondAccount).toHaveURL("/login", {
        timeout: 120000,
      });
      await secondAccount.close();
    });

    // ==== old
    await test.step("FA: Sign In", async () => {
      await firstAccount.goto("/");
      await expect(firstAccount).toHaveURL("/login", {
        timeout: 120000,
      });
      await firstAccount
        .getByPlaceholder("Your email address")
        .click({ delay: 500 });
      await firstAccount
        .getByPlaceholder("Your email address")
        .fill(process.env.PLAYWRIGHT_USERNAME as string, { timeout: 5000 });
      await firstAccount
        .getByPlaceholder("Your password")
        .click({ delay: 500 });
      await firstAccount
        .getByPlaceholder("Your password")
        .fill(process.env.PLAYWRIGHT_PASSWORD as string, { timeout: 5000 });
      await firstAccount
        .getByRole("button", { name: "Sign in", exact: true })
        .click({ delay: 500 });
      await expect(firstAccount).toHaveURL("/dashboard", {
        timeout: 20000,
      });
    });

    await test.step("FA: Create a Group", async () => {
      await firstAccount.getByLabel("Profile Menu").click();
      await firstAccount.getByRole("menuitem", { name: "Settings" }).click();
      await expect(firstAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await firstAccount.getByRole("tab", { name: "Group" }).click();
      await firstAccount.getByLabel("Create new group").click();
      await firstAccount.getByLabel("Group Name").fill("Z Fighters");
      await firstAccount.getByRole("button", { name: "Submit" }).click();
      await expect(firstAccount.getByText("Z Fighters")).toBeVisible({
        timeout: 2000,
      });
    });

    await test.step("FA: Generate Share Code", async () => {
      await firstAccount.getByRole("button", { name: "Share Code" }).click();
      await firstAccount.getByLabel("Share Code").click();
      code = await firstAccount.getByLabel("Share Code").innerText();
    });

    await test.step("FA: Add a new common item (Butter - Kerry Gold)", async () => {
      await expect(firstAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await firstAccount.getByRole("tab", { name: "Common Items" }).click();
      await firstAccount.getByLabel("Add New Common item").click();
      await firstAccount.getByLabel("Name").fill("Butter");
      await firstAccount.getByLabel("Notes").fill("Kerry Gold");
      await firstAccount.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("FA: Go to the Home Page", async () => {
      await firstAccount.getByLabel("To Home").click();
      await expect(firstAccount).toHaveURL("/dashboard", {
        timeout: 120000,
      });
      await expect(
        firstAccount.getByText("No stores available...")
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("FA: Add Aldi Store", async () => {
      await firstAccount
        .getByLabel("Dashboard Menu")
        .first()
        .click({ delay: 500 });
      await firstAccount
        .getByRole("menuitem", { name: "Add new store" })
        .click();
      await firstAccount.getByLabel("Name").fill("Aldi");
      await firstAccount.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("FA: Go in to Aldi Store", async () => {
      await expect(
        firstAccount.getByRole("button", { name: "Aldi" })
      ).toBeVisible({ timeout: 2000 });
      await firstAccount
        .getByRole("button", { name: "Aldi" })
        .click({ delay: 500 });
      await expect(firstAccount).toHaveURL(
        new RegExp("/dashboard/grocerystores/*"),
        {
          timeout: 1200000,
        }
      );
    });

    await test.step("FA: Add 1x Fiji Water to Aldi Store", async () => {
      await firstAccount
        .getByLabel("Open grocery store menu")
        .click({ delay: 500 });
      await firstAccount
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await firstAccount.getByLabel("Name").fill("Water");
      await firstAccount.getByLabel("Notes").fill("Fiji");
      await firstAccount.getByLabel("Quantity").fill("1");
      await firstAccount
        .getByRole("button", { name: "Submit" })
        .click({ delay: 500 });
    });

    await test.step("FA: Add 1x Ginger Ale to Aldi store", async () => {
      await firstAccount
        .getByLabel("Open grocery store menu")
        .click({ delay: 500 });
      await firstAccount
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await firstAccount.getByLabel("Name").fill("Ginger Ale");
      await firstAccount.getByLabel("Notes").fill("Diet");
      await firstAccount.getByLabel("Quantity").fill("1");
      await firstAccount
        .getByRole("button", { name: "Submit" })
        .click({ delay: 500 });
    });

    //At this point the FA has 1x fiji water and 1x ginger ale and a common item kerry gold butter
    await test.step("SA: Sign in", async () => {
      await secondAccount.goto("/");
      await expect(secondAccount).toHaveURL("/login", {
        timeout: 120000,
      });
      await secondAccount
        .getByPlaceholder("Your email address")
        .click({ delay: 500 });
      await secondAccount
        .getByPlaceholder("Your email address")
        .fill(process.env.PLAYWRIGHTALT_USERNAME as string, { timeout: 5000 });
      await secondAccount
        .getByPlaceholder("Your password")
        .click({ delay: 500 });
      await secondAccount
        .getByPlaceholder("Your password")
        .fill(process.env.PLAYWRIGHTALT_PASSWORD as string, { timeout: 5000 });
      await secondAccount
        .getByRole("button", { name: "Sign in", exact: true })
        .click({ delay: 500 });
      await expect(secondAccount).toHaveURL("/dashboard", {
        timeout: 20000,
      });
    });

    await test.step("SA: Join Group", async () => {
      await secondAccount.getByLabel("Profile Menu").click();
      await secondAccount.getByRole("menuitem", { name: "Settings" }).click();
      await expect(secondAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await secondAccount.getByRole("tab", { name: "Group" }).click();
      await secondAccount.getByLabel("Join a group").click();
      await secondAccount
        .getByLabel("Share Code", { exact: true })
        .click({ delay: 500 });

      await secondAccount
        .getByLabel("Share Code", { exact: true })
        .fill(code as string);
      await secondAccount.getByRole("button", { name: "Submit" }).click();

      await expect(secondAccount.getByText("Z Fighters")).toBeVisible({
        timeout: 20000,
      });
    });

    await test.step("SA: verify Kerry Gold butter is in common item catalog", async () => {
      await expect(secondAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await secondAccount.getByRole("tab", { name: "Common Items" }).click();
      await expect(
        secondAccount.getByRole("button", {
          name: "Image of Butter Butter Kerry Gold",
        })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("SA: Go to the Home Page ", async () => {
      // Make manual edits here!!
      await secondAccount.pause();

      await secondAccount.getByLabel("To Home").click();
      await expect(secondAccount).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    await test.step("SA: Verify Aldi Store", async () => {
      await expect(
        secondAccount.getByRole("button", { name: "Aldi" })
      ).toBeVisible({ timeout: 7500 });
    });

    await test.step("SA: Change to all items view", async () => {
      await secondAccount
        .getByLabel("Dashboard Menu")
        .first()
        .click({ delay: 500 });
      await secondAccount
        .getByRole("menuitem", { name: "View all" })
        .first()
        .click();
    });

    await test.step("SA: Verify Ginger ale and Fiji Water", async () => {
      await expect(
        secondAccount.getByRole("button", { name: "Ginger Ale Diet" })
      ).toBeVisible({ timeout: 2000 });
      await expect(
        secondAccount.getByRole("button", { name: "Water Fiji" })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("SA: Add Budlight Item to Aldi store via View All Item view", async () => {
      await secondAccount
        .getByLabel("Dashboard Menu")
        .first()
        .click({ delay: 500 });
      await secondAccount
        .getByRole("menuitem", { name: "Add new item" })
        .click();
      await secondAccount.getByLabel("Name").fill("Budlight");
      await secondAccount.getByLabel("Notes").fill("12oz cans");
      // TODO - Select the drop down and do aldi
      await secondAccount.pause();
      await secondAccount.getByLabel("Quantity").fill("1");
      await secondAccount
        .getByRole("button", { name: "Submit" })
        .click({ delay: 500 });
    });

    await test.step("SA: Add Item 2x (Kerry Gold butter) to dashboard via Catalog", async () => {
      await secondAccount
        .getByLabel("Dashboard Menu")
        .first()
        .click({ delay: 500 });
      await secondAccount
        .getByRole("menuitem", { name: "Add common item" })
        .click();
      await secondAccount
        .getByRole("button", { name: "Butter Kerry Gold" })
        .click();
      await secondAccount.getByLabel("Increment Butter").click();
      await secondAccount.getByRole("button", { name: "Add" }).click();
    });

    await test.step("FA: Verify Budlight in aldi store", async () => {
      // TODO
      await expect(
        firstAccount.getByRole("button", { name: "Budlight 12oz cans" })
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("FA: Go to the Home Page", async () => {
      await firstAccount.getByLabel("To Home").click();
      await expect(firstAccount).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    await test.step("FA:Change to all item view", async () => {
      await firstAccount
        .getByLabel("Dashboard Menu")
        .first()
        .click({ delay: 500 });
      await firstAccount
        .getByRole("menuitem", { name: "View all" })
        .first()
        .click();
    });

    await test.step("FA:Verify the 4 Items", async () => {
      await firstAccount.getByRole("button", { name: "Water Fiji" }).click();
      await expect(
        firstAccount.getByRole("button", { name: "Water Fiji" })
      ).toBeVisible({ timeout: 2000 });
      await expect(
        firstAccount.getByRole("button", { name: "Ginger Ale Diet" })
      ).toBeVisible({ timeout: 2000 });
      await expect(
        firstAccount.getByRole("button", { name: "Butter Kerry Gold" })
      ).toBeVisible({ timeout: 2000 });
      await expect(
        firstAccount.getByRole("button", { name: "Budlight 12oz cans" })
      ).toBeVisible({ timeout: 2000 });
    });

    // SA Change to Stores view
    await test.step("SA: Change to stores view", async () => {
      await secondAccount
        .getByLabel("Dashboard Menu")
        .first()
        .click({ delay: 500 });
      await secondAccount
        .getByLabel("View by store")
        .first()
        .click({ delay: 500 });
    });
    // SA Open  Aldi
    await test.step("Delete Aldi", async () => {
      await secondAccount.getByRole("button", { name: "Aldi" }).click();
      await expect(secondAccount).toHaveURL(
        new RegExp("/dashboard/grocerystores/*"),
        {
          timeout: 1200000,
        }
      );
    });
    // SA Delete store
    await test.step("Delete Aldi", async () => {
      await secondAccount.getByLabel("Open grocery store menu").click();
      await secondAccount
        .getByRole("menuitem", { name: "Delete Store" })
        .click();
      await expect(secondAccount).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    // FA Delete remaing item which is the Butter
    await test.step("Delete Kerry butter", async () => {
      // TODO: finish
      await firstAccount.pause();
      await firstAccount.getByLabel("Complete Butter").click();
    });

    // FA: Leave Group
    await test.step("FA: Leave Group", async () => {
      await firstAccount.getByLabel("Profile Menu").click();
      await firstAccount.getByRole("menuitem", { name: "Settings" }).click();
      await firstAccount.getByRole("tab", { name: "Group" }).click();
      await firstAccount.getByRole("button", { name: "Leave Group" }).click();
    });
    // FA:Sign out
    await test.step("FA: Sign Out", async () => {});

    await test.step("SA: Change to all items view", async () => {
      await secondAccount
        .getByLabel("Dashboard Menu")
        .first()
        .click({ delay: 500 });
      await secondAccount
        .getByRole("menuitem", { name: "View all" })
        .first()
        .click();
    });

    await test.step("SA: Verify no items are left", async () => {
      // TODO:
      await expect(
        secondAccount.getByText("No items available...")
      ).toBeVisible({ timeout: 2000 });
    });

    await test.step("SA: Delete Common Item", async () => {
      await secondAccount.getByLabel("Profile Menu").click();
      await secondAccount.getByRole("menuitem", { name: "Settings" }).click();
      await expect(secondAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await secondAccount.getByRole("tab", { name: "Common Items" }).click();

      await secondAccount
        .getByRole("button", { name: "Image of Butter Butter Kerry Gold" })
        .click();
      await secondAccount.getByLabel("Delete Common Item").click();
    });

    await test.step("SA: Leave Group", async () => {
      await secondAccount.getByRole("tab", { name: "Group" }).click();
      await secondAccount.getByRole("button", { name: "Leave Group" }).click();
    });

    await test.step("SA: Sign Out", async () => {});

    //  ======== end
  });
});

// test.describe("Multi User Scenarios", () => {
//   test("Group  Work Flow", async ({ browser }) => {
//     const firstContext = await browser.newContext();
//     const firstAccount = await firstContext.newPage();

//     const secondContext = await browser.newContext();
//     const secondAccount = await secondContext.newPage();

//     let code: string | null = null;

//     // Sign in both accounts
//     // Make a common item
//     // make both have a store
//     // join a group
//     // Make a change and verify with the other account
//     // leave group and verify original items!

//     await test.step("FA: Create a Group", async () => {
//       await firstAccount.getByLabel("Profile Menu").click();
//       await firstAccount.getByRole("menuitem", { name: "Settings" }).click();
//       await expect(firstAccount).toHaveURL("/settings", {
//         timeout: 120000,
//       });
//       await firstAccount.getByRole("tab", { name: "Group" }).click();
//       await firstAccount.getByLabel("Create new group").click();
//       await firstAccount.getByLabel("Group Name").fill("Z Fighters");
//       await firstAccount.getByRole("button", { name: "Submit" }).click();
//       await expect(firstAccount.getByText("Z Fighters")).toBeVisible();
//     });

//     await test.step("FA: Generate Share Code", async () => {
//       await firstAccount.getByRole("button", { name: "Share Code" }).click();
//       await firstAccount.getByLabel("Share Code").click();
//       code = await firstAccount.getByLabel("Share Code").innerText();
//     });

//     await test.step("FA: Go to the Home Page", async () => {
//       await firstAccount.getByLabel("To Home").click();
//       await expect(firstAccount).toHaveURL("/dashboard", {
//         timeout: 120000,
//       });
//       await expect(firstAccount.getByText("No Stores added....")).toBeVisible();
//     });

//     await test.step("FA: Add Aldi Store", async () => {
//       await firstAccount.getByLabel("Add New Store").click({ delay: 500 });
//       await firstAccount.getByLabel("Name").fill("Aldi");
//       await firstAccount.getByRole("button", { name: "Submit" }).click();
//     });

//     await test.step("FA: Go in the Aldi Store", async () => {
//       await expect(
//         firstAccount.getByRole("button", { name: "Aldi" })
//       ).toBeVisible();
//       await firstAccount
//         .getByRole("button", { name: "Aldi" })
//         .click({ delay: 500 });

//       await expect(firstAccount).toHaveURL(
//         new RegExp("/dashboard/grocerystores/*"),
//         {
//           timeout: 1200000,
//         }
//       );
//     });

//     await test.step("FA: Add Item (Water - Fiji)", async () => {
//       await firstAccount
//         .getByLabel("Open grocery store menu")
//         .click({ delay: 500 });
//       await firstAccount
//         .getByRole("menuitem", { name: "Add Item" })
//         .click({ delay: 500 });
//       await firstAccount.getByLabel("Name").fill("Water");
//       await firstAccount.getByLabel("Notes").fill("Fiji");
//       await firstAccount.getByLabel("Quantity").fill("1");
//       await firstAccount
//         .getByRole("button", { name: "Submit" })
//         .click({ delay: 500 });
//     });

//     await test.step("SA: Join Group", async () => {
//       await secondAccount.getByLabel("Profile Menu").click();
//       await secondAccount.getByRole("menuitem", { name: "Settings" }).click();
//       await expect(secondAccount).toHaveURL("/settings", {
//         timeout: 120000,
//       });
//       await secondAccount.getByRole("tab", { name: "Group" }).click();
//       await secondAccount.getByLabel("Join a group").click();
//       await secondAccount
//         .getByLabel("Share Code", { exact: true })
//         .click({ delay: 500 });

//       await secondAccount
//         .getByLabel("Share Code", { exact: true })
//         .fill(code as string);
//       await secondAccount.getByRole("button", { name: "Submit" }).click();

//       await expect(secondAccount.getByText("Z Fighters")).toBeVisible({
//         timeout: 20000,
//       });
//     });

//     await test.step("SA: Verify Common Item  (Butter - Kerry Gold ) was added in settings", async () => {
//       await expect(secondAccount).toHaveURL("/settings", {
//         timeout: 120000,
//       });
//       await secondAccount.getByRole("tab", { name: "Common Items" }).click();
//       await expect(
//         secondAccount.getByRole("button", {
//           name: "Image of Butter Butter Kerry Gold",
//         })
//       ).toBeVisible();
//     });

//     await test.step("SA: Go to the Home Page and Verify Aldi Store", async () => {
//       await secondAccount.getByLabel("To Home").click();
//       await expect(secondAccount).toHaveURL("/dashboard", {
//         timeout: 120000,
//       });
//       await expect(
//         secondAccount.getByRole("button", { name: "Aldi" })
//       ).toBeVisible();
//     });

//     await test.step("SA: Add Item 2x (Kerry Gold butter) to Aldi Store via Catalog", async () => {
//       await secondAccount
//         .getByRole("button", { name: "Aldi" })
//         .click({ delay: 500 });

//       await expect(secondAccount).toHaveURL(
//         new RegExp("/dashboard/grocerystores/*"),
//         {
//           timeout: 1200000,
//         }
//       );

//       await secondAccount
//         .getByLabel("Open grocery store menu")
//         .click({ delay: 500 });

//       await secondAccount
//         .getByRole("menuitem", { name: "Add Common Items" })
//         .click();
//       await secondAccount
//         .getByRole("button", { name: "Butter Kerry Gold" })
//         .click();
//       await secondAccount.getByLabel("Increment Butter").click();
//       await secondAccount.getByRole("button", { name: "Add" }).click();
//     });

//     await test.step("FA: Verify Item 2x (Kerry Gold butter) in Aldi Store", async () => {
//       await expect(
//         firstAccount.getByRole("button", { name: "2 Butter" })
//       ).toBeVisible();
//     });

//     await test.step("FA: Delete Store", async () => {
//       await firstAccount.getByLabel("Open grocery store menu").click();
//       await firstAccount
//         .getByRole("menuitem", { name: "Delete Store" })
//         .click();
//       await expect(firstAccount).toHaveURL("/dashboard", {
//         timeout: 120000,
//       });
//     });

//     await test.step("FA: Leave Group", async () => {
//       await firstAccount.getByLabel("Profile Menu").click();
//       await firstAccount.getByRole("menuitem", { name: "Settings" }).click();
//       await firstAccount.getByRole("tab", { name: "Group" }).click();
//       await firstAccount.getByRole("button", { name: "Leave Group" }).click();
//     });

//     await test.step("SA: Delete Common Item", async () => {
//       await secondAccount.getByLabel("Profile Menu").click();
//       await secondAccount.getByRole("menuitem", { name: "Settings" }).click();
//       await expect(secondAccount).toHaveURL("/settings", {
//         timeout: 120000,
//       });
//       await secondAccount.getByRole("tab", { name: "Common Items" }).click();

//       await secondAccount
//         .getByRole("button", { name: "Image of Butter Butter Kerry Gold" })
//         .click();
//       await secondAccount.getByLabel("Delete Common Item").click();
//     });
//     await test.step("SA: Leave Group", async () => {
//       await secondAccount.getByRole("tab", { name: "Group" }).click();
//       await secondAccount.getByRole("button", { name: "Leave Group" }).click();
//     });

//     await test.step("SA: Sign Out", async () => {
//       await secondAccount.getByLabel("Profile Menu").click();
//       await secondAccount.getByRole("menuitem", { name: "Sign Out" }).click();
//       await expect(secondAccount).toHaveURL("/login", {
//         timeout: 120000,
//       });
//       await secondAccount.close();
//     });
//   });
// });
