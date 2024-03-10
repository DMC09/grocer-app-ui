import { PagesRounded } from "@mui/icons-material";
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

    await test.step("Go to Category Settings", async () => {
      await page.getByLabel("Profile Menu").click();
      await page.getByRole("menuitem", { name: "Settings" }).click();
      await page.getByRole("tab", { name: "Categories" }).click();
      await expect(page.getByText("No categories available...")).toBeVisible();
      await expect(page).toHaveURL("/settings", {
        timeout: 120000,
      });
    });

    await test.step("Create Meet Category", async () => {
      await page.getByLabel("Add New Category").click();
      await page.getByLabel("Category name").click();
      await page.getByLabel("Category name").fill("Meet");
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(
        page.getByRole("button", { name: "Edit Meet category" })
      ).toBeVisible();
    });
    await test.step("Create Dairy Category", async () => {
      await page.getByLabel("Add New Category").click();
      await page.getByLabel("Category name").click();
      await page.getByLabel("Category name").fill("Dairy");
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(
        page.getByRole("button", { name: "Edit Dairy category" })
      ).toBeVisible();
    });
    await test.step("Create Fruit Category", async () => {
      await page.getByLabel("Add New Category").click();
      await page.getByLabel("Category name").click();
      await page.getByLabel("Category name").fill("Fruit");
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(page.getByText("Fruit")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Edit Fruit category" })
      ).toBeVisible();
    });

    await test.step("Go to common items settings ", async () => {
      await page
        .getByRole("tab", { name: "Common Items" })
        .click({ delay: 2000 });
    });

    await test.step("Create Eggs Large Brown Common Item w/no category selected", async () => {
      await page.getByLabel("Add New Common item").click({ delay: 2000 });
      await page.getByLabel("Name").fill("Eggs");
      await page.getByLabel("Notes").first().fill("Large Brown");
      await page.getByRole("button", { name: "Submit" }).click();
    });
    await test.step("Create Banana Common Item w/ Fruit category", async () => {
      await page.getByLabel("Add New Common item").click({ delay: 2000 });
      await page.getByLabel("Name").fill("Banana");
      await page.getByLabel("Notes").fill("Organic");
      await page.getByRole("combobox", { name: "--" }).click();
      await page.getByRole("option", { name: "Fruit" }).click();
      await page.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("Create Chicken Thighs Skinless Common Item w/ Meet Category", async () => {
      await page.getByLabel("Add New Common item").click();
      await page.getByLabel("Name").fill("Chicken Thighs");
      await page.getByLabel("Notes").fill("Skinless");
      await page.getByRole("combobox", { name: "--" }).click();
      await page.getByRole("option", { name: "Meet" }).click();
      await page.getByRole("button", { name: "Submit" }).click();
    });

    await test.step("Go to Categories Settings ", async () => {
      await page.getByRole("tab", { name: "Categories" }).click();
    });
    await test.step("Edit Meet Category to Meat", async () => {
      await page.getByRole("button", { name: "Edit Meet category" }).click();
      await page.getByLabel("Name").fill("Meat");
      await page.getByRole("button", { name: "Submit" }).click();
    });
    await test.step("Go to home page", async () => {
      await page.getByLabel("To Home").click();
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
    await test.step("Update item notes to be sharp cheddar and quantity to 2 and add to dairy category", async () => {
      await page.getByRole("button", { name: "Cheese Mild Cheddar" }).click();
      await page.getByLabel("Edit Item").click();
      await page.getByLabel("Notes").fill("Sharp Cheddar");
      await page.getByRole("combobox").click();
      await page.getByRole("option", { name: "Dairy" }).click();
      await page.getByLabel("Quantity").fill("02");
      await page.getByRole("button", { name: "Submit" }).click();
      await page.getByRole("heading", { name: "Sharp Cheddar" }).click();
      await page.keyboard.press("Escape");
    });
    await test.step("Add Eggs and Chicken Thighs to Wally World ", async () => {
      await page.getByLabel("Open grocery store menu").click();
      await page.getByRole("menuitem", { name: "Add Common Item" }).click();
      await page.getByRole("button", { name: "Eggs Large Brown" }).click();
      await page
        .getByRole("button", { name: "Chicken Thighs Skinless" })
        .click();
      await page.getByLabel("Increment Eggs").click();
      await page.getByRole("button", { name: "Add" }).click();
    });
    await test.step("Verify Cheese, Eggs and Thighs items ", async () => {
      await expect(
        page.getByRole("button", { name: "Cheese Sharp Cheddar" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Eggs Large Brown" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Chicken Thighs Skinless" })
      ).toBeVisible();
    });
    await test.step("Verify Dairy filter works", async () => {
      await page.getByRole("button", { name: "Dairy" }).click();
      await expect(
        page.getByRole("button", { name: "Cheese Sharp Cheddar" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Eggs Large Brown" })
      ).toBeHidden();
      await expect(
        page.getByRole("button", { name: "Chicken Thighs Skinless" })
      ).toBeHidden();
    });
    await test.step("Add Cheese to the common item catalog ", async () => {
      await page.getByRole("button", { name: "Cheese Sharp Cheddar" }).click();
      await page
        .getByRole("checkbox", { name: "Add to Common Items Catalog" })
        .check();
      await page.keyboard.press("Escape");
    });
    await test.step("Verify Cheese was added to common item catalog and delete", async () => {
      await page.getByLabel("Profile Menu").click();
      await page.getByRole("menuitem", { name: "Settings" }).click();
      await page
        .getByRole("tab", { name: "Common Items" })
        .click({ delay: 2000 });
      await page
        .getByRole("button", { name: "Image of Cheese Cheese Sharp Cheddar" })
        .click();
      await page.getByLabel("Delete Common Item").click();
    });
    await test.step("Go to home page", async () => {
      await page.getByLabel("To Home").click();
    });
    await test.step("Verify 5 items in Wally World", async () => {
      await expect(page.getByText("Wally World5")).toBeVisible();
    });
    await test.step("Change View to all", async () => {
      await page
        .getByLabel("Open dashboard menu")
        .first()
        .click({ delay: 500 });
      await page.getByRole("menuitem", { name: "View all" }).first().click();
    });
    await test.step("Add the common item banana to dashboard ", async () => {
      await page
        .getByLabel("Open dashboard menu")
        .first()
        .click({ delay: 500 });
      await page.getByRole("menuitem", { name: "Add common item" }).click();
      await page.getByRole("button", { name: "Fruit" }).click();
      await page.getByRole("button", { name: "Banana Organic" }).click();
      await page.getByRole("button", { name: "Add" }).click();
    });
    await test.step("Add (Bread - Whole Wheat)", async () => {
      await page.getByLabel("Open dashboard menu").click();
      await page.getByRole("menuitem", { name: "Add Item" }).click();
      await page.getByLabel("Name").fill("Bread");
      await page.getByLabel("Notes").fill("Whole Wheat");
      await page.getByLabel("Quantity").fill("1");
      await page.getByRole("button", { name: "Submit" }).click();
    });
    await test.step("Verify 4 items total", async () => {
      await expect(
        page.getByRole("button", { name: "Cheese Sharp Cheddar" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Eggs Large Brown" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Chicken Thighs Skinless" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Banana Organic" })
      ).toBeVisible();
    });

    await test.step("Complete all items", async () => {
      await page.getByLabel("Complete Bread").click({ delay: 500 }); // maybe just these then change view delete the store
      await page.getByLabel("Complete Banana").click({ delay: 750 }); // maybe just these then change view delete the store
    });
    await test.step("Change View", async () => {
      await page
        .getByLabel("Open dashboard menu")
        .first()
        .click({ delay: 500 });
      await page
        .getByRole("menuitem", { name: "View by store" })
        .first()
        .click();
    });

    await test.step("Go in to Wally World", async () => {
      await page.getByRole("button", { name: "Wally World" }).click();
    });
    await test.step("Delete Store", async () => {
      await expect(page).toHaveURL(new RegExp("/dashboard/grocerystores/*"), {
        timeout: 1200000,
      });
      await page.getByLabel("Open grocery store menu").click();
      await page.getByRole("menuitem", { name: "Delete Store" }).click();
      await expect(page).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });

    await test.step("Verify no stores message", async () => {
      await expect(page.getByText("No stores available...")).toBeVisible();
    });

    await test.step("Go to Common Item Catalog Settings ", async () => {
      await page.getByLabel("Profile Menu").click({ delay: 2000 });
      await page.getByRole("menuitem", { name: "Settings" }).click();
      await expect(page).toHaveURL("/settings", {
        timeout: 120000,
      });
      await page.getByRole("tab", { name: "Common Items" }).click();
    });
    await test.step("Delete All common items", async () => {
      await page
        .getByRole("button", { name: "Image of Eggs Eggs Large Brown" })
        .click();
      await page.getByLabel("Delete Common Item").click();
      await page
        .getByRole("button", { name: "Image of Banana Banana Organic" })
        .click();
      await page.getByLabel("Delete Common Item").click();
      await page
        .getByRole("button", { name: "Image of Chicken Thighs" })
        .click();
      await page.getByLabel("Delete Common Item").click();
    });
    await test.step("go to categories", async () => {
      await page.getByRole("tab", { name: "Categories" }).click();
    });
    await test.step("Delete All categories", async () => {
      await page.getByLabel("Delete Dairy category").click();
      await page.getByLabel("Delete Fruit category").click();
      await page.getByLabel("Delete Meat category").click();
      await expect(page.getByText("No categories available...")).toBeVisible();
    });
    await test.step("Sign out", async () => {
      await page.getByLabel("Profile Menu").click();
      await page.getByRole("menuitem", { name: "Sign Out" }).click();
      await expect(page).toHaveURL("/login", {
        timeout: 120000,
      });
      await page.close();
    });
  });
});
