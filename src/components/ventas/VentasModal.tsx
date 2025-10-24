// src/components/ventas/VentasModal.tsx
'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// import { toast } from 'sonner';

// ---- Tipos locales ----
export type MovimientoBasico = 'Ingreso' | 'Egreso';
export type TipoMovimiento =
  | 'Compra de inventario'
  | 'Venta de inventario'
  | 'Ajuste de stock'
  | string;

export type Deposito = { id: number; nombre: string; [key: string]: any };

type ProductRow = {
    productoId: number;
    cantidad: number;
    nombre: string;
    stockActual?: number;
};

type TipoMovimientoDTO = { id: number; nombre: string; saldo: boolean };

// --- Tipos Respuesta API Pedido ---
type DireccionEnvioType = { id: number; calle: string; numero: string; pisoDepto?: string | null; ciudad: string; provincia: string; codigoPostal?: string | null; [key: string]: any; };
type ProductoType = { id: number; nombre: string; [key: string]: any; };
type PedidoItemType = { id: number; productoId: number; cantidad: number; producto: ProductoType; stockActualDepositoCentral?: number; };
type PedidoType = { id: number; numeroPedido: string; items: PedidoItemType[]; direccionEnvio: DireccionEnvioType | null; [key: string]: any; };
type PedidoApiResponse = { pedido: PedidoType; deposito: Deposito | null; };

// --- Props ---
type Props = {
  isOpen: boolean;
  onClose: () => void;
  tiposMovimiento?: TipoMovimientoDTO[] | null; // Prop puede ser null/undefined
  pedidoId: string | null;
  refreshVentasData?: () => void;
};

export default function VentasModal({
  isOpen,
  onClose,
  tiposMovimiento: tiposMovimientoProp, // Renombrar prop
  pedidoId: pedidoIdProp,
  refreshVentasData,
}: Props) {
  // ---- Constantes ----
  // *** ¡¡VERIFICA ESTOS IDS!! ***
  const EGRESO_VENTA_ID = 6;
  const ESTADO_ENVIADO_ID = 18;
  const DEPOSITO_CENTRAL_ID = 1;

  // ---- Estados ----
  const [movimiento, setMovimiento] = useState<MovimientoBasico>('Egreso');
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>('Egreso por Venta');
  const [tipoMovimientoId, setTipoMovimientoId] = useState<number>(EGRESO_VENTA_ID);
  const [numero, setNumero] = useState('');
  const [depositoId, setDepositoId] = useState<number>(DEPOSITO_CENTRAL_ID);
  const [depositoNombre, setDepositoNombre] = useState('');
  const [comentario, setComentario] = useState('');
  const [detalles, setDetalles] = useState<ProductRow[]>([]);
  const [isBuscando, setIsBuscando] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pedidoDbId, setPedidoDbId] = useState<number | null>(null);
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  // Variable interna segura que SIEMPRE es un array
  const tiposMovimiento = useMemo(() => Array.isArray(tiposMovimientoProp) ? tiposMovimientoProp : [], [tiposMovimientoProp]);

  // ---- Helpers ----
  const hayStockInsuficiente = useMemo(() => {
     if (isBuscando || !Array.isArray(detalles) || detalles.length === 0) return false;
     return detalles.some(d => d.cantidad > (d.stockActual ?? 0));
  }, [detalles, isBuscando]);

  const canSubmit = useMemo(() => {
    const hasProducts = Array.isArray(detalles) &&
                        detalles.length > 0 &&
                        detalles.every(d => d?.productoId > 0 && d?.cantidad > 0);
    if (!hasProducts || isBuscando || isSubmitting || hayStockInsuficiente) { return false; }
    return depositoId === DEPOSITO_CENTRAL_ID && tipoMovimientoId === EGRESO_VENTA_ID;
  }, [detalles, isBuscando, isSubmitting, hayStockInsuficiente, depositoId, tipoMovimientoId]);

  // --- Función Buscar Pedido ---
  const handleBuscarPedido = useCallback(async (numeroComprobante: string) => {
    if (!numeroComprobante) return;
    console.log(`handleBuscarPedido: ${numeroComprobante}`);
    setIsBuscando(true); setErrorCarga(null);
    setDetalles([]); setDireccionEnvio(''); setPedidoDbId(null); setComentario(''); setNumero(''); setDepositoNombre('');
    setDepositoId(DEPOSITO_CENTRAL_ID); setTipoMovimientoId(EGRESO_VENTA_ID);

    let data: PedidoApiResponse | null = null;
    try {
      const response = await fetch(`/api/pedidos/${numeroComprobante.trim()}`);
      console.log(`Fetch response: ${response.status} ${response.ok}`);
      if (!response.ok) {
         let errorMsg = `Error ${response.status}: ${response.statusText}`; let errorBody = null;
         try { errorBody = await response.json(); errorMsg = errorBody?.error || errorBody?.message || errorMsg; } catch (e) {/* Ignorar */}
         if (response.status === 200) {
              const bodyText = await response.text();
              if (!bodyText || bodyText === 'null') { errorMsg = `Pedido ${numeroComprobante} no encontrado o no listo.`; }
              else { try { data = JSON.parse(bodyText); } catch (e) { errorMsg = "Respuesta inesperada (200 !ok)"; } }
         }
         if (!data) throw new Error(errorMsg);
      }
      if (!data) { data = await response.json() as PedidoApiResponse; }
      console.log("API Data:", data);
      if (!data?.pedido?.id || !Array.isArray(data.pedido.items)) { throw new Error("API response format invalid."); }

      const { pedido, deposito } = data;
      setPedidoDbId(pedido.id); setNumero(pedido.numeroPedido);

       if (pedido.items.length === 0) {
           console.warn(`Pedido ${numeroComprobante} sin items.`); setComentario(`Mov. stock Venta ${pedido.numeroPedido} (SIN ITEMS)`);
       } else {
           setComentario(`Mov. stock Venta ${pedido.numeroPedido}`);
           const productosCargados: ProductRow[] = pedido.items
            .map((item: PedidoItemType): ProductRow | null => {
             if (!item?.producto?.id || typeof item.cantidad !== 'number') { console.error("Invalid item:", item); return null; }
             const stock = Number(item.stockActualDepositoCentral ?? 0);
             if (isNaN(stock)) { console.error("Invalid stock:", item); return null; }
             return { productoId: item.producto.id, nombre: item.producto.nombre || 'N/A', cantidad: item.cantidad, stockActual: stock };
           }).filter((item): item is ProductRow => item !== null);
            console.log("Mapped products:", productosCargados); setDetalles(productosCargados);
       }
        if (pedido.direccionEnvio) {
          const dir = pedido.direccionEnvio; const d = [ dir.calle, dir.numero, dir.pisoDepto ? `(${dir.pisoDepto})` : '', dir.ciudad, dir.provincia, dir.codigoPostal ? `CP ${dir.codigoPostal}` : '' ].filter(Boolean).join(', '); setDireccionEnvio(d);
        } else { setDireccionEnvio('N/A'); }
        if (deposito) { setDepositoNombre(deposito.nombre); } else { console.warn("Depósito ID:1 missing."); setDepositoNombre('Dep. Central (ID:1)'); }
    } catch (error: any) {
      console.error('handleBuscarPedido error:', error); setErrorCarga(error.message || 'Error cargando datos.');
      setDetalles([]); setNumero(numeroComprobante.trim()); setDireccionEnvio(''); setDepositoNombre(''); setPedidoDbId(null); setComentario('');
    } finally { setIsBuscando(false); console.log("handleBuscarPedido finished."); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Función Submit ---
  const handleSubmit = useCallback(async () => {
    console.log("handleSubmit triggered. Checking conditions...");
    if (!Array.isArray(detalles)) { console.error("ABORT: 'detalles' not an array:", detalles); return; }
    
    // --- CORRECCIÓN AQUÍ: Llamar a 'canSubmit' (el valor boolean) ---
    if (!canSubmit) { 
        console.warn("ABORT: !canSubmit."); 
        // console.log("canSubmit details:", { hasProducts: Array.isArray(detalles) && detalles.length > 0, isBuscando, isSubmitting, hayStockInsuficiente }); // Debug
        return; 
    }
    
    console.log("Conditions met. Submitting...");
    setIsSubmitting(true);
    try {
      const movimientoData = { tipoMovimientoId: EGRESO_VENTA_ID, depositoId: DEPOSITO_CENTRAL_ID, numeroComprobante: numero, detalles: detalles.map(p => ({ productoId: p.productoId, cantidad: p.cantidad, })), comentario: comentario, };
      console.log("-> /api/movimientos (POST):", JSON.stringify(movimientoData, null, 2));
      const movResponse = await fetch('/api/movimientos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(movimientoData) });
      if (!movResponse.ok) { let e = `Err ${movResponse.status} mov.`; try {const b=await movResponse.json();e=b?.message||e;}catch(_){} console.error("API Mov Err:", e); throw new Error(e); }
      console.log("Movimiento OK.");

      if (!pedidoDbId) { console.warn("pedidoDbId null. Mov OK, no act. pedido."); onClose(); refreshVentasData?.(); return; }
      console.log(`-> /api/ventas/${pedidoDbId} (PUT)`);
      const pedidoResponse = await fetch(`/api/ventas/${pedidoDbId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estadoPedidoId: ESTADO_ENVIADO_ID }) });
      if (!pedidoResponse.ok) { let e = `Err ${pedidoResponse.status} pedido.`; try{const b=await pedidoResponse.json();e=b?.error||e;}catch(_){} console.error('Mov OK, Err act. pedido:', e); }
      else { console.log(`Pedido ${pedidoDbId} updated to ${ESTADO_ENVIADO_ID}.`); }
      onClose(); refreshVentasData?.();
    } catch (error: any) { console.error('handleSubmit catch error:', error); /* toast.error(error.message || 'Error.'); */ }
    finally { setIsSubmitting(false); console.log("handleSubmit finished."); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detalles, numero, comentario, pedidoDbId, hayStockInsuficiente, isBuscando, isSubmitting, onClose, refreshVentasData, depositoId, tipoMovimientoId, canSubmit]);

  // ---- Efectos ----
   useEffect(() => {
    if (isOpen && pedidoIdProp) {
        console.log(`Effect: Opening modal ${pedidoIdProp}. Resetting and calling handleBuscarPedido.`);
        setErrorCarga(null); setDetalles([]); setDireccionEnvio(''); setPedidoDbId(null); setComentario(''); setNumero(''); setDepositoNombre('');
        setDepositoId(DEPOSITO_CENTRAL_ID); setTipoMovimientoId(EGRESO_VENTA_ID);
        setIsBuscando(true); setIsSubmitting(false);
        const timer = setTimeout(() => handleBuscarPedido(pedidoIdProp), 50); // Small delay
        return () => clearTimeout(timer);
    } else if (!isOpen) {
         // Reset state when modal closes
         setErrorCarga(null); setDetalles([]); setDireccionEnvio(''); setPedidoDbId(null); setComentario(''); setNumero(''); setDepositoNombre('');
         setIsBuscando(false); setIsSubmitting(false);
    }
  }, [isOpen, pedidoIdProp, handleBuscarPedido]); // handleBuscarPedido is stable due to useCallback([])

  // Efecto ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isSubmitting) onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, isSubmitting]);

  // Efecto Nombre Tipo Movimiento
   useEffect(() => {
     // Use the safe 'tiposMovimiento' array here
     if (tiposMovimiento.length > 0 && tipoMovimientoId) {
       const tm = tiposMovimiento.find((t) => t.id === tipoMovimientoId);
       if (tm) { setTipoMovimiento(tm.nombre as TipoMovimiento); setMovimiento(tm.saldo ? 'Ingreso' : 'Egreso'); }
       else { console.warn(`ID ${tipoMovimientoId} not found.`); setTipoMovimiento('Egreso Venta (Fallback)'); setMovimiento('Egreso'); }
     } else {
        setTipoMovimiento('Egreso Venta (Fallback)'); setMovimiento('Egreso');
     }
   }, [tipoMovimientoId, tiposMovimiento]); // Use safe array in dependency

  // ---- Render ----
  return (
     <AlertDialog open={isOpen} onOpenChange={(open: boolean) => { if (!open && !isSubmitting) onClose(); }}>
      <AlertDialogContent className="glass-effect p-0 overflow-hidden w-full max-w-3xl md:max-w-5xl h-[90vh] flex flex-col bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex-none p-4 md:p-5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
           <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-lg md:text-xl font-medium text-gray-800"> Registrar Salida de Stock por Venta </AlertDialogTitle>
            <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-700 disabled:opacity-50 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Cerrar modal"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg> </button>
          </div>
        </div>

        {/* Body Scrollable */}
        <div className="flex-auto overflow-y-auto p-4 md:p-6 space-y-4">
          {isBuscando && ( <div className="flex justify-center items-center py-10"> <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle> <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path> </svg> <p className="text-gray-500 ml-2 text-sm">Buscando...</p> </div> )}
          {errorCarga && !isBuscando && ( <div className="p-4 text-center bg-red-50 border border-red-200 rounded-md"> <p className="text-red-700 font-medium mb-1 text-sm">Error al Cargar</p> <p className="text-gray-700 text-xs"> {errorCarga} </p> </div> )}

          {/* Formulario */}
          { !isBuscando && !errorCarga && pedidoDbId && (
            <>
              {/* Fila 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div> <Input label="Nº Pedido" value={numero} readOnly disabled className="input-field-disabled"/> </div>
                <div className="sm:col-span-2">
                    <Input label="Tipo Movimiento" value={tipoMovimiento} readOnly disabled className="input-field-disabled"/>
                    <select value={String(tipoMovimientoId)} hidden readOnly aria-hidden="true">
                        <option value="0" disabled></option>
                        {tiposMovimiento.map(tm => (<option key={tm.id} value={tm.id}>{tm.nombre}</option>))}
                    </select>
                </div>
              </div>
              {/* Fila 2 */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <Input label="Depósito Origen" value={depositoNombre} readOnly disabled className="input-field-disabled"/>
                    <Input label="Dirección Envío" value={direccionEnvio} readOnly disabled className="input-field-disabled"/>
               </div>
              {/* Fila 3 */}
              <Input label="Comentario" value={comentario} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComentario(e.target.value)} disabled={isSubmitting} className="input-field" placeholder="Notas (opcional)..." rows={2}/>

              {/* Sección Productos */}
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-gray-600 mb-2 border-b pb-1">Productos a Egresar</h4>
                 {(!Array.isArray(detalles) || detalles.length === 0) && !isBuscando && ( <p className="text-gray-500 italic text-xs py-3 text-center">Pedido sin productos.</p> )}
                { Array.isArray(detalles) && detalles.length > 0 && (
                    <div className="space-y-2 max-h-[calc(90vh-480px)] overflow-y-auto pr-1">
                    {detalles.map((row) => {
                        const stockActual = row.stockActual ?? 0; const cantidadNum = row.cantidad; const resultante = stockActual - cantidadNum; const stockInsuficienteLocal = resultante < 0;
                        return ( <div key={row.productoId} className={`p-2 grid grid-cols-12 gap-2 border rounded text-xs ${stockInsuficienteLocal ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'}`}>
                            <div className="col-span-12 sm:col-span-7 flex flex-col justify-center"> <label className="block text-[10px] font-medium text-gray-500">Producto</label> <span className="font-medium text-gray-800 truncate block py-1" title={row.nombre}> {row.nombre} </span> </div>
                            <div className="col-span-12 sm:col-span-5"> <Input label="Cantidad" type="number" value={String(row.cantidad)} readOnly disabled className="input-field-disabled !text-xs !py-1"/>
                                <div className="mt-1 grid grid-cols-2 gap-1 text-[10px]">
                                    <div className="rounded border border-gray-300 px-1 py-0.5 text-center bg-gray-50"> <span className="text-gray-500">Actual: </span> <span className="font-semibold">{stockActual}</span> </div>
                                    <div className={`rounded border px-1 py-0.5 text-center ${stockInsuficienteLocal ? 'border-red-400 bg-red-100 text-red-700' : 'border-green-400 bg-green-100 text-green-700'}`}> <span>Result.: </span> <span className="font-semibold">{resultante}</span> </div>
                                </div> {stockInsuficienteLocal && ( <p className="mt-1 text-[10px] text-red-600 font-semibold text-center">⚠️ Stock insuficiente</p> )}
                            </div>
                        </div> ); })}
                    </div> )}
              </div> {/* Fin sección */}
            </>
          )} {/* Fin formulario */}
        </div> {/* Fin Body */}

         {/* Footer */}
         <div className="flex-none p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
             { !isBuscando && !errorCarga && pedidoDbId && (
                <> <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}> Cancelar </Button>
                    {/* --- CORRECCIÓN AQUÍ: Llamar a 'canSubmit' (el valor boolean) --- */}
                    <Button variant="primary" size="sm" disabled={!canSubmit} onClick={handleSubmit} > 
                        {isSubmitting ? 'Registrando...' : 'Confirmar Salida'} 
                    </Button>
                </div> {hayStockInsuficiente && ( <p className="text-xs text-red-600 text-right font-medium mt-1"> Stock insuficiente. </p> )} </>
             )}
             { (isBuscando || errorCarga) && ( <div className="flex justify-end"> <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>Cerrar</Button> </div> )}
         </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Helper CSS (opcional)
const styles = `
.input-field { display: block; width: 100%; padding: 0.375rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.input-field:focus { border-color: #4F46E5; outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 2px #C7D2FE; }
.input-field-disabled { display: block; width: 100%; padding: 0.375rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; border: 1px solid #E5E7EB; background-color: #F3F4F6; color: #6B7280; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); cursor: not-allowed; }
`;
// <style>{styles}</style>

