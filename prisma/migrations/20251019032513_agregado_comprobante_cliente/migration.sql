-- AlterTable
ALTER TABLE "ComprobanteProveedor" ADD COLUMN     "numeroComprobante" INTEGER;

-- CreateTable
CREATE TABLE "ComprobanteCliente" (
    "id" SERIAL NOT NULL,
    "numeroComprobante" INTEGER,
    "usuarioId" INTEGER NOT NULL,
    "letra" TEXT,
    "numeroSucursal" TEXT,
    "numero" TEXT,
    "tipoComprobanteId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TEXT,
    "total" DOUBLE PRECISION,
    "saldo" DOUBLE PRECISION,
    "metodoPagoId" INTEGER,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" TEXT,
    "tipoMovimientoId" INTEGER,
    "depositoId" INTEGER NOT NULL,
    "moneda" TEXT,
    "direccionId" INTEGER NOT NULL,

    CONSTRAINT "ComprobanteCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleComprobanteCliente" (
    "id" SERIAL NOT NULL,
    "comprobanteClienteId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "descuento" DOUBLE PRECISION,
    "precioXCantidad" DOUBLE PRECISION,
    "observaciones" TEXT,

    CONSTRAINT "DetalleComprobanteCliente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ComprobanteCliente" ADD CONSTRAINT "ComprobanteCliente_depositoId_fkey" FOREIGN KEY ("depositoId") REFERENCES "Deposito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteCliente" ADD CONSTRAINT "ComprobanteCliente_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "MetodoPago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteCliente" ADD CONSTRAINT "ComprobanteCliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteCliente" ADD CONSTRAINT "ComprobanteCliente_tipoMovimientoId_fkey" FOREIGN KEY ("tipoMovimientoId") REFERENCES "TipoMovimiento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteCliente" ADD CONSTRAINT "ComprobanteCliente_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteCliente" ADD CONSTRAINT "ComprobanteCliente_tipoComprobanteId_fkey" FOREIGN KEY ("tipoComprobanteId") REFERENCES "TipoComprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleComprobanteCliente" ADD CONSTRAINT "DetalleComprobanteCliente_comprobanteClienteId_fkey" FOREIGN KEY ("comprobanteClienteId") REFERENCES "ComprobanteCliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleComprobanteCliente" ADD CONSTRAINT "DetalleComprobanteCliente_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
