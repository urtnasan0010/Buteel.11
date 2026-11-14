import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("keyboard search, filters, language, detail and feedback work", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Үндсэн агуулга руу алгасах" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page
    .getByLabel("Ямар тусламж хайж байна вэ?")
    .fill("Хөдөлмөр эрхлэлтийг дэмжих төв");
  await page.getByRole("button", { name: "Үйлчилгээ хайх" }).click();
  await expect(
    page.getByRole("heading", { name: "1 байгууллага" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/q=/);
  await page
    .getByRole("link", {
      name: "Employment Support Centre for People with Disabilities",
    })
    .click();
  await expect(page.getByText("Not yet confirmed")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /^Call · 77550099/ }),
  ).toHaveAttribute("href", "tel:+97677550099");
  await expect(
    page.getByRole("link", { name: /^Email —/ }),
  ).toHaveAttribute("href", "mailto:info@jobs-pwd.gov.mn");
  await expect(
    page.getByRole("link", { name: /^Search Google Maps —/ }),
  ).toHaveAttribute(
    "href",
    /^https:\/\/www.google.com\/maps\/search\/\?api=1&query=/,
  );
  await expect(
    page.getByRole("link", { name: "Centre contact page" }),
  ).toHaveAttribute("href", "https://dmart.mn/contact-us/");
  await expect(page.getByText("2026-11-14", { exact: true })).toBeVisible();
  await page
    .getByRole("link", { name: "Report incorrect information" })
    .click();
  await page.getByRole("button", { name: "Prepare copyable report" }).click();
  await expect(page.locator("#feedback-error")).toContainText(
    "Please describe",
  );
  await page
    .getByLabel("Correction or suggestion (required)")
    .fill("Please check the hours.");
  await page.getByRole("button", { name: "Prepare copyable report" }).click();
  await expect(page.getByLabel("Unsubmitted report")).toHaveValue(
    /Not submitted or saved/,
  );
  await page
    .getByRole("link", { name: "Accessibility statement", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Accessibility statement", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByText(/A monitored contact address has not been configured yet/),
  ).toBeVisible();
  await page.getByRole("link", { name: "Монгол", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "mn");
  await expect(
    page.getByRole("heading", { name: "Хүртээмжийн мэдэгдэл", exact: true }),
  ).toBeVisible();
});
test("empty state and printable checklist", async ({ page }) => {
  await page.goto("/services?lang=en&access=sign");
  await expect(
    page.getByRole("heading", { name: "No matching services" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View all services" }).click();
  await expect(
    page.getByRole("heading", { name: "3 organisations" }),
  ).toBeVisible();
  const moreFilters = page.locator(".more-filters");
  await expect(moreFilters).not.toHaveAttribute("open");
  await page.getByText("More filters", { exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(moreFilters).toHaveAttribute("open", "");
  await expect(
    page.getByLabel("Sign-language support", { exact: true }),
  ).not.toBeChecked();
  await page.getByLabel("Cost").selectOption("unknown");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/cost=unknown/);
  await expect(page.locator(".more-filters")).toHaveAttribute("open", "");
  await expect(
    page.getByRole("heading", { name: "3 organisations" }),
  ).toBeVisible();
  await page.goto("/guides?lang=en");
  await page.getByRole("checkbox").first().check();
  await expect(page.getByRole("status")).toHaveText("1 of 5 steps ready");
  await page.evaluate(() => {
    window.print = () => {
      document.body.dataset.printed = "yes";
    };
  });
  await page.getByRole("button", { name: "Print checklist" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-printed", "yes");
});
test("mobile, zoom and automated accessibility", async ({ page }) => {
  for (const route of [
    "/?lang=en",
    "/services",
    "/services/employment-support-centre?lang=en",
    "/services/mongolian-national-federation-of-the-blind",
    "/services/association-of-parents-with-disabled-children?lang=en",
    "/guides",
    "/about?lang=en",
    "/accessibility",
    "/accessibility?lang=en",
  ]) {
    await page.goto(route);
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.setViewportSize({ width: 375, height: 1000 });
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    if (route === "/accessibility?lang=en") {
      await page.screenshot({
        path: "test-results/accessibility-mobile.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.screenshot({
        path: "test-results/accessibility-desktop.png",
        fullPage: true,
      });
    }
    if (route === "/services") {
      await page.screenshot({
        path: "test-results/directory-mobile.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.screenshot({
        path: "test-results/directory-desktop.png",
        fullPage: true,
      });
    }
    if (route.includes("association-of-parents")) {
      await page.screenshot({
        path: "test-results/real-detail-mobile.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.screenshot({
        path: "test-results/real-detail-desktop.png",
        fullPage: true,
      });
    }
  }
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  await page.evaluate(() => (document.documentElement.style.fontSize = ""));
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
});
