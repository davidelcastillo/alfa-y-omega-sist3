//Esta carpeta es para traer las llamadas a apis
//Hoy usa mocks; mañana cambiás por fetch() a tu API sin tocar componentes.
import { purchaseOrdersMock, suppliersMock, productsMock } from "@/mocks/compras.mock"
import type { PurchaseOrder, Supplier, Product } from "@/lib/compras/purchase"
import { sleep } from "@/lib/compras/utils"

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  await sleep(150) // simula fetch
  return purchaseOrdersMock
}

export async function getSuppliers(): Promise<Supplier[]> {
  await sleep(50)
  return suppliersMock
}

export async function getProducts(): Promise<Product[]> {
  await sleep(50)
  return productsMock
}
