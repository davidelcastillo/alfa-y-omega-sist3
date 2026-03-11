/*
  Warnings:

  - You are about to drop the column `comentario` on the `MovimientoStock` table. All the data in the column will be lost.
  - Added the required column `depositoId` to the `ComprobanteProveedor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ComprobanteProveedor" ADD COLUMN     "depositoId" INTEGER NOT NULL,
ADD COLUMN     "moneda" TEXT;

-- AlterTable
ALTER TABLE "public"."MovimientoStock" DROP COLUMN "comentario",
ADD COLUMN     "Comentario" TEXT;

-- CreateTable
CREATE TABLE "public"."OrdenPago" (
    "id" SERIAL NOT NULL,
    "proveedorId" INTEGER NOT NULL,
    "comprobanteId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nroInterno" TEXT,
    "montoPagado" DOUBLE PRECISION NOT NULL,
    "metodoPagoId" INTEGER NOT NULL,
    "observaciones" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "OrdenPago_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ComprobanteProveedor" ADD CONSTRAINT "ComprobanteProveedor_depositoId_fkey" FOREIGN KEY ("depositoId") REFERENCES "public"."Deposito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrdenPago" ADD CONSTRAINT "OrdenPago_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "public"."Proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrdenPago" ADD CONSTRAINT "OrdenPago_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "public"."ComprobanteProveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrdenPago" ADD CONSTRAINT "OrdenPago_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "public"."MetodoPago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
