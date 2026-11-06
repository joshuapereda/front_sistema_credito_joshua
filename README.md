# Sistema de Crédito — Frontend

Frontend en Angular 22 + Tailwind CSS 4 para el backend `back_sistema_credito_joshua` (Spring Boot, puerto 9600).

> **Regla principal:** la estructura ya está completa. No crees carpetas nuevas: cada cosa tiene su lugar
> definido abajo. Si algo no encaja en ninguna, pregunta antes de inventar una.

## Requisitos

- Node.js 22.22+ o 24.15+ (Angular 22 no funciona con Node 20)
- Backend corriendo en `http://localhost:9600`

## Comandos

```bash
npm install
npm start          # ng serve en http://localhost:4200
npm test           # tests unitarios con vitest
npm run build      # build de producción en dist/
```

## Estructura

```
src/app/
├── core/                         Lo que existe UNA sola vez en toda la app
│   ├── guards/                   auth.guard.ts: protege las rutas internas
│   ├── interceptors/             error.interceptor.ts: muestra los errores HTTP como toast
│   ├── layout/
│   │   ├── main-layout/          encabezado + menú lateral + <router-outlet>
│   │   └── toast-container/      donde se pintan las notificaciones
│   ├── models/                   modelos globales (auth)
│   └── services/                 auth, notificaciones, título de la pestaña
│
├── shared/                       Piezas reutilizables por VARIAS features
│   ├── components/               page-header, empty-state, confirm-dialog
│   ├── directives/               (vacía por ahora)
│   ├── pipes/                    (vacía por ahora)
│   └── validators/               celular-peru.validator.ts
│
├── features/                     Una carpeta por módulo del sistema
│   ├── auth/                     login
│   ├── dashboard/
│   ├── compras/   pagos/   clientes/                 (Ventas)
│   ├── productos/ categorias/ tipos-compra/          (Catálogo)
│   └── usuarios/  roles/   permisos/                 (Seguridad)
│
├── app.config.ts                 providers globales (router, HttpClient, locale es-PE)
├── app.routes.ts                 rutas raíz: cada feature se carga lazy
└── app.ts                        componente raíz
```

### Dentro de cada feature (ejemplo: categorias)

```
features/categorias/
├── categorias.routes.ts          rutas: ''  'nuevo'  ':id/editar'
├── models/categoria.model.ts     Categoria (lo que devuelve el back) y CategoriaRequest (lo que se envía)
├── services/categoria.service.ts listar, obtener, crear, actualizar, eliminar
├── components/                   piezas que SOLO usa esta feature
└── pages/                        una carpeta por pantalla (tiene ruta)
    ├── categoria-list/           tabla con el listado
    └── categoria-form/           formulario de crear y editar (el mismo componente)
```

Todas las features siguen este mismo patrón. `compras` además tiene `pages/compra-detalle/` (ruta `:id`)
y `components/estado-compra-badge/`.

## Dónde va cada cosa

| Necesito...                                          | Va en                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| Una interfaz de un DTO del backend                   | `features/<feature>/models/`                                |
| Llamar a un endpoint                                 | `features/<feature>/services/`                              |
| Una pantalla nueva con ruta                          | `features/<feature>/pages/` + su `.routes.ts`               |
| Un componente que solo usa esa feature               | `features/<feature>/components/`                            |
| Un componente que usan varias features               | `shared/components/`                                        |
| Un pipe, directiva o validador reutilizable          | `shared/pipes/`, `shared/directives/`, `shared/validators/` |
| Algo global que existe una sola vez (sesión, layout) | `core/`                                                     |

Si una feature necesita datos de otra (por ejemplo, el formulario de productos necesita la lista de
categorías), **se importa el service de la otra feature**: `CategoriaService` desde `features/categorias/services/`.
No se duplica.

## Convenciones

- **Todo standalone**, sin `NgModule`. Inyección con `inject()`, no por constructor.
- **Nombres**: archivos en kebab-case sin sufijo (`categoria-list.ts`), clase en PascalCase (`CategoriaList`),
  services terminan en `.service.ts`, modelos en `.model.ts`.
- **Modelos**: `Xxx` para la respuesta del backend y `XxxRequest` para el cuerpo de POST/PUT.
  Respetar los nombres del backend aunque tengan errores (por ejemplo `passwprd` en usuarios).
- **Parámetros de ruta**: llegan como `input()` del componente (`readonly id = input<string>()`),
  gracias a `withComponentInputBinding()`.
- **Estilos**: Tailwind en el HTML y las clases base de `src/styles.css`:
  `btn btn-primary | btn-secondary | btn-danger`, `label`, `input`, `error-text`, `card`, `table`.
  Los componentes no llevan archivo `.css`.
- **Errores HTTP**: los muestra automáticamente `errorInterceptor`. No hace falta `alert()` ni repetir el mensaje,
  pero todo `subscribe` debe tener su `error: () => ...` (aunque sea para quitar un "cargando"); si no,
  Angular lo reporta como error no manejado en la consola.
- **Mensajes de éxito**: `inject(NotificacionService).exito('Categoría guardada')`.
- **Eliminar**: siempre con `<app-confirm-dialog>` antes de llamar a `eliminar()`.
- **Moneda y fechas**: el locale es `es-PE`, así que `{{ total | currency }}` muestra `S/ 1,250.00`
  y `{{ fecha | date: 'short' }}` sale en formato peruano.
- **Formato**: Prettier (`npx prettier --write src`).

## API y proxy

Los services usan `environment.apiUrl` (`/api`). En desarrollo, `proxy.conf.json` redirige `/api` a
`http://localhost:9600`, así que no hace falta configurar CORS en el backend.

## Pendientes conocidos

- **Login (HU-08)**: el backend aún no tiene `/api/auth/login`; `AuthService.estaAutenticado()` siempre devuelve `true`.
- **Pantallas**: listas, formularios y dashboard están creados con su ruta, pero el contenido está marcado con `TODO`.
