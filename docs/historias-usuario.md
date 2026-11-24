# Historias de usuario — Frontend

## Épica: Dashboard

### HU-11 · Ver el resumen del negocio en el dashboard

**Como** administrador
**quiero** ver al entrar cuánto me deben, cuánto vendí y qué compras faltan cobrar
**para** saber cómo va el negocio sin revisar módulo por módulo.

**Criterios de aceptación**
- **Dado** que el back responde, **cuando** entro al dashboard, **entonces** veo saldo por cobrar, ventas del mes, compras pendientes y clientes.
- **Dado** que un valor es 0, **entonces** se muestra `0`, no `—`.
- **Dado** que hay compras pendientes, **entonces** veo 5, de la más antigua a la más reciente.
- **Dado** que no hay pendientes, **entonces** veo "Todo cobrado".
- **Dado** que el back falla, **entonces** veo "No se pudo cargar" y nunca números falsos.
- Veo lo cobrado hoy y los 5 productos más vendidos.

**Qué se creó o cambió** (en `src/app/features/dashboard/`)

| Archivo | Para qué sirve |
|---|---|
| `interfaces/DashboardInterface.ts` (nuevo) | La forma de los datos que llegan del back |
| `services/dashboard.service.ts` (nuevo) | Llama a la API |
| `pages/dashboard/dashboard.ts` | Guarda la respuesta y arma las tarjetas |
| `pages/dashboard/dashboard.html` | Muestra tarjetas, tabla y barras |
| `pages/dashboard/dashboard.spec.ts` | Pruebas, una por criterio |

**Notas técnicas**
- Depende de HU-10 (back): `GET /api/dashboard/resumen`.
- La tabla reutiliza `POST /api/compra/pagination` con `estadoCompra: 'PENDIENTE'`.
- "Cobrado hoy" suma solo pagos de créditos: las ventas al contado no generan pago.

## Épica: Formularios

### HU-12 · Ver el mensaje de cada validación

**Como** vendedor
**quiero** ver debajo de cada campo qué está mal
**para** corregirlo sin adivinar.

**Criterios de aceptación**
- **Dado** un formulario vacío, **cuando** lo guardo, **entonces** cada campo obligatorio muestra su mensaje y no se llama al back.
- **Dado** un dato que no cumple una regla del DTO, **entonces** veo el mensaje de esa regla, no "es obligatorio".
- **Dado** que el back rechaza un campo, **entonces** su mensaje sale debajo de ese campo y se borra al corregirlo.
- **Dado** un error que no es de un campo (ej. compra ya pagada), **entonces** sale dentro del modal.
- Vale para categoría, cliente, compra, pago, permiso, producto, rol, tipo de compra y usuario.

**Qué se creó o cambió** (en `src/app/`)

| Archivo | Para qué sirve |
|---|---|
| `shared/validators/reglas.ts` (nuevo) | Une cada validación con su mensaje |
| `shared/validators/errores-servidor.ts` (nuevo) | Lleva cada error del back a su campo |
| `shared/components/error-campo` (nuevo) | Mensaje debajo de un campo |
| `shared/components/errores-servidor` (nuevo) | Errores generales del modal |
| `features/*/pages/*-list` | Usan lo anterior en sus formularios |
| `shared/validators/formularios.spec.ts` (nuevo) | Prueba todos los formularios |

**Notas técnicas**
- Depende de HU-05 (back): necesita `fieldErrors` en la respuesta 400.
- Los mensajes son los mismos del DTO. Si cambia uno en el back, cambiarlo también aquí.

### HU-14 · Crear después de editar no sobrescribe

**Como** vendedor
**quiero** que "Nuevo" siempre cree un registro
**para** no perder el que edité antes.

**Criterios de aceptación**
- **Dado** que edité o abrí un registro y cerré el modal, **cuando** creo uno nuevo, **entonces** se crea (POST) y el anterior no cambia.

**Qué se cambió**

| Archivo | Para qué sirve |
|---|---|
| `categoria-list`, `permiso-list`, `producto-list`, `rol-list`, `tipo-compra-list` | `cerrarModal()` vuelve a modo "crear" |
| `shared/validators/crear-despues-de-editar.spec.ts` (nuevo) | Lo prueba en 8 módulos |
