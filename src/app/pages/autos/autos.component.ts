/**
 * @file autos.component.ts
 * @description Componente para la gestión CRUD de la entidad Auto.
 *
 * Presenta una tabla interactiva con Angular Material que consume los
 * endpoints ``/autos`` del backend. Permite listar, crear, editar y
 * eliminar autos mediante diálogos modales y retroalimentación visual
 * con snack-bar.
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../services/api.service';

// ── Interfaz local del modelo Auto (refleja AutoResponse del backend) ─────────

/**
 * Representa un auto tal como lo retorna la API.
 *
 * @property id_Auto         - Identificador UUID del auto.
 * @property Marca           - Marca del vehículo (ej. 'Toyota').
 * @property Modelo          - Modelo del vehículo (ej. 'Corolla').
 * @property Tipo_Auto       - Tipo de carrocería (ej. 'Sedán').
 * @property Precio          - Precio en moneda local.
 * @property Estado          - ``true`` si está disponible para venta.
 * @property fecha_creacion  - Fecha de registro en el sistema.
 * @property id_Sucursal     - UUID de la sucursal asignada.
 * @property id_Compra       - UUID de la compra de adquisición.
 */
interface Auto {
  id_Auto: string;
  Marca: string;
  Modelo: string;
  Tipo_Auto: string;
  Precio: number;
  Estado: boolean;
  fecha_creacion: string;
  id_Sucursal: string;
  id_Compra: string;
}

@Component({
  selector: 'app-autos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './autos.component.html',
  styleUrl: './autos.component.scss',
})
export class AutosComponent implements OnInit {
  /** Columnas visibles de la tabla Material. */
  displayedColumns: string[] = [
    'Marca',
    'Modelo',
    'Tipo_Auto',
    'Precio',
    'Estado',
    'acciones',
  ];

  /** Lista de autos cargada desde el backend. */
  autos: Auto[] = [];

  /** Controla el spinner de carga de la tabla. */
  cargando = false;

  /** Controla la visibilidad del panel de formulario. */
  mostrarFormulario = false;

  /** ID del auto en edición; ``null`` cuando se está creando. */
  autoEnEdicion: string | null = null;

  /** Formulario reactivo para creación y edición de autos. */
  form: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this._construirFormulario();
  }

  /** Hook de inicialización: carga la lista de autos al montar el componente. */
  ngOnInit(): void {
    this.cargarAutos();
  }

  // ── Métodos privados ────────────────────────────────────────────────────────

  /**
   * Construye el ``FormGroup`` con las validaciones necesarias.
   *
   * @returns FormGroup con campos Marca, Modelo, Tipo_Auto y Precio.
   */
  private _construirFormulario(): FormGroup {
  return this.fb.group({
    Marca: ['', [Validators.required]],
    Modelo: ['', [Validators.required]],
    Tipo_Auto: ['', [Validators.required]],
    Precio: [null, [Validators.required]],
    Estado: [true],

    id_Sucursal: ['', Validators.required],
    id_Compra: ['', Validators.required],
  });
}

  /**
   * Muestra un snack-bar con el mensaje indicado.
   *
   * @param mensaje - Texto a mostrar al usuario.
   * @param tipo    - Clase CSS de estilo: 'success' | 'error'.
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
   * Carga la lista completa de autos desde el endpoint ``GET /autos/``.
   * Actualiza la propiedad ``autos`` y controla el estado de carga.
   */
  cargarAutos(): void {
    this.cargando = true;
    this.apiService.getAutos().subscribe({
      next: (data) => {
        this.autos = data as Auto[];
        this.cargando = false;
      },
      error: () => {
        this._notificar('Error al cargar los autos.', 'error');
        this.cargando = false;
      },
    });
  }

  /**
   * Abre el panel de formulario en modo creación con todos los campos vacíos.
   */
  abrirFormularioCrear(): void {
    this.autoEnEdicion = null;
    this.form.reset({ Estado: true });
    this.mostrarFormulario = true;
  }

  /**
   * Abre el panel de formulario pre-poblado con los datos del auto a editar.
   *
   * @param auto - Objeto Auto cuyos datos se cargarán en el formulario.
   */
  abrirFormularioEditar(auto: Auto): void {
    this.autoEnEdicion = auto.id_Auto;
    this.form.patchValue({
      Marca: auto.Marca,
      Modelo: auto.Modelo,
      Tipo_Auto: auto.Tipo_Auto,
      Precio: auto.Precio,
      Estado: auto.Estado,
    });
    this.mostrarFormulario = true;
  }

  /** Cierra el panel de formulario y limpia el estado de edición. */
  cancelar(): void {
    this.mostrarFormulario = false;
    this.autoEnEdicion = null;
    this.form.reset({ Estado: true });
  }

  /**
   * Envía el formulario al backend.
   *
   * - Si ``autoEnEdicion`` tiene valor → llama a ``PUT /autos/{id}``.
   * - Si es ``null`` → llama a ``POST /autos/``.
   *
   * Tras la operación, recarga la tabla y cierra el formulario.
   */
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
const idUsuario = usuario.id_usuario;

const datos = {
  ...this.form.value,
  id_usuario_crea: idUsuario,
};

    if (this.autoEnEdicion) {
      // Modo edición
      this.apiService.updateAuto(this.autoEnEdicion, datos).subscribe({
        next: () => {
          this._notificar('Auto actualizado correctamente.', 'success');
          this.cancelar();
          this.cargarAutos();
        },
        error: () => this._notificar('Error al actualizar el auto.', 'error'),
      });
    } else {
      // Modo creación
      this.apiService.createAuto(datos).subscribe({
        next: () => {
          this._notificar('Auto creado exitosamente.', 'success');
          this.cancelar();
          this.cargarAutos();
        },
        error: (err) => {
          const detalle = err?.error?.detail ?? 'Error al crear el auto.';
          this._notificar(detalle, 'error');
        },
      });
    }
  }

  /**
   * Elimina un auto previa confirmación del usuario.
   *
   * @param auto - Objeto Auto a eliminar.
   */
  eliminar(auto: Auto): void {
    const confirmar = window.confirm(
      `¿Eliminar el auto ${auto.Marca} ${auto.Modelo}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    this.apiService.deleteAuto(auto.id_Auto).subscribe({
      next: () => {
        this._notificar('Auto eliminado.', 'success');
        this.cargarAutos();
      },
      error: () => this._notificar('Error al eliminar el auto.', 'error'),
    });
  }
}
