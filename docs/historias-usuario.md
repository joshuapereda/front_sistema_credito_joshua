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
