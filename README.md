# Frontend — Concesionario de Autos

Aplicación web desarrollada con **Angular 20** y **Angular Material** que
consume la API REST del backend del Concesionario de Autos. Permite
autenticarse con JWT y realizar operaciones CRUD sobre las entidades
principales del dominio.

---

## Video explicativo

> 🎥 **[Ver video en YouTube / Drive](https://youtu.be/ENLACE_PENDIENTE)**
>
> El video muestra: arranque del backend y frontend, flujo de login,
> demostración de CRUD en Autos y Clientes, y uso del token JWT en las
> peticiones HTTP.

---

## Repositorios

| Componente | URL |
|---|---|
| **Frontend** (este repo) | https://github.com/Sucerq/Frontend-Concesionario-de-autos |
| **Backend** (API REST) | https://github.com/AndresT32/Consecionario-de-Autos |

---

## Prerrequisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18.x o superior |
| npm | 9.x o superior |
| Angular CLI | 20.x (`npm install -g @angular/cli`) |

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Sucerq/Frontend-Concesionario-de-autos.git
cd Frontend-Concesionario-de-autos

# 2. Instalar dependencias
npm install
```

---

## Configuración

La URL base de la API se configura en:

```
src/environments/environment.ts          ← desarrollo local
src/environments/environment.prod.ts    ← producción
```

Ejemplo `environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000',   // ← URL del backend FastAPI
};
```

Si el backend corre en un host diferente, actualiza `apiUrl` antes de
ejecutar la aplicación.

---

## Ejecución en desarrollo

```bash
npm start
# ó equivalentemente:
ng serve
```

La aplicación quedará disponible en **http://localhost:4200**.

> El backend debe estar corriendo en `http://127.0.0.1:8000` (o el host
> configurado en `environment.ts`) para que las peticiones funcionen.

---

## Credenciales de prueba

Una vez ejecutado el script `create_test_user.py` del backend:

| Campo | Valor |
|---|---|
| Usuario | `admin` |
| Contraseña | `Admin1234!` |

---

## Funcionalidades implementadas

| Módulo | Ruta | Operaciones |
|---|---|---|
| Login | `/login` | Autenticación JWT |
| Autos | `/autos` | Listar, Crear, Editar, Eliminar |
| Clientes | `/clientes` | Listar, Crear, Editar, Eliminar |

### Características técnicas

- **Autenticación JWT**: token almacenado en `localStorage`, adjuntado
  automáticamente en cada petición HTTP mediante `authInterceptor`.
- **Rutas protegidas**: `authGuard` redirige a `/login` si no hay sesión
  activa.
- **Lazy-loading**: todos los componentes de página se cargan bajo demanda.
- **Formularios reactivos**: validaciones en tiempo real con Angular
  `ReactiveFormsModule`.
- **Feedback visual**: notificaciones con `MatSnackBar` para éxito y error.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts          # Protección de rutas
│   ├── interceptors/
│   │   └── auth.interceptor.ts    # Adjunta Bearer token
│   ├── pages/
│   │   ├── login/                 # Formulario de login
│   │   ├── dashboard/             # Layout con sidenav
│   │   ├── autos/                 # CRUD de autos
│   │   └── clientes/              # CRUD de clientes
│   ├── services/
│   │   ├── auth.service.ts        # Lógica de autenticación
│   │   └── api.service.ts         # Llamadas HTTP a la API
│   ├── app.routes.ts              # Definición de rutas
│   └── app.config.ts              # Configuración global
└── environments/
    ├── environment.ts             # Variables de entorno (dev)
    └── environment.prod.ts        # Variables de entorno (prod)
```

---

## CORS

El backend tiene CORS configurado para aceptar peticiones desde
`http://localhost:4200` (y otros orígenes) mediante la variable de
entorno `CORS_ORIGINS` definida en el archivo `.env` del backend.
Consulta el `README` del repositorio backend para más detalles.
