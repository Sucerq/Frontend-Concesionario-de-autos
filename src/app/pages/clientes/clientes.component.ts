/**
 * @file clientes.component.ts
 * @description Componente para la gestión CRUD de la entidad Cliente.
 *
 * Presenta una tabla interactiva con Angular Material que consume los
 * endpoints ``/clientes`` del backend. Permite listar, crear, editar y
 * eliminar clientes mediante un panel de formulario inline y
 * retroalimentación visual con ``MatSnackBar``.
 *
 * Requiere autenticación JWT (adjuntada automáticamente por
 * ``authInterceptor``) para todas las operaciones de escritura.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';

// ── Interfaz local del modelo Cliente (refleja ClienteResponse del backend) ──

/**
 * Representa un cliente tal como lo retorna la API.
 *
 * @property id_Cliente   - Identificador UUID del cliente.
 * @property nombre       - Nombre del cliente.
 * @property Apellido     - Apellido del cliente.
 * @property email        - Correo electrónico único.
 * @property telefono     - Teléfono de contacto (opcional).
 * @property Direccion    - Dirección postal (opcional).
 * @property Tipo_Cliente - Categoría del cliente (ej. 'Natural', 'Jurídico').
 */
interface Cliente {
  id_Cliente: string;
  nombre: string;
  Apellido: string;
  email: string;
  telefono: string | null;
  Direccion: string | null;
  Tipo_Cliente: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss',
})
export class ClientesComponent implements OnInit {
  /** Columnas visibles de la tabla Material. */
  displayedColumns: string[] = [
    'nombre',
    'Apellido',
    'email',
    'telefono',
    'Tipo_Cliente',
    'acciones',
  ];

  /** Lista de clientes cargada desde el backend. */
  clientes: Cliente[] = [];

  /** Controla el spinner de carga de la tabla. */
  cargando = false;

  /** Controla la visibilidad del panel de formulario. */
  mostrarFormulario = false;

  /** ID del cliente en edición; ``null`` cuando se está creando. */
  clienteEnEdicion: string | null = null;

  /** Formulario reactivo para creación y edición de clientes. */
  form: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this._construirFormulario();
  }

  /** Hook de inicialización: carga la lista de clientes al montar el componente. */
  ngOnInit(): void {
    this.cargarClientes();
  }

  // ── Métodos privados ────────────────────────────────────────────────────────

  /**
   * Construye el ``FormGroup`` con las validaciones de la entidad Cliente.
   *
   * @returns FormGroup con campos nombre, Apellido, email, telefono,
   *   Direccion y Tipo_Cliente.
   */
  private _construirFormulario(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      Apellido: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.maxLength(20)],
      Direccion: ['', Validators.maxLength(200)],
      Tipo_Cliente: ['', Validators.required],
    });
  }

  /**
   * Muestra un snack-bar con el mensaje indicado.
   *
   * @param mensaje - Texto a mostrar al usuario.
   * @param tipo    - Clase CSS: 'success' | 'error'.
   */
  private _notificar(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3500,
      panelClass: tipo === 'success' ? 'snack-success' : 'snack-error',
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  // ── Métodos públicos ────────────────────────────────────────────────────────

  /**
   * Carga la lista completa de clientes desde el endpoint ``GET /clientes/``.
   * Actualiza la propiedad ``clientes`` y controla el estado de carga.
   */
  cargarClientes(): void {
    this.cargando = true;
    this.apiService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data as Cliente[];
        this.cargando = false;
      },
      error: () => {
        this._notificar('Error al cargar los clientes.', 'error');
        this.cargando = false;
      },
    });
  }

  /**
   * Abre el panel de formulario en modo creación con todos los campos vacíos.
   */
  abrirFormularioCrear(): void {
    this.clienteEnEdicion = null;
    this.form.reset();
    this.mostrarFormulario = true;
  }

  /**
   * Abre el panel de formulario pre-poblado con los datos del cliente a editar.
   *
   * @param cliente - Objeto Cliente cuyos datos se cargarán en el formulario.
   */
  abrirFormularioEditar(cliente: Cliente): void {
    this.clienteEnEdicion = cliente.id_Cliente;
    this.form.patchValue({
      nombre: cliente.nombre,
      Apellido: cliente.Apellido,
      email: cliente.email,
      telefono: cliente.telefono ?? '',
      Direccion: cliente.Direccion ?? '',
      Tipo_Cliente: cliente.Tipo_Cliente,
    });
    this.mostrarFormulario = true;
  }

  /** Cierra el panel de formulario y limpia el estado de edición. */
  cancelar(): void {
    this.mostrarFormulario = false;
    this.clienteEnEdicion = null;
    this.form.reset();
  }

  /**
   * Envía el formulario al backend.
   *
   * - Si ``clienteEnEdicion`` tiene valor → ``PUT /clientes/{id}``.
   * - Si es ``null`` → ``POST /clientes/``.
   *
   * Tras la operación, recarga la tabla y cierra el formulario.
   */
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const datos = this.form.value;

    if (this.clienteEnEdicion) {
      this.apiService.updateCliente(this.clienteEnEdicion, datos).subscribe({
        next: () => {
          this._notificar('Cliente actualizado correctamente.', 'success');
          this.cancelar();
          this.cargarClientes();
        },
        error: () => this._notificar('Error al actualizar el cliente.', 'error'),
      });
    } else {
      this.apiService.createCliente(datos).subscribe({
        next: () => {
          this._notificar('Cliente creado exitosamente.', 'success');
          this.cancelar();
          this.cargarClientes();
        },
        error: (err) => {
          const detalle = err?.error?.detail ?? 'Error al crear el cliente.';
          this._notificar(detalle, 'error');
        },
      });
    }
  }

  /**
   * Elimina un cliente previa confirmación del usuario.
   *
   * @param cliente - Objeto Cliente a eliminar.
   */
  eliminar(cliente: Cliente): void {
    const confirmar = window.confirm(
      `¿Eliminar al cliente ${cliente.nombre} ${cliente.Apellido}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    this.apiService.deleteCliente(cliente.id_Cliente).subscribe({
      next: () => {
        this._notificar('Cliente eliminado.', 'success');
        this.cargarClientes();
      },
      error: () => this._notificar('Error al eliminar el cliente.', 'error'),
    });
  }
}
