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

### HU-15 · Un solo diseño de errores y editar pagos

**Como** vendedor
**quiero** ver los errores con el mismo diseño en todos los formularios y poder editar un pago
**para** reconocerlos rápido y corregir un monto mal escrito.

**Criterios de aceptación**
- **Dado** un error en cualquier formulario, **entonces** sale en el mismo recuadro rojo.
- **Dado** un modal más alto que la pantalla, **entonces** se desplaza y Guardar queda a la vista.
- **Dado** un pago, **cuando** hago clic en el lápiz, **entonces** se abre "Editar pago" con sus datos y puedo guardar.

**Qué se cambió**

| Archivo | Para qué sirve |
|---|---|
| `shared/components/errores-servidor` | El recuadro rojo, único diseño |
| `shared/components/error-campo` | Usa ese recuadro en cada campo |
| `styles.css` | El contenido del modal se desplaza |
| `clientes` y `pagos` (html) | Campo en rojo igual que los demás |
| `pago-list.ts` | `funEditarPago()` ahora abre el modal |
| `pago-list.spec.ts` | Prueba el lápiz de editar |

### HU-16 · Aviso al crear y editar, y botón Actualizar

**Como** vendedor
**quiero** ver un aviso cuando se guarda un registro y saber si estoy creando o editando
**para** tener la seguridad de que el cambio se hizo.

**Criterios de aceptación**
- **Dado** que creo un registro, **entonces** veo el aviso verde "... registrado".
- **Dado** que edito un registro, **entonces** veo el aviso verde "... actualizado".
- **Dado** que el back rechaza el cambio, **entonces** no sale el aviso y el formulario sigue abierto.
- **Dado** que edito, **entonces** el título dice "Editar" y el botón "Actualizar". Al crear dicen "Nuevo" y "Guardar".

**Qué se cambió**

| Archivo | Para qué sirve |
|---|---|
| `features/*/pages/*-list` (9 módulos) | `mostrarExito()` abre el aviso; título y botón cambian |
| `shared/components/aviso-dialog/avisos-guardar.spec.ts` (nuevo) | Prueba crear y editar en todos |

**Notas técnicas**
- Se reutiliza `app-aviso-dialog`, el mismo modal de eliminar.

## Épica: Diseño

### HU-18 · Menú con los colores de la empresa

**Como** dueño de Valentino
**quiero** que el menú use los colores del login
**para** que todo el sistema se vea de la misma marca.

**Criterios de aceptación**
- El menú es negro, con el nombre de la empresa en fucsia.
- **Dado** que estoy en una opción, **entonces** solo esa se marca en fucsia, con su ícono.
- El verde neón se usa solo en detalles pequeños.
- **Dado** que uso celular, **entonces** el menú se abre con el botón y se cierra al elegir.
- El contenido central (tablas y formularios) no cambia.

**Qué se cambió**

| Archivo | Para qué sirve |
|---|---|
| `core/layout/main-layout/main-layout.html` | Diseño del menú y la barra superior |
| `core/layout/main-layout/main-layout.ts` | Un ícono por cada opción |
| `styles.css` | Colores `marca`, `marca-verde` y `noche` |
| `core/layout/main-layout/main-layout.spec.ts` (nuevo) | Pruebas del menú |

### HU-19 · Modo día y modo noche

**Como** vendedor
**quiero** elegir entre un modo claro suave y uno oscuro
**para** que la pantalla no me canse la vista, sobre todo de noche.

**Criterios de aceptación**
- **Dado** el modo día, **entonces** el centro no es blanco puro y el menú es suave, con el fucsia de la empresa.
- **Dado** que hago clic en la luna o el sol, **entonces** cambia todo: menú, tablas, modales y avisos.
- **Dado** que cierro y vuelvo a entrar, **entonces** se mantiene el modo que elegí.
- **Dado** cualquiera de los dos modos, **entonces** los textos se leen bien.
- El login y el ticket impreso no cambian.

**Qué se cambió** (reemplaza los colores de HU-18)

| Archivo | Para qué sirve |
|---|---|
| `src/tema.css` (nuevo) | Los colores de día y de noche, en un solo lugar |
| `core/services/tema.service.ts` (nuevo) | Cambia el modo y lo recuerda |
| `core/layout/main-layout` | Botón día / noche y menú más suave |
| `styles.css` | Carga el tema |
| `dashboard.html` | Los montos ya no se parten en dos líneas |
