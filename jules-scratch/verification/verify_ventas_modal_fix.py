from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:3000/ventas")
    page.wait_for_selector('button:has-text("Registrar Movimiento de Stock")')
    page.get_by_role("button", name="Registrar Movimiento de Stock").first.click()
    page.wait_for_selector('input[label="Depósito *"]')
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
