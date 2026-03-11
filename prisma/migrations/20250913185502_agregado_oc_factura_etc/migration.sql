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
    "ciudad" TEXT,
    "provincia" TEXT,

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
    "numeroComprobante" TEXT,
    "comentario" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DetalleMovimiento" (
    "id" SERIAL NOT NULL,
    "movimientoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
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
    "saldo" BOOLEAN NOT NULL,

    CONSTRAINT "TipoMovimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ComprobanteProveedor" (
    "id" SERIAL NOT NULL,
    "ordenCompraId" INTEGER NOT NULL,
    "proveedorId" INTEGER NOT NULL,
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

    CONSTRAINT "ComprobanteProveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DetalleComprobanteProveedor" (
    "id" SERIAL NOT NULL,
    "comprobanteProveedorId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "descuento" DOUBLE PRECISION,
    "precioXCantidad" DOUBLE PRECISION,
    "observaciones" TEXT,

    CONSTRAINT "DetalleComprobanteProveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrdenCompra" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TEXT,
    "nroOC" TEXT,
    "proveedorId" INTEGER NOT NULL,
    "subTotal" DOUBLE PRECISION,
    "otrosGastos" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "fechaEntrega" TIMESTAMP(3),
    "depositoId" INTEGER,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" TEXT,

    CONSTRAINT "OrdenCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DetalleOrdenCompra" (
    "id" SERIAL NOT NULL,
    "ordenCompraId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "DetalleOrdenCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Proveedores" (
    "id" SERIAL NOT NULL,
    "razonSocial" TEXT,
    "nombre" TEXT NOT NULL,
    "nombreComercial" TEXT,
    "codigo" TEXT,
    "genero" TEXT,
    "categoriaFiscalId" INTEGER,
    "cuil" TEXT,
    "pais" TEXT,
    "provincia" TEXT,
    "localidad" TEXT,
    "barrio" TEXT,
    "codigoPostal" TEXT,
    "telefono" TEXT,
    "paginaWeb" TEXT,
    "correoElectronico" TEXT,

    CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MetodoPago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "MetodoPago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_producto_estado" ON "public"."Producto"("estado");

-- CreateIndex
CREATE INDEX "idx_producto_nombre_rubro" ON "public"."Producto"("nombre", "rubroId");

-- CreateIndex
CREATE UNIQUE INDEX "StockPorDeposito_productoId_depositoId_key" ON "public"."StockPorDeposito"("productoId", "depositoId");

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "public"."Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "public"."Rubro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "public"."Unidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockPorDeposito" ADD CONSTRAINT "StockPorDeposito_depositoId_fkey" FOREIGN KEY ("depositoId") REFERENCES "public"."Deposito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockPorDeposito" ADD CONSTRAINT "StockPorDeposito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoStock" ADD CONSTRAINT "MovimientoStock_depositoId_fkey" FOREIGN KEY ("depositoId") REFERENCES "public"."Deposito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoStock" ADD CONSTRAINT "MovimientoStock_tipoComprobanteId_fkey" FOREIGN KEY ("tipoComprobanteId") REFERENCES "public"."TipoComprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoStock" ADD CONSTRAINT "MovimientoStock_tipoMovimientoId_fkey" FOREIGN KEY ("tipoMovimientoId") REFERENCES "public"."TipoMovimiento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleMovimiento" ADD CONSTRAINT "DetalleMovimiento_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "public"."MovimientoStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleMovimiento" ADD CONSTRAINT "DetalleMovimiento_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ComprobanteProveedor" ADD CONSTRAINT "ComprobanteProveedor_ordenCompraId_fkey" FOREIGN KEY ("ordenCompraId") REFERENCES "public"."OrdenCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ComprobanteProveedor" ADD CONSTRAINT "ComprobanteProveedor_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "public"."Proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ComprobanteProveedor" ADD CONSTRAINT "ComprobanteProveedor_tipoComprobanteId_fkey" FOREIGN KEY ("tipoComprobanteId") REFERENCES "public"."TipoComprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ComprobanteProveedor" ADD CONSTRAINT "ComprobanteProveedor_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "public"."MetodoPago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleComprobanteProveedor" ADD CONSTRAINT "DetalleComprobanteProveedor_comprobanteProveedorId_fkey" FOREIGN KEY ("comprobanteProveedorId") REFERENCES "public"."ComprobanteProveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleComprobanteProveedor" ADD CONSTRAINT "DetalleComprobanteProveedor_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrdenCompra" ADD CONSTRAINT "OrdenCompra_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "public"."Proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleOrdenCompra" ADD CONSTRAINT "DetalleOrdenCompra_ordenCompraId_fkey" FOREIGN KEY ("ordenCompraId") REFERENCES "public"."OrdenCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleOrdenCompra" ADD CONSTRAINT "DetalleOrdenCompra_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
