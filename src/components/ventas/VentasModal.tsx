// src/components/ventas/VentasModal.tsx
'use client';

// Asegúrate que useMemo esté aquí
import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select'; // Aún necesario para el Tipo de Movimiento (aunque esté deshabilitado)
// import SearchableSelect from '@/components/ui/SearchableSelect'; // Ya no es necesario
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// Asumiendo que tienes 'toast' para notificaciones
// import { toast } from 'sonner';

// ---- Tipos locales ----
export type MovimientoBasico = 'Ingreso' | 'Egreso';
export type TipoMovimiento =
  | 'Compra de inventario'
  | 'Venta de inventario'
  | 'Ajuste de stock'
  | string;

export type Deposito = { id: number; nombre: string };

// Tipo actualizado para incluir el stock que viene de la API
type ProductRow = {
    productoId: number;
    cantidad: number;
    nombre: string;
    stockActual?: number; // Stock actual en el depósito central
};

type TipoMovimientoDTO = { id: number; nombre: string; saldo: boolean };

// Props actualizadas: eliminados los props innecesarios
type Props = {
  isOpen: boolean;
  onClose: () => void;
  tiposMovimiento: TipoMovimientoDTO[]; // Necesario para mostrar el nombre del tipo
  pedidoId: string | null; // El número de pedido, ej: "PD-0001"
  refreshVentasData?: () => void; // Opcional: Para refrescar la tabla de ventas
};


export default function VentasModal({
  isOpen,
  onClose,
  tiposMovimiento,
  pedidoId: pedidoIdProp,
  refreshVentasData,
}: Props) {
  // ---- Estados ----
  const [movimiento, setMovimiento] = useState<MovimientoBasico>('Egreso'); // Siempre egreso
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>('Egreso por Venta (Egreso)'); // Nombre display
  const [tipoMovimientoId, setTipoMovimientoId] = useState<number>(2); // Fijo: ID 2 = Egreso por Venta (asegúrate que sea el ID correcto)
  const [numero, setNumero] = useState(''); // El número de pedido "PD-0001"
  const [depositoId, setDepositoId] = useState<number>(1); // Fijo: ID 1 = Depósito Central
  const [depositoNombre, setDepositoNombre] = useState(''); // Nombre display
  const [comentario, setComentario] = useState('');
  const [detalles, setDetalles] = useState<ProductRow[]>([]); // Array con { productoId, nombre, cantidad, stockActual }
  const [isBuscando, setIsBuscando] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío
  const [pedidoDbId, setPedidoDbId] = useState<number | null>(null); // ID numérico del pedido (ej: 6)
  const [direccionEnvio, setDireccionEnvio] = useState('');

  // ---- Helpers de formulario ----
  // Calculamos si hay stock insuficiente usando useMemo para eficiencia
  const hayStockInsuficiente = useMemo(() => {
     // Si aún está buscando o no hay detalles, no hay insuficiencia
     if (isBuscando || detalles.length === 0) return false;
     // Comprueba si ALGÚN item tiene cantidad mayor que su stock actual
     return detalles.some(d => d.cantidad > (d.stockActual ?? 0));
  }, [detalles, isBuscando]); // Depende de los detalles y del estado de búsqueda

  // Determina si se puede enviar el formulario
  const canSubmit = () => {
    const hasProducts = detalles.length > 0 && detalles.every(d => d.productoId > 0 && d.cantidad > 0);
    // No se puede enviar si no hay productos, está buscando, enviando o si hay stock insuficiente
    if (!hasProducts || isBuscando || isSubmitting || hayStockInsuficiente) {
        return false;
    }
    // Verifica IDs fijos (redundante pero seguro)
    return depositoId === 1 && tipoMovimientoId === 2;
  };

  // Función para buscar los datos del pedido y el depósito
  const handleBuscarPedido = async (numeroComprobante: string) => {
    if (!numeroComprobante) return;
    setIsBuscando(true);
    // Resetear estados ANTES de la llamada a la API
    setDetalles([]);
    setDireccionEnvio('');
    setPedidoDbId(null);
    setComentario('');
    setNumero('');
    setDepositoNombre('');
    setDepositoId(1); // Forzar ID 1
    setTipoMovimientoId(2); // Forzar ID 2 (Egreso Venta)

    try {
      console.log(`Buscando pedido: /api/pedidos/${numeroComprobante.trim()}`);
      const response = await fetch(`/api/pedidos/${numeroComprobante.trim()}`);

      if (!response.ok) {
         // Intentar leer el cuerpo del error si existe
         let errorMsg = `Error ${response.status}: ${response.statusText}`;
         try {
           const errorBody = await response.json();
           errorMsg = errorBody?.error || errorMsg; // Usar mensaje de error de la API si existe
         } catch (e) { /* Ignorar si el cuerpo no es JSON */ }

         // Si el status es 200 pero no hay cuerpo (o es null), interpretarlo como no encontrado
         if (response.status === 200) {
             const textResponse = await response.text(); // Leer como texto por si acaso
             if (!textResponse || textResponse === 'null') {
                 throw new Error(`Pedido ${numeroComprobante} no encontrado o no está en estado 'En preparación'.`);
             }
         }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log("Datos recibidos de la API:", data);

      // Validar la estructura de la respuesta
      if (!data || !data.pedido || !data.pedido.items) {
          console.error("Respuesta de API inválida:", data);
          throw new Error(`Respuesta inválida de la API para el pedido ${numeroComprobante}.`);
      }
      // Validar si el pedido tiene items (aunque la API debería devolver null si no los tiene)
       if (data.pedido.items.length === 0) {
           console.warn(`Pedido ${numeroComprobante} encontrado pero sin items.`);
           // toast.warn(`Pedido ${numeroComprobante} encontrado pero sin items.`);
           // Aún así, mostrar datos básicos del pedido
           setPedidoDbId(data.pedido.id);
           setNumero(data.pedido.numeroPedido);
           setComentario(`Movimiento de stock por venta Pedido N° ${data.pedido.numeroPedido} (SIN ITEMS)`);
           // Continuar para mostrar dirección y depósito si existen
       }


        const { pedido, deposito } = data; // 'deposito' es el objeto del depósito 1

        setPedidoDbId(pedido.id);
        setNumero(pedido.numeroPedido); // Usar el número exacto devuelto por la API
        if(pedido.items.length > 0) { // Solo poner comentario standard si hay items
            setComentario(`Movimiento de stock por venta Pedido N° ${pedido.numeroPedido}`);
        }

        // Mapear productos incluyendo el stock real
        const productosCargados: ProductRow[] = pedido.items.map((item: any) => {
             // Validar estructura del item y producto
             if (!item || !item.producto) {
                 console.error("Item o producto inválido:", item);
                 return null; // O manejar el error como prefieras
             }
             return {
                productoId: item.producto.id,
                nombre: item.producto.nombre || 'Nombre no disponible', // Fallback
                cantidad: item.cantidad,
                stockActual: item.stockActualDepositoCentral ?? 0, // Usar stock de la API con fallback 0
            };
        }).filter((item): item is ProductRow => item !== null); // Filtrar nulos si hubo errores

        console.log("Productos mapeados:", productosCargados);
        setDetalles(productosCargados); // Actualiza el estado que usa la tabla

        // Formatear dirección
        if (pedido.direccionEnvio) {
          const dir = pedido.direccionEnvio;
          const direccionCompleta = [
            dir.calle,
            dir.numero,
            dir.pisoDepto ? `(${dir.pisoDepto})` : '', // Ajustar nombre de campo si es diferente
            dir.ciudad,
            dir.provincia,
            dir.codigoPostal ? `CP ${dir.codigoPostal}` : ''
          ].filter(Boolean).join(', ');
          setDireccionEnvio(direccionCompleta);
        } else {
          setDireccionEnvio('Dirección no especificada');
        }

        // Setear nombre del Depósito
        if (deposito) {
          setDepositoNombre(deposito.nombre);
        } else {
           console.warn("No se recibió información del depósito default (ID:1) desde la API.");
           setDepositoNombre('Depósito Central (ID:1)'); // Fallback
        }

    } catch (error) {
      console.error('Error en handleBuscarPedido:', error);
      // toast.error((error as Error).message || 'Error al buscar datos del pedido.');
      // Limpiar detalles si hubo error grave, mantener número para contexto
      setDetalles([]);
      setNumero(numeroComprobante.trim());
    } finally {
      setIsBuscando(false);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
     // Re-validar por seguridad
     if (!canSubmit()) {
         console.warn("Intento de submit bloqueado por canSubmit() === false. Estado actual:", {
             hasProducts: detalles.length > 0,
             isBuscando,
             isSubmitting,
             hayStockInsuficiente,
             depositoId,
             tipoMovimientoId
         });
         if (hayStockInsuficiente) {
             // toast.error('No se puede registrar: Stock insuficiente.');
             console.error('Stock insuficiente.');
         }
         return;
     }

    setIsSubmitting(true);
    console.log("Iniciando handleSubmit...");

    try {
      // Step 1: Registrar el movimiento de stock
      const movimientoData = {
        tipoMovimientoId: tipoMovimientoId, // Debe ser 2
        depositoId: depositoId,           // Debe ser 1
        numeroComprobante: numero,          // "PD-0001"
        // Asegurarse que detalles tenga la estructura correcta para la API /api/movimientos
        detalles: detalles.map(p => ({
          productoId: p.productoId,
          cantidad: p.cantidad, // ENVIAR CANTIDAD POSITIVA. La API debe interpretar el TIPO de movimiento.
                                // CONFIRMA ESTO con tu API /api/movimientos
        })),
        comentario: comentario,
      };

      console.log("Enviando datos a /api/movimientos:", JSON.stringify(movimientoData, null, 2));

      const movResponse = await fetch('/api/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimientoData),
      });

      if (!movResponse.ok) {
        let errorMsg = `Error ${movResponse.status} al registrar el movimiento.`;
         try {
           const errorBody = await movResponse.json();
           errorMsg = errorBody?.message || errorMsg; // Usar mensaje de error de la API
         } catch (e) { /* Ignorar si no es JSON */ }
        console.error("Error API Movimientos:", errorMsg);
        throw new Error(errorMsg);
      }
      console.log("Movimiento registrado con éxito.");
      // const movResult = await movResponse.json(); // Opcional: leer resultado si lo necesitas

      // Step 2: Update the order status (Solo si el paso 1 fue exitoso)
      if (pedidoDbId) {
          console.log(`Actualizando estado del pedido ID: ${pedidoDbId} a 18 (Enviado)`);
        const pedidoResponse = await fetch(`/api/ventas/${pedidoDbId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estadoPedidoId: 18 }), // 18 = "Enviado" o el ID correcto
        });

        if (!pedidoResponse.ok) {
            let errorMsg = `Error ${pedidoResponse.status} al actualizar estado del pedido.`;
           try {
               const errorBody = await pedidoResponse.json();
               errorMsg = errorBody?.error || errorMsg;
           } catch(e) {/* Ignorar */}
           console.error('Movimiento OK, pero falló actualización estado pedido:', errorMsg);
          // Considera notificar al usuario, pero no tratar como error fatal aquí.
          // toast.warn('Movimiento registrado, pero hubo un problema al marcar el pedido como enviado.');
        } else {
             console.log(`Pedido ID: ${pedidoDbId} actualizado a estado 18.`);
             // toast.success('Envío registrado y pedido actualizado.');
             onClose(); // Cerrar modal solo si AMBOS pasos (o al menos el primero) son exitosos
             refreshVentasData?.(); // Refrescar tabla
        }
      } else {
           console.warn("pedidoDbId es null, no se puede actualizar estado del pedido.");
           // Si llegaste aquí, el movimiento se registró pero no se pudo actualizar el pedido
           // toast.warn('Movimiento registrado, pero no se pudo identificar el pedido para actualizar su estado.');
            onClose(); // Cerrar modal de todos modos
            refreshVentasData?.(); // Refrescar tabla
      }

    } catch (error) {
      console.error('Error en handleSubmit:', error);
      // toast.error((error as Error).message || 'Error al procesar el envío.');
    } finally {
      setIsSubmitting(false);
      console.log("handleSubmit finalizado.");
    }
  };


  // ---- Efectos ----
  useEffect(() => {
    // Se dispara al abrir el modal si hay un pedidoIdProp
    if (isOpen && pedidoIdProp) {
        console.log(`Effect: Modal abierto con pedidoId: ${pedidoIdProp}. Llamando a handleBuscarPedido.`);
       // Resetear estados clave ANTES de llamar a handleBuscarPedido
       setDetalles([]);
       setDireccionEnvio('');
       setPedidoDbId(null);
       setComentario('');
       setNumero(''); // Limpiar número anterior para evitar confusión
       setDepositoNombre('');
       setDepositoId(1); // Forzar ID 1
       setTipoMovimientoId(2); // Forzar ID 2 (Egreso Venta)
       setIsBuscando(false); // Resetear estado de búsqueda
       setIsSubmitting(false); // Resetear estado de envío

       // Llamar a la búsqueda
      handleBuscarPedido(pedidoIdProp);
    } else if (!isOpen) {
        // Opcional: Limpiar estados al cerrar si prefieres, aunque ya se limpian al abrir
        // console.log("Effect: Modal cerrado. Limpiando estados.");
        // setDetalles([]); setDireccionEnvio(''); setPedidoDbId(null); ... etc
    }
  }, [isOpen, pedidoIdProp]); // Dependencias correctas


  // Efecto para cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log("Cerrando modal con ESC");
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Efecto para setear nombre del tipo de movimiento
   useEffect(() => {
     // Solo buscar si tiposMovimiento está disponible y el ID es el esperado (2)
     if (tiposMovimiento && tipoMovimientoId === 2) {
       const tm = tiposMovimiento.find((t) => t.id === tipoMovimientoId);
       if (tm) {
         setTipoMovimiento(tm.nombre as TipoMovimiento); // "Egreso por Venta (Egreso)"
         setMovimiento(tm.saldo ? 'Ingreso' : 'Egreso'); // Debería ser 'Egreso'
       } else {
         console.warn("Tipo de movimiento con ID 2 no encontrado en la lista `tiposMovimiento`.");
         setTipoMovimiento('Egreso por Venta (Egreso)'); // Fallback
         setMovimiento('Egreso');
       }
     }
   }, [tipoMovimientoId, tiposMovimiento]);

  // ---- Render ----
  return (
    <AlertDialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
      <AlertDialogContent className="glass-effect p-0 overflow-hidden w-full max-w-3xl md:max-w-5xl h-[90vh] flex flex-col"> {/* Aumentado h y flex col */}
        {/* Header */}
        <div className="flex-none p-4 md:p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg"> {/* Estilo Header */}
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-xl md:text-2xl font-semibold text-gray-700">
              Registrar Salida de Stock por Venta
            </AlertDialogTitle>
            <button
              onClick={onClose}
              disabled={isSubmitting} // Deshabilitar mientras envía
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              aria-label="Cerrar modal"
            >
              {/* Icono X */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body Scrollable */}
        <div className="flex-auto overflow-y-auto p-4 md:p-6 space-y-5"> {/* Ajustado padding/space */}
          {isBuscando && (
              <div className="flex justify-center items-center py-10">
                <p className="text-gray-500 animate-pulse">Buscando datos del pedido...</p>
                {/* Puedes añadir un spinner real aquí */}
              </div>
            )}

          {!isBuscando && !pedidoDbId && pedidoIdProp && ( // Error si no se encontró pedido
            <div className="flex flex-col justify-center items-center py-10 text-center">
                 <p className="text-red-600 font-semibold mb-2">Error al Cargar Datos</p>
                <p className="text-gray-600 text-sm">
                 No se encontraron datos para el pedido <span className="font-medium">{pedidoIdProp}</span> o no está listo para envío.
                </p>
                 <p className="text-gray-500 text-xs mt-1">Verifica el número de pedido y su estado.</p>
            </div>
          )}

          {/* Formulario principal (se muestra si no está buscando y se encontró el pedido) */}
          { !isBuscando && pedidoDbId && (
            <>
              {/* Fila 1: Número Pedido y Tipo Movimiento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Input
                    label="Nº Pedido"
                    value={numero}
                    readOnly
                    disabled
                    className="input-focus bg-gray-100 cursor-not-allowed text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                      label="Tipo de Movimiento"
                      value={tipoMovimiento} // Nombre del tipo de movimiento
                      readOnly
                      disabled
                      className="input-focus bg-gray-100 cursor-not-allowed text-sm"
                  />
                   {/* Select oculto solo como referencia */}
                   <select value={tipoMovimientoId} hidden aria-hidden="true">
                      {tiposMovimiento.map((tm) => (
                           <option key={tm.id} value={tm.id}>{tm.nombre}</option>
                      ))}
                   </select>
                </div>
              </div>

              {/* Fila 2: Depósito y Dirección */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <Input
                        label="Depósito Origen"
                        value={depositoNombre || (depositoId === 1 ? 'Depósito Central' : 'Cargando...')}
                        readOnly
                        disabled
                        className="input-focus bg-gray-100 cursor-not-allowed text-sm"
                    />
                    <Input
                        label="Dirección de Envío"
                        value={direccionEnvio}
                        readOnly
                        disabled
                        className="input-focus bg-gray-100 cursor-not-allowed text-sm"
                    />
               </div>


              {/* Fila 3: Comentario */}
              <Input
                label="Comentario"
                value={comentario}
                // Permitir editar el comentario si se desea
                 onChange={(e) => setComentario(e.target.value)}
                 disabled={isSubmitting} // Deshabilitar mientras envía
                className="input-focus text-sm" // Quitado bg-gray-100 si es editable
                placeholder="Notas adicionales (opcional)..." // Textarea opcional
              />

              {/* Sección Productos */}
              <div className="pt-2">
                <h4 className="text-base font-semibold text-gray-700 mb-2 border-b pb-1">Productos a Egresar</h4>
                 {detalles.length === 0 && !isBuscando && (
                    <p className="text-gray-500 italic text-sm py-4 text-center">Este pedido no contiene productos.</p>
                 )}
                <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-2"> {/* Scroll interno para productos */}
                  {detalles.map((row, idx) => {
                    const stockActual = row.stockActual ?? 0;
                    const cantidadNum = Number(row.cantidad) || 0;
                    // const esIngreso = false; // Siempre egreso para este modal
                    const signedQty = -Math.abs(cantidadNum); // Cantidad a restar
                    const resultante = stockActual + signedQty;
                    const stockInsuficienteLocal = resultante < 0;

                    return (
                      <div key={`${row.productoId}-${idx}`} /* Key más robusta */
                           className={`product-row p-3 grid grid-cols-12 gap-3 border rounded ${stockInsuficienteLocal ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'}`}>

                        {/* Nombre del Producto */}
                        <div className="col-span-12 md:col-span-7 flex flex-col justify-center">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Producto</label>
                          <span className="text-sm font-medium text-gray-800 truncate" title={row.nombre}>
                              {row.nombre}
                          </span>
                           {/* Podrías añadir SKU o código aquí si lo tienes */}
                           {/* <span className="text-xs text-gray-400">ID: {row.productoId}</span> */}
                        </div>

                        {/* Cantidad y Stock */}
                        <div className="col-span-12 md:col-span-5">
                            <Input
                                label="Cantidad"
                                type="number"
                                value={row.cantidad}
                                readOnly
                                disabled
                                className="input-focus bg-gray-200 cursor-not-allowed text-sm !py-1" // Más compacto
                            />
                            {/* Indicadores */}
                            <div className="mt-1 grid grid-cols-2 gap-1 text-xs">
                                <div className="rounded border border-gray-300 px-2 py-0.5 text-center">
                                    <span className="text-gray-500">Actual: </span>
                                    <span className="font-semibold">{stockActual}</span>
                                </div>
                                <div className={`rounded border px-2 py-0.5 text-center ${stockInsuficienteLocal ? 'border-red-400 bg-red-100 text-red-700' : 'border-green-400 bg-green-100 text-green-700'}`}>
                                    <span className="">Result.: </span>
                                    <span className="font-semibold">{resultante}</span>
                                </div>
                            </div>
                            {stockInsuficienteLocal && (
                                <p className="mt-1 text-xs text-red-600 font-semibold text-center">⚠️ Stock insuficiente</p>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div> {/* Fin scrollable productos */}
              </div> {/* Fin sección Productos */}

            </>
          )} {/* Fin del render condicional del formulario */}
        </div> {/* Fin Body Scrollable */}

         {/* Footer con Actions (siempre visible si el modal está abierto) */}
         { !isBuscando && pedidoDbId && ( // Mostrar botones solo si se cargó un pedido
            <div className="flex-none p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancelar
                    </Button>
                    <Button
                        variant="primary" // O tu variante de success/confirmar
                        // className="bg-green-600 hover:bg-green-700 text-white" // Ejemplo de estilo
                        disabled={!canSubmit()} // canSubmit ya incluye validación de stock
                        onClick={handleSubmit}
                        // isLoading={isSubmitting} // Si tu botón soporta estado de carga
                    >
                    {isSubmitting ? 'Registrando...' : 'Confirmar y Registrar Salida'}
                    </Button>
                </div>
                 {hayStockInsuficiente && (
                    <p className="text-xs text-red-600 text-right font-medium mt-2">
                        No se puede registrar: stock insuficiente para uno o más productos.
                    </p>
                )}
            </div>
         )}

      </AlertDialogContent>
    </AlertDialog>
  );
}

