from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000/ventas")
    page.screenshot(path="jules-scratch/verification/ventas_before.png")
    page.click('button:has-text("Registrar Envío")')
    page.wait_for_selector('h2:has-text("Registrar Salida de Stock por Venta")')
    page.screenshot(path="jules-scratch/verification/ventas_modal_opened.png")
    page.click('button:has-text("Confirmar Salida")')
    page.wait_for_selector('p:has-text("Envío registrado y pedido actualizado con éxito")')
    page.screenshot(path="jules-scratch/verification/ventas_after.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
