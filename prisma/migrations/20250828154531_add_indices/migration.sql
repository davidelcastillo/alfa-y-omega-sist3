-- CreateIndex
CREATE INDEX "idx_producto_estado" ON "public"."Producto"("estado");

-- CreateIndex
CREATE INDEX "idx_producto_nombre_rubro" ON "public"."Producto"("nombre", "rubroId");
