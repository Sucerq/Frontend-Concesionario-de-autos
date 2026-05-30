import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Autos ──────────────────────────────────────────────────────────────────
  getAutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/autos`);
  }

  getAuto(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/autos/${id}`);
  }

  createAuto(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/autos`, data);
  }

  updateAuto(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/autos/${id}`, data);
  }

  deleteAuto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/autos/${id}`);
  }

  // ── Clientes ───────────────────────────────────────────────────────────────
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clientes`);
  }

  getCliente(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes/${id}`);
  }

  createCliente(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clientes`, data);
  }

  updateCliente(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/clientes/${id}`, data);
  }

  deleteCliente(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clientes/${id}`);
  }

  // ── Sucursales ─────────────────────────────────────────────────────────────
  getSucursales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sucursales`);
  }

  getSucursal(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sucursales/${id}`);
  }

  createSucursal(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sucursales`, data);
  }

  updateSucursal(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/sucursales/${id}`, data);
  }

  deleteSucursal(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/sucursales/${id}`);
  }
}