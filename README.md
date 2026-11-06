# Sistema de Crédito — Frontend

Frontend en Angular 22 + Tailwind CSS 4 para el backend `back_sistema_credito_joshua` (Spring Boot, puerto 9600).

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
src/
├── app/
│   ├── core/                     # Lo que existe una sola vez en toda la app
│   │   ├── layout/main-layout/   # Encabezado + menú lateral + <router-outlet>
│   │   └── services/             # Servicios globales (auth, etc.)
│   ├── features/                 # Un módulo funcional por carpeta
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   └── pages/login/
│   │   ├── dashboard/
│   │   ├── categorias/
│   │   │   ├── categorias.routes.ts
│   │   │   └── pages/categoria-list/
│   │   └── productos/
│   ├── app.config.ts             # Providers globales (router, HttpClient)
│   ├── app.routes.ts             # Rutas raíz: cada feature se carga lazy
│   └── app.ts                    # Componente raíz
├── environments/                 # apiUrl por entorno
└── styles.css                    # Estilos globales (Tailwind)
```

## Convenciones

- **Todo standalone**, sin `NgModule`.
- **Una carpeta por feature** dentro de `features/`, con su propio `xxx.routes.ts`. Dentro de cada feature:
  - `pages/` componentes que son una pantalla (tienen ruta).
  - `components/` piezas reutilizables solo dentro de esa feature.
  - `services/` llamadas HTTP de la feature (`categoria.service.ts`).
  - `models/` interfaces que reflejan los DTOs del backend (`categoria.model.ts`).
- Si algo se reutiliza en varias features, va a `shared/` (crear la carpeta cuando haga falta).
- Para agregar un módulo nuevo: crear `features/<nombre>/`, su `<nombre>.routes.ts`, registrarlo en `app.routes.ts` y agregarlo al `menu` de `main-layout.ts`.
- Estilos con clases de Tailwind en el HTML; los componentes no llevan archivo `.css` (`ng generate` ya está configurado así).
- Inyección con `inject()`, no por constructor.
- Archivos con nombre en kebab-case sin sufijo: `categoria-list.ts`, clase `CategoriaList`.

## API y proxy

Los servicios usan `environment.apiUrl` (`/api`). En desarrollo, `proxy.conf.json` redirige `/api` a `http://localhost:9600`, así que no hace falta configurar CORS en el backend.
