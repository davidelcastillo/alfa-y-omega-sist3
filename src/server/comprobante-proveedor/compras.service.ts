//Esta carpeta es para traer las llamadas a apis
//Hoy usa mocks; mañana cambiás por fetch() a tu API sin tocar componentes.
import {  comprobanteProveedorMock,
          suppliersMock,
          depositosMock,
          tipoComprobantesMock,
          metodoPagosMock,
          tipoMovimientosMock,
          productsMock
        } from "@/mocks/comprobante-proveedor.mock"



import type { PurchaseOrder, Supplier, Product, ComprobanteProveedor } from "@/lib/comprobante-proveedor/comprobante"
import { sleep } from "@/lib/comprobante-proveedor/utils"

export async function getComprobantes(): Promise<ComprobanteProveedor[]> {
  await sleep(150) // simula fetch
  return [comprobanteProveedorMock]
}

export async function getSuppliers(): Promise<Supplier[]> {
  await sleep(50)
  return suppliersMock
}

export async function getProducts(): Promise<Product[]> {
  await sleep(50)
  return productsMock
}

export async function getDepositos(): Promise<{ id: string; name: string }[]> {
  await sleep(50)
  return depositosMock
}

export async function getTipoComprobantes(): Promise<{ id: string; name: string }[]> {
  await sleep(50)
  return tipoComprobantesMock
}

export async function getMetodoPagos(): Promise<{ id: string; name: string }[]> {
  await sleep(50)
  return metodoPagosMock
}

export async function getTipoMovimientos(): Promise<{ id: string; name: string; saldo: boolean }[]> {
  await sleep(50)
  return tipoMovimientosMock
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  await sleep(150) // simula fetch
  return [
    {
      id: "OC001",
      supplier: { id: "PROV001", name: "Distribuidora Central S.A." },
    },
  ]
}
