-- CreateTable
CREATE TABLE "public"."Rubro" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rubro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Unidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Unidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Marca" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "rubroId" INTEGER NOT NULL,
    "marcaId" INTEGER NOT NULL,
    "unidadId" INTEGER NOT NULL,
    "precioCompra" DOUBLE PRECISION NOT NULL,
    "precioVenta" DOUBLE PRECISION NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Deposito" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "capacidad" INTEGER,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Deposito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StockPorDeposito" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "depositoId" INTEGER NOT NULL,
    "stockActual" INTEGER NOT NULL DEFAULT 0,
    "stockMinimo" INTEGER NOT NULL DEFAULT 0,
    "stockMaximo" INTEGER,
    "capacidadMaxima" INTEGER,

    CONSTRAINT "StockPorDeposito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MovimientoStock" (
    "id" SERIAL NOT NULL,
    "depositoId" INTEGER NOT NULL,
    "tipoMovimientoId" INTEGER NOT NULL,
    "tipoComprobanteId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DetalleMovimiento" (
    "id" SERIAL NOT NULL,
    "movimientoId" INTEGER NOT NULL,
    "stockId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "DetalleMovimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TipoComprobante" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoComprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TipoMovimiento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ingresoEgreso" BOOLEAN NOT NULL,

    CONSTRAINT "TipoMovimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockPorDeposito_productoId_depositoId_key" ON "public"."StockPorDeposito"("productoId", "depositoId");

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "public"."Rubro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "public"."Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "public"."Unidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockPorDeposito" ADD CONSTRAINT "StockPorDeposito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockPorDeposito" ADD CONSTRAINT "StockPorDeposito_depositoId_fkey" FOREIGN KEY ("depositoId") REFERENCES "public"."Deposito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoStock" ADD CONSTRAINT "MovimientoStock_depositoId_fkey" FOREIGN KEY ("depositoId") REFERENCES "public"."Deposito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoStock" ADD CONSTRAINT "MovimientoStock_tipoMovimientoId_fkey" FOREIGN KEY ("tipoMovimientoId") REFERENCES "public"."TipoMovimiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoStock" ADD CONSTRAINT "MovimientoStock_tipoComprobanteId_fkey" FOREIGN KEY ("tipoComprobanteId") REFERENCES "public"."TipoComprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleMovimiento" ADD CONSTRAINT "DetalleMovimiento_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "public"."MovimientoStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleMovimiento" ADD CONSTRAINT "DetalleMovimiento_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "public"."StockPorDeposito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
