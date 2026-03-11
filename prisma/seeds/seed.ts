import { PrismaClient } from "../../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  // ---- RUBROS ----
  const rubrosData = [
    "Materiales de Construcción Gruesa",
    "Construcción en Seco",
    "Techados y Zinguería",
    "Aberturas",
    "Pisos y Revestimientos",
    "Pinturería",
    "Sanitarios y Grifería",
    "Bulonería",
    "Ferretería y Electricidad",
    "Jardinería y Exterior",
  ];

  const rubros = [];
  for (const nombre of rubrosData) {
    rubros.push(await prisma.rubro.create({ data: { nombre } }));
  }

  // ---- UNIDADES ----
  const unidadesData = [
    "Bolsa","Metro cúbico (m³)","Bolsón","Unidad","Pallet","Barra/Tira","Placa",
    "Tira","Balde (kg)","Rollo (m)","Metro lineal","Rollo (m²)","Metro cuadrado (m²)",
    "Caja","Lata/Balde (Litros)","Hoja","Juego","Cien Unidades","Kilo (kg)",
    "Metro","Rollo","Bolsa (dm³)",
  ];

  const unidades = [];
  for (const nombre of unidadesData) {
    unidades.push(await prisma.unidad.create({ data: { nombre } }));
  }

  // ---- MARCAS ----
  const marcasData = [
    "Loma Negra","Holcim","Cementos Avellaneda","Acindar","Tenaris",
    "Durlock","Knauf","Placo (Saint-Gobain)","Mapei","Icopal","Sika",
    "Tejas del Plata","AluZinc","Montenegro","Aluar","Oblak","Brodatz","Zanotti",
    "Cerámica Scop","Ilva","Roca","Krono Original","Sherwin Williams","Sinteplast",
    "Alba","Plavicon","Ferrum","Peirano","FV","Oliver","Gentili","Premiumfast",
    "Clavos SA","Bosch","Tramontina","Schneider Electric","Philips","Ideal","Tricot",
    "Cestinci","Patagonia Landscaping",
  ];

  const marcas = [];
  for (const nombre of marcasData) {
    marcas.push(await prisma.marca.create({ data: { nombre } }));
  }

  // ---- DEPOSITOS ----
  const depositosData = [
    { nombre: "Depósito Central", ubicacion: "Ciudad A", tipo: "Principal", capacidad: 1000 },
    { nombre: "Depósito Norte", ubicacion: "Ciudad B", tipo: "Secundario", capacidad: 500 },
  ];

  const depositos = [];
  for (const dep of depositosData) {
    depositos.push(await prisma.deposito.create({ data: dep }));
  }

  // ---- PRODUCTOS ----
  const productosData = [
    {
      nombre: "Bolsa de cemento 25 kg",
      descripcion: "Bolsa de cemento Avellaneda 25 kg",
      rubroId: rubros[0].id,
      marcaId: marcas[2].id,
      unidadId: unidades[0].id,
    },
    {
      nombre: "Arena bolsón 1 m³",
      descripcion: "Arena de construcción en bolsón 1 m³",
      rubroId: rubros[0].id,
      marcaId: marcas[1].id,
      unidadId: unidades[1].id,
    },
    {
      nombre: "Malla de acero 6 mm 2.4 x 6 m",
      descripcion: "Malla de acero 6 mm marca Acindar",
      rubroId: rubros[0].id,
      marcaId: marcas[3].id,
      unidadId: unidades[3].id,
    },
    {
      nombre: "Yeso Placo 1.2 x 2.4 m",
      descripcion: "Placa de yeso Placo (Saint-Gobain)",
      rubroId: rubros[1].id,
      marcaId: marcas[7].id,
      unidadId: unidades[6].id,
    },
  ];

  const productos = [];
  for (const prod of productosData) {
    productos.push(await prisma.producto.create({ data: prod }));
  }


    const tipoComprobanteData = [
      "Factura",
      "Recibo",
      "Nota de Crédito",
      "Nota de Débito",
      "Remito",
  ];

  const tipoComprobante = [];
  for (const nombre of tipoComprobanteData) {
    tipoComprobante.push(await prisma.tipoComprobante.create({ data: { nombre } }));
  }

  const MovimientoData = [
    {
      nombre: "Ingreso por compra",
      saldo: true,
    },
    {
       nombre: "Egreso por Ajuste",
      saldo: false,
    },
    {
      nombre: "Ingreso por Traspaso",
      saldo: true,
    },
    {
      nombre: "Egreso por Traspasoo",
      saldo: false,
    },
    {
      nombre: "Ingreso por Ajuste",
      saldo: true,
    },
    {
      nombre: "Egreso por Venta",
      saldo: false,
    },
    {
      nombre: "Ingreso por Devolución",
      saldo: true,
    },
  ];

  const TipoMovimiento = [];
  for (const mov of MovimientoData) {
    TipoMovimiento.push(await prisma.tipoMovimiento.create({ data: mov }));
  }
  
  // ---- STOCK POR DEPOSITO ----
  for (const producto of productos) {
    for (const deposito of depositos) {
      await prisma.stockPorDeposito.create({
        data: {
          productoId: producto.id,
          depositoId: deposito.id,
          stockActual: Math.floor(Math.random() * 100),
          stockMinimo: 10,
          stockMaximo: 200,
          capacidadMaxima: 200,
        },
      });
    }
  }

  // ---- MOVIMIENTO STOCK  ----
  await prisma.movimientoStock.create({
    data: {
      fecha: new Date(),
      depositoId: depositos[0].id,
      tipoMovimientoId: 1,
      tipoComprobanteId: 1,
      comentario: "Orden generada automáticamente",
      detalles : {
        create: productos.map(p => ({
          productoId: p.id,
          cantidad: 5,
        })),
      },
    },
  });

  // ---- METODOS DE PAGO ----
  const metodosPagoData = ["Efectivo", "Transferencia", "Tarjeta Crédito"];
  const metodosPago = [];
  for (const nombre of metodosPagoData) {
    metodosPago.push(await prisma.metodoPago.create({ data: { nombre } }));
  }

  // ---- PROVEEDORES ----
  const categoriaFiscalData = [
      "Responsable Inscripto",
      "Exterior",
      "Exento",
      "Consumidor final",
      "Monotributista",
  ];

  const CategoriaFiscal = [];
  for (const nombre of categoriaFiscalData) {
    CategoriaFiscal.push(await prisma.categoriaFiscal.create({ data: { nombre } }));
  }

  const proveedor = await prisma.proveedores.create({
    data: {
      nombre: "Proveedor Ejemplo",
      razonSocial: "Proveedor Ejemplo S.A.",
      correoElectronico: "contacto@proveedor.com",
      telefono: "3871234567",
      pais: "Argentina",
      provincia: "Salta",
      localidad: "Salta",
      categoriaFiscalId: CategoriaFiscal[0].id,
      cuil: "30-12345678-9",
    },
  });

  // ---- ORDEN DE COMPRA ----
  const ordenCompra = await prisma.ordenCompra.create({
    data: {
      fecha: new Date(),
      proveedorId: proveedor.id,
      subTotal: 10000,
      total: 10500,
      otrosGastos: 500,
      fechaEntrega: new Date(new Date().setDate(new Date().getDate() + 7)),
      depositoId: depositos[0].id,
      observaciones: "Orden generada automáticamente",
      detalleOrdenCompra: {
        create: productos.map(p => ({
          productoId: p.id,
          precioUnitario: 500,
          cantidad: 5,
        })),
      },
    },
  });

  // ---- COMPROBANTE PROVEEDOR ----
  

  await prisma.comprobanteProveedor.create({
    data: {
      ordenCompraId : ordenCompra.id,
      proveedorId        : proveedor.id,
      depositoId         : depositos[0].id,
      letra              : "A",
      numeroSucursal     : "001",
      numero             : "0001",
      moneda             : "ARS",
      tipoComprobanteId  : tipoComprobante[0].id,
      fecha              : new Date(),
      hora               : "10:00",
      total              : 10500,
      saldo              : 10500,
      metodoPagoId       : metodosPago[0].id,
      estado             : true,
      observaciones      : "Comprobante generado automáticamente",
      tipoMovimientoId   : 1,
      detalleComprobante  : {
        create: productos.map(p => ({
          productoId: p.id,
          cantidad: 5,
          precioUnitario: 500,
        })),
      },
    },
  });

  console.log("Seed completado exitosamente!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => { await prisma.$disconnect(); });
