/**
 * @file auth.service.ts
 * @description Servicio de autenticación para el sistema de Concesionario de Autos.
 *
 * Gestiona el flujo completo de autenticación JWT:
 * login contra el endpoint ``/usuarios/login``, almacenamiento seguro
 * del token en ``localStorage``, adjunción automática en cabeceras
 * (delegada al ``authInterceptor``), y cierre de sesión.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Payload enviado al endpoint de login.
 *
 * @property nombre_usuario - Nombre de usuario registrado en el sistema.
 * @property contraseña     - Contraseña en texto plano (cifrada en el servidor).
 */
export interface LoginRequest {
  nombre_usuario: string;
  contraseña: string;
}

/**
 * Estructura interna del token retornada por el backend dentro de ``data``.
 *
 * @property access_token - Token JWT de acceso con firma HMAC-SHA256.
 * @property token_type   - Tipo de token (siempre "bearer").
 * @property expires_in   - Tiempo de expiración en segundos.
 * @property rol          - Rol del usuario autenticado.
 */
export interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_usuario: string;
  rol: string;
}

/**
 * Estructura de respuesta homogénea del backend (``success_response``).
 *
 * @property success - Indica éxito o fallo de la operación.
 * @property data    - Payload con el token JWT y metadatos del usuario.
 * @property message - Mensaje descriptivo opcional.
 */
export interface LoginApiResponse {
  success: boolean;
  data: TokenData;
  message: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Clave usada para almacenar el token JWT en ``localStorage``. */
  private readonly TOKEN_KEY = 'access_token';

  /** URL base de la API obtenida desde las variables de entorno. */
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Autentica al usuario contra el backend y almacena el JWT.
   *
   * El endpoint del backend espera ``{ nombre_usuario, contraseña }``
   * y retorna ``{ success, data: { access_token, ... }, message }``.
   *
   * @param credentials - Credenciales del usuario (nombre_usuario + contraseña).
   * @returns Observable que emite la respuesta completa del backend.
   */
  login(credentials: LoginRequest): Observable<LoginApiResponse> {
    return this.http
      .post<LoginApiResponse>(`${this.apiUrl}/usuarios/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.success && response.data?.access_token) {
            localStorage.setItem(this.TOKEN_KEY, response.data.access_token);
          }
        })
      );
  }

  /**
   * Cierra la sesión del usuario eliminando el token del almacenamiento
   * local y redirigiendo a la página de login.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * Recupera el token JWT almacenado en ``localStorage``.
   *
   * @returns El token como string, o ``null`` si no hay sesión activa.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si el usuario tiene una sesión activa.
   *
   * @returns ``true`` si existe un token en ``localStorage``, ``false`` en caso contrario.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}