// src/lib/eco/cart.ts
export type CartItemLS = {
  id: number | string;
  name: string;
  image: string;          // <- TU CarritoPage espera "image"
  price: number;          // unitario
  quantity: number;
  description?: string | null;
  stock?: number | null;
};

const LS_KEY = "cartItems";

export function readCart(): CartItemLS[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as CartItemLS[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItemLS[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(items));
  // Notificar a la UI que cambió el carrito
  window.dispatchEvent(new Event("cart:changed"));
}

export function addToCart(item: Omit<CartItemLS, "quantity"> & { quantity?: number }) {
  const items = readCart();
  const idStr = String(item.id);
  const idx = items.findIndex((x) => String(x.id) === idStr);

  const qty = Math.max(1, item.quantity ?? 1);
  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: (items[idx].quantity || 0) + qty };
  } else {
    items.push({
      id: item.id,
      name: item.name,
      image: item.image || "/placeholder.png",
      price: Number.isFinite(item.price as number) ? (item.price as number) : 0,
      quantity: qty,
      description: item.description ?? null,
      stock: item.stock ?? null,
    });
  }
  writeCart(items);
}