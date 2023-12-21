import { test, expect } from "@playwright/test";

test.describe("Single User Scenarios", () => {
  test("Main Workflow", async ({ page }) => {
    await test.step("Go to sign in page", async () => {
      await page.goto("/");
      await expect(page).toHaveURL("/login", {
        timeout: 120000,
      });
    });

    await test.step("Sign in", async () => {
      await page.getByPlaceholder("Your email address").click({ delay: 500 });
      await page
        .getByPlaceholder("Your email address")
        .fill(process.env.PLAYWRIGHT_USERNAME as string, { timeout: 5000 });
      await page.getByPlaceholder("Your password").click({ delay: 500 });
      await page
        .getByPlaceholder("Your password")
        .fill(process.env.PLAYWRIGHT_PASSWORD as string, { timeout: 5000 });
      await page
        .getByRole("button", { name: "Sign in", exact: true })
        .click({ delay: 500 });
      await expect(page).toHaveURL("/dashboard", {
        timeout: 20000,
      });
      await expect(page.getByText("No stores available...")).toBeVisible();
    });

    await test.step("Create a new store - Walmart", async () => {
      await page.getByLabel("Dashboard Menu").click({ delay: 500 });
      await page.getByRole("menuitem", { name: "Add new store" }).click();
      await page.getByLabel("Name").fill("Walmart");
      await page.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("Open walmart store", async () => {
      await expect(page.getByRole("button", { name: "Walmart" })).toBeVisible();
      await page.getByRole("button", { name: "Walmart" }).click({ delay: 500 });
      await expect(page).toHaveURL(new RegExp("/dashboard/grocerystores/*"), {
        timeout: 1200000,
      });
    });

    await test.step("Add item (cheese - mild Cheddar) quantity of 5", async () => {
      await page.getByLabel("Open grocery store menu").click({ delay: 500 });
      await page
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await page.getByLabel("Name").fill("Cheese");
      await page.getByLabel("Notes").fill("Mild Cheddar");
      await page.getByLabel("Quantity").fill("5");
      await page.getByRole("button", { name: "Submit" }).click({ delay: 500 });
    });

    await test.step("Update store name to Wally World", async () => {
      await page.getByLabel("Open grocery store menu").click();
      await page.getByRole("menuitem", { name: "Store Settings" }).click();
      await expect(
        page.getByRole("heading", { name: "Walmart" })
      ).toBeVisible();
      await page.getByLabel("Name").fill("Wally World");
      await page.getByRole("button", { name: "Save" }).click();
      await expect(
        page.getByRole("heading", { name: "Wally World" })
      ).toBeVisible();
    });

    await test.step("Update item notes to be sharp cheddar", async () => {
      await page.getByRole("button", { name: "Cheese Mild Cheddar" }).click();
      await page.getByLabel("Edit Item").click();
      await page.getByLabel("Notes").fill("Sharp Cheddar");
      await page.getByLabel("Quantity").fill("02");
      await page.getByRole("button", { name: "Submit" }).click();
      await page.getByRole("heading", { name: "Sharp Cheddar" }).click();
      await page.keyboard.press("Escape");
    });

    await test.step("Complete item (cheese)", async () => {
      await page.getByLabel("Complete Cheese").click();
    });
    await test.step("Add (Bread - Whole Wheat)", async () => {
      await page.getByLabel("Open grocery store menu").click();
      await page.getByRole("menuitem", { name: "Add Item" }).click();
      await page.getByLabel("Name").fill("Bread");
      await page.getByLabel("Notes").fill("Whole Wheat");
      await page.getByLabel("Quantity").fill("1");
      await page.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("Add (Bread - Whole Wheat) To Common Item Catalog via Flag", async () => {
      await page.getByRole("button", { name: "Bread Whole Wheat" }).click();
      await page
        .getByRole("checkbox", { name: "Add to Common Items Catalog" })
        .check();
      await page.keyboard.press("Escape");
    });

    await test.step("Go to Common Item Catalog Settings ", async () => {
      await page.getByLabel("Profile Menu").click({ delay: 2000 });
      await page.getByRole("menuitem", { name: "Settings" }).click();
      await expect(page).toHaveURL("/settings", {
        timeout: 120000,
      });
      await page.getByRole("tab", { name: "Common Items" }).click();
    });

    await test.step("Create new Common Item (Rice - Jasmine)", async () => {
      await page.getByLabel("Add New Common item").click();
      await page.getByLabel("Name").fill("Rice");
      await page.getByLabel("Notes").fill("Jasmine");
      await page.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("Create new Common Item (Milk - Soy) ", async () => {
      await page.getByLabel("Add New Common item").click();
      await page.getByLabel("Name").fill("Milk");
      await page.getByLabel("Notes").fill("Soy");
      await page.getByRole("button", { name: "Submit" }).click();
    });
    await test.step("Add Milk and Rice to Wally World ", async () => {
      await page.getByLabel("To Home").click();
      await page.getByRole("button", { name: "Wally World" }).click();
      await page.getByLabel("Open grocery store menu").click();
      await page.getByRole("menuitem", { name: "Add Common Items" }).click();
      await page.getByRole('button', { name: 'Rice Jasmine' }).click();
      await page.getByRole('button', { name: 'Milk Soy' }).click();
      await page.getByLabel('Increment Milk').click();    
      await page.getByRole("button", { name: "Add" }).click();
    });

    await test.step("Updating common item Rice -> (Quinoa-White)", async () => {
      await page.getByLabel("Profile Menu").click();
      await page.getByRole("menuitem", { name: "Settings" }).click();
      await expect(page).toHaveURL("/settings", {
        timeout: 120000,
      });
      await page.getByRole("tab", { name: "Common Items" }).click();
      await page
        .getByRole("button", { name: "Image of Rice Rice Jasmine" })
        .click();
      await page.getByLabel("Edit Common Item").click();
      await page.getByLabel("Name").fill("Quinoa");
      await page.getByLabel("Notes").fill("White");
      await page.getByRole("button", { name: "Submit" }).click();
      await page.getByLabel("Close Item Preview").click();
    });

    await test.step("Add (Quinoa - white) to Wally World", async () => {
      await page.getByLabel("To Home").click();
      await page.getByRole("button", { name: "Wally World" }).click();
      await page.getByLabel("Open grocery store menu").click();
      await page.getByRole("menuitem", { name: "Add Common Items" }).click();
      await page.getByRole("button", { name: "Quinoa White" }).click();
      await page.getByLabel("Increment Quinoa").click();
      await page.getByRole("button", { name: "Add" }).click();
    });
    await test.step("Clear Items in the Wally World", async () => {
      await page.getByLabel("Complete Bread").click();
      await page.getByLabel("Complete Rice").click();
      await page.getByLabel("Complete Milk").click();
      await page.getByLabel("Complete Quinoa").click();
    });

    await test.step("Go to Common Item Catalog Settings ", async () => {
      await page.getByLabel("Profile Menu").click({ delay: 2000 });
      await page.getByRole("menuitem", { name: "Settings" }).click();
      await expect(page).toHaveURL("/settings", {
        timeout: 120000,
      });
      await page.getByRole("tab", { name: "Common Items" }).click();
    });

    await test.step("Delete Bread from Common Items", async () => {
      await page
        .getByRole("button", { name: "Image of Bread Bread Whole Wheat" })
        .click();
      await page.getByLabel("Delete Common Item").click();
    });
    await test.step("Delete Milk from Common Items ", async () => {
      await page
        .getByRole("button", { name: "Image of Milk Milk Soy" })
        .click();
      await page.getByLabel("Delete Common Item").click();
    });
    await test.step("Delete Quinoa from Common Items ", async () => {
      await page
        .getByRole("button", { name: "Image of Quinoa Quinoa White" })
        .click();
      await page.getByLabel("Delete Common Item").click();
    });
    await test.step("Go to dashboard ", async () => {
      await page.getByLabel("To Home").click();
      await expect(page).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    await test.step("Delete Wally World", async () => {
      await page.getByRole("button", { name: "Wally World" }).click();
      await expect(page).toHaveURL(new RegExp("/dashboard/grocerystores/*"), {
        timeout: 1200000,
      });
      await page.getByLabel("Open grocery store menu").click();
      await page.getByRole("menuitem", { name: "Delete Store" }).click();
      await expect(page).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    await test.step("Sign Out", async () => {
      await page.getByLabel("Profile Menu").click();
      await page.getByRole("menuitem", { name: "Sign Out" }).click();
      await expect(page).toHaveURL("/login", {
        timeout: 120000,
      });
      await page.close();
    });
  });
});
