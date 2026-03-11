-- CreateTable
CREATE TABLE "public"."CategoriaFiscal" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "CategoriaFiscal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Proveedores" ADD CONSTRAINT "Proveedores_categoriaFiscalId_fkey" FOREIGN KEY ("categoriaFiscalId") REFERENCES "public"."CategoriaFiscal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
