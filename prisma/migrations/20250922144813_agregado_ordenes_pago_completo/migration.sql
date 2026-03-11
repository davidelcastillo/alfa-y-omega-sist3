/*
  Warnings:

  - You are about to drop the column `comprobanteId` on the `OrdenPago` table. All the data in the column will be lost.
  - You are about to drop the column `montoPagado` on the `OrdenPago` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."OrdenPago" DROP CONSTRAINT "OrdenPago_comprobanteId_fkey";

-- AlterTable
ALTER TABLE "public"."OrdenPago" DROP COLUMN "comprobanteId",
DROP COLUMN "montoPagado",
ADD COLUMN     "totalPagado" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."DetalleOrdenPago" (
    "id" SERIAL NOT NULL,
    "ordenPagoId" INTEGER NOT NULL,
    "comprobanteId" INTEGER NOT NULL,
    "montoPagado" DOUBLE PRECISION NOT NULL,
    "saldoPrevio" DOUBLE PRECISION,
    "saldoRestante" DOUBLE PRECISION,

    CONSTRAINT "DetalleOrdenPago_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DetalleOrdenPago" ADD CONSTRAINT "DetalleOrdenPago_ordenPagoId_fkey" FOREIGN KEY ("ordenPagoId") REFERENCES "public"."OrdenPago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleOrdenPago" ADD CONSTRAINT "DetalleOrdenPago_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "public"."ComprobanteProveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
