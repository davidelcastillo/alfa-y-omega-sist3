import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const ALLOWED = /^image\/(png|jpe?g|webp)$/i;
const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const productoId = Number(params.id);
  if (!Number.isFinite(productoId)) {
    return NextResponse.json({ ok:false, error:"productoId inválido" }, { status:400 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ ok:false, error:"Falta archivo" }, { status:400 });
  if (!ALLOWED.test(file.type)) {
    return NextResponse.json({ ok:false, error:"Formato no permitido" }, { status:415 });
  }

  const ab = await file.arrayBuffer();
  if (ab.byteLength > MAX_BYTES) {
    return NextResponse.json({ ok:false, error:"Imagen > 2MB" }, { status:413 });
  }

  // Subir a Cloudinary via stream/buffer
  const upload = await new Promise<import("cloudinary").UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `sist3/productos/${productoId}`,
        resource_type: "image",
        overwrite: false,
      },
      (err, res) => (err ? reject(err) : resolve(res!))
    );
    stream.end(Buffer.from(ab));
  });

  const url = upload.secure_url;

  // calcular próximo orden
  const max = await prisma.imagenProducto.aggregate({
    where: { productoId },
    _max: { orden: true },
  });
  const nextOrden = (max._max.orden ?? -1) + 1;

  const img = await prisma.imagenProducto.create({
    data: { productoId, url, orden: nextOrden },
    select: { id: true, url: true, orden: true },
  });

  return NextResponse.json({ ok: true, data: img });
}
