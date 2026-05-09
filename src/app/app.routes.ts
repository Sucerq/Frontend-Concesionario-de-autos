/**
 * @file app.routes.ts
 * @description Configuración de rutas de la aplicación Angular del Concesionario de Autos.
 *
 * Define la estructura de navegación:
 *  - ``/login``    → LoginComponent (acceso público).
 *  - ``/``         → DashboardComponent (protegido por ``authGuard``).
 *    - ``/autos``    → AutosComponent  (gestión CRUD de autos).
 *    - ``/clientes`` → ClientesComponent (gestión CRUD de clientes).
 *  - ``/**``       → redirige a ``/login``.
 *
 * Todas las rutas anidadas bajo ``/`` requieren sesión JWT activa.
 * Los componentes se cargan de forma diferida (lazy-loading) para
 * optimizar el tiempo de carga inicial.
 */

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    // Ruta de acceso público: formulario de login.
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    // Ruta raíz protegida: dashboard con sidenav.
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      {
        // Módulo de gestión de autos (CRUD completo).
        path: 'autos',
        loadComponent: () =>
          import('./pages/autos/autos.component').then(
            (m) => m.AutosComponent
          ),
      },
      {
        // Módulo de gestión de clientes (CRUD completo).
        path: 'clientes',
        loadComponent: () =>
          import('./pages/clientes/clientes.component').then(
            (m) => m.ClientesComponent
          ),
      },
      {
        // Redirección por defecto al módulo de autos.
        path: '',
        redirectTo: 'autos',
        pathMatch: 'full',
      },
    ],
  },
  {
    // Captura todas las rutas no definidas y redirige al login.
    path: '**',
    redirectTo: 'login',
  },
];