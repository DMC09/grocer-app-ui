import { test, expect } from "@playwright/test";

test.describe("Group  Work Flow ", () => {
  test("Main", async ({ browser }) => {
    const firstContext = await browser.newContext();
    const firstAccount = await firstContext.newPage();

    const secondContext = await browser.newContext();
    const secondAccount = await secondContext.newPage();

    let code: string | null = null;

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
      await expect(firstAccount.getByText("Z Fighters")).toBeVisible();
    });

    await test.step("FA: Generate Share Code", async () => {
      await firstAccount.getByRole("button", { name: "Share Code" }).click();
      await firstAccount.getByLabel("Share Code").click();
      code = await firstAccount.getByLabel("Share Code").innerText();
    });

    await test.step("FA: Add a new Common Item (Butter - Kerry Gold)", async () => {
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
      await expect(firstAccount.getByText("No Stores added....")).toBeVisible();
    });

    await test.step("FA: Add Aldi Store", async () => {
      await firstAccount.getByLabel("Add New Store").click({ delay: 500 });
      await firstAccount.getByLabel("Name").fill("Aldi");
      await firstAccount.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("FA: Go in the Aldi Store", async () => {
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

    await test.step("FA: Add Item (Water - Fiji)", async () => {
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

    await test.step("SA: Sign in to the second account", async () => {
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
      await secondAccount.pause();
      await secondAccount
        .getByLabel("Share Code", { exact: true })
        .fill(code as string);
      await secondAccount.getByRole("button", { name: "Submit" }).click();
      await secondAccount.pause();
      await expect(secondAccount.getByText("Z Fighters")).toBeVisible({
        timeout: 20000,
      });
    });

    await test.step("SA: Verify Common Item  (Butter - Kerry Gold ) was added in settings", async () => {
      await expect(secondAccount).toHaveURL("/settings", {
        timeout: 120000,
      });
      await secondAccount.getByRole("tab", { name: "Common Items" }).click();
      await expect(
        secondAccount.getByRole("button", {
          name: "Image of Butter Butter Kerry Gold",
        })
      ).toBeVisible();
    });

    await test.step("SA: Go to the Home Page and Verify Aldi Store", async () => {
      await secondAccount.getByLabel("To Home").click();
      await expect(secondAccount).toHaveURL("/dashboard", {
        timeout: 120000,
      });
      await expect(
        secondAccount.getByRole("button", { name: "Aldi" })
      ).toBeVisible();
    });

    await test.step("SA: Add Item 2x (Kerry Gold butter) to Aldi Store via Catalog", async () => {
      await secondAccount
        .getByRole("button", { name: "Aldi" })
        .click({ delay: 500 });

      await expect(secondAccount).toHaveURL(
        new RegExp("/dashboard/grocerystores/*"),
        {
          timeout: 1200000,
        }
      );

      await secondAccount
        .getByLabel("Open grocery store menu")
        .click({ delay: 500 });

      await secondAccount
        .getByRole("menuitem", { name: "Add Common Items" })
        .click();
      await secondAccount
        .getByRole("button", { name: "Butter Kerry Gold" })
        .click();
      await secondAccount.getByLabel("Increment Butter").click();
      await secondAccount.getByRole("button", { name: "Add" }).click();
    });

    await test.step("FA: Verify Item 2x (Kerry Gold butter) in Aldi Store", async () => {
      await expect(
        firstAccount.getByRole("button", { name: "2 Butter" })
      ).toBeVisible();
    });

    await test.step("FA: Delete Store", async () => {
      await firstAccount.getByLabel("Open grocery store menu").click();
      await firstAccount
        .getByRole("menuitem", { name: "Delete Store" })
        .click();
      await expect(firstAccount).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    await test.step("FA: Leave Group", async () => {
      await firstAccount.getByLabel("Profile Menu").click();
      await firstAccount.getByRole("menuitem", { name: "Settings" }).click();
      await firstAccount.getByRole("tab", { name: "Group" }).click();
      await firstAccount.getByRole("button", { name: "Leave Group" }).click();
    });

    await test.step("FA: Sign out", async () => {
      await firstAccount.getByLabel("Profile Menu").click();
      await firstAccount.getByRole("menuitem", { name: "Sign Out" }).click();
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

    await test.step("SA: Sign out", async () => {
      await secondAccount.getByLabel("Profile Menu").click();
      await secondAccount.getByRole("menuitem", { name: "Sign Out" }).click();
    });
  });
});
