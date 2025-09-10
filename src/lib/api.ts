//Aqui pongo funciones para cambiar el estado de producto y deposito

export async function softDeleteProducto(id: number) {
  const res = await fetch(`/api/productos/${id}/eliminar`, { method: 'PUT' });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error ?? 'Error al eliminar el producto');
  }
  // json = { message, producto }
  return json.producto as {
    id: number;
    estado: boolean;
  };
}

export async function softDeleteDeposito(id: number) {
  const res = await fetch(`/api/deposito/${id}/eliminar`, { method: 'PUT' })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json?.error ?? 'Error al eliminar el depósito')
  }
  // El endpoint devuelve { message, deposito }
  return json.deposito as { 
    id: number; 
    estado: boolean 
  }
}