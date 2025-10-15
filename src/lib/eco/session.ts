import { headers } from "next/headers";
import { verifyJwt } from "@/lib/eco/usuarios/auth";

export async function getUsuarioIdFromJwt(req?: Request): Promise<number | null> {
  const hdrs = req ? new Headers(req.headers) : (await headers());

  // Cookie: auth_token  (← tu login la setea así)
  const cookieHeader = hdrs.get("cookie") || "";
  const m = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
  const tokenFromCookie = m ? decodeURIComponent(m[1]) : null;

  // Authorization: Bearer <token> (opcional, por si lo usás en algún fetch)
  const authz = hdrs.get("authorization");
  const tokenFromHeader = authz?.toLowerCase().startsWith("bearer ")
    ? authz.slice(7).trim()
    : null;

  const token = tokenFromCookie || tokenFromHeader;
  if (!token) return null;

  // Tu login firma: { sub: String(user.id), ... }
  const payload = verifyJwt<{ sub?: string }>(token);
  if (!payload?.sub) return null;

  const id = Number(payload.sub);
  return Number.isFinite(id) ? id : null;
}
