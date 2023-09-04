import { test, expect } from "@playwright/test";

test.describe("Normal Work Flow ", () => {

  test("Main", async ({ page }) => {
    await test.step("Sign In", async () => {
      await page.goto("/");
      await expect(page).toHaveURL("/login", {
        timeout: 120000,
      });
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
    });

    await test.step("Create Store (Walmart) ", async () => {
      await expect(page.getByText("No Stores added....")).toBeVisible();
      await page.getByLabel("Add New Store").click({ delay: 500 });
      await page.getByLabel("Name").fill("Walmart");
      await page.getByRole("button", { name: "Submit" }).click();
      await expect(page.getByRole("button", { name: "Walmart" })).toBeVisible();
      await page.getByRole("button", { name: "Walmart" }).click({ delay: 500 });
      await expect(page).toHaveURL(new RegExp("/dashboard/grocerystores/*"), {
        timeout: 1200000,
      });
    });

    await test.step("Add Item (Cheese - Mild Cheddar) Quantity:5", async () => {
      await page.getByLabel("Open grocery store menu").click({ delay: 500 });
      await page
        .getByRole("menuitem", { name: "Add Item" })
        .click({ delay: 500 });
      await page.getByLabel("Name").fill("Cheese");
      await page.getByLabel("Notes").fill("Mild Cheddar");
      await page.getByLabel("Quantity").fill("5");
      await page.getByRole("button", { name: "Submit" }).click({ delay: 500 });
    });

    await test.step("Update Walmart -> Wally World", async () => {
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

    await test.step("Update Cheese Item Notes to be Sharp Cheddar", async () => {
      await page.getByRole("button", { name: "5 Cheese" }).click();
      await page.getByRole("heading", { name: "Mild Cheddar" }).click(); //assert this
      await page.getByLabel("Edit Item").click();
      await page.getByLabel("Notes").fill("Sharp Cheddar");
      await page.getByLabel("Quantity").fill("02");
      await page.getByRole("button", { name: "Submit" }).click();
      await page.getByRole("heading", { name: "Sharp Cheddar" }).click(); // Assert this
      await page.getByLabel("Close Item Preview").click();
    });

    await test.step("Complete Item (Cheese)", async () => {
      await page.getByLabel("Complete Cheese").click();
    });
    await test.step("Add (Bread - Whole Wheat) To Common Item Catalog via Flag", async () => {
      await page.getByLabel("Open grocery store menu").click();
      await page.getByRole("menuitem", { name: "Add Item" }).click();
      await page.getByLabel("Name").fill("Bread");
      await page.getByLabel("Notes").fill("Whole Wheat");
      await page.getByLabel("Quantity").fill("1");
      await page.getByRole("button", { name: "Submit" }).click();
      await page.getByRole("button", { name: "1 Bread" }).click();
      await page
        .getByRole("checkbox", { name: "Add to Common Items Catalog" })
        .check();
      await page.getByLabel("Close Item Preview").click();
    });

    await test.step("Create new Common Item (Rice - Jasmine)", async () => {
      await page.getByLabel("Profile Menu").click({ delay: 2000 });
      await page.getByRole("menuitem", { name: "Settings" }).click();
      await expect(page).toHaveURL("/settings", {
        timeout: 120000,
      });
      await page.getByRole("tab", { name: "Common Items" }).click();
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
      await page
        .getByRole("button", { name: "Rice Jasmine" })
        .getByRole("checkbox")
        .check();
      await page
        .getByRole("button", { name: "Milk Soy" })
        .getByRole("checkbox")
        .check();
      await page.getByLabel("Increment Milk").click();
      await page.getByLabel("Increment Milk").click();
      await page.getByRole("button", { name: "Add" }).click();
    });

    await test.step("Updating common item Rice -> (Quinoa-White)  ", async () => {
      await page.getByLabel("Profile Menu").click();
      await page.getByRole("menuitem", { name: "Settings" }).click();
      await page.goto("/settings");
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

    await test.step("Delete all Common Items ", async () => {
      await page.getByLabel("Profile Menu").click();
      await page.getByRole("menuitem", { name: "Settings" }).click();
      await page.goto("/settings");
      await page.getByRole("tab", { name: "Common Items" }).click();
      await page
        .getByRole("button", { name: "Image of Bread Bread Whole Wheat" })
        .click();
      await page.getByLabel("Delete Common Item").click();
      await page
        .getByRole("button", { name: "Image of Milk Milk Soy" })
        .click();
      await page.getByLabel("Delete Common Item").click();
      await page
        .getByRole("button", { name: "Image of Quinoa Quinoa White" })
        .click();
      await page.getByLabel("Delete Common Item").click();
    });

    await test.step("Delete Wally World", async () => {
      await page.getByLabel("To Home").click();
      await page.getByRole("button", { name: "Wally World" }).click();
      await page.getByLabel("Open grocery store menu").click();
      await page.getByRole("menuitem", { name: "Delete Store" }).click();
      await expect(page).toHaveURL("/dashboard", {
        timeout: 120000,
      });
    });
  });
});
