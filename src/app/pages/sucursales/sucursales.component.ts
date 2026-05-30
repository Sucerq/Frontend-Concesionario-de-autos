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
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';

interface Sucursal {
  id_Sucursal: string;
  Nombre: string;
  Telefono: string;
  Direccion: string;
}

@Component({
  selector: 'app-sucursales',
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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './sucursales.component.html',
  styleUrl: './sucursales.component.scss',
})
export class SucursalesComponent implements OnInit {
  displayedColumns: string[] = ['Nombre', 'Telefono', 'Direccion', 'acciones'];
  sucursales: Sucursal[] = [];
  cargando = false;
  mostrarFormulario = false;
  sucursalEnEdicion: string | null = null;
  form: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      Nombre: ['', [Validators.required]],
      Telefono: ['', [Validators.required]],
      Direccion: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarSucursales();
  }

  private _notificar(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3500,
      panelClass: tipo === 'success' ? 'snack-success' : 'snack-error',
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  cargarSucursales(): void {
    this.cargando = true;
    this.apiService.getSucursales().subscribe({
      next: (data) => {
        this.sucursales = data as Sucursal[];
        this.cargando = false;
      },
      error: () => {
        this._notificar('Error al cargar las sucursales.', 'error');
        this.cargando = false;
      },
    });
  }

  abrirFormularioCrear(): void {
    this.sucursalEnEdicion = null;
    this.form.reset();
    this.mostrarFormulario = true;
  }

  abrirFormularioEditar(sucursal: Sucursal): void {
    this.sucursalEnEdicion = sucursal.id_Sucursal;
    this.form.patchValue({
      Nombre: sucursal.Nombre,
      Telefono: sucursal.Telefono,
      Direccion: sucursal.Direccion,
    });
    this.mostrarFormulario = true;
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.sucursalEnEdicion = null;
    this.form.reset();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const datos = this.form.value;

    if (this.sucursalEnEdicion) {
      this.apiService.updateSucursal(this.sucursalEnEdicion, datos).subscribe({
        next: () => {
          this._notificar('Sucursal actualizada correctamente.', 'success');
          this.cancelar();
          this.cargarSucursales();
        },
        error: () => this._notificar('Error al actualizar la sucursal.', 'error'),
      });
    } else {
      this.apiService.createSucursal(datos).subscribe({
        next: () => {
          this._notificar('Sucursal creada exitosamente.', 'success');
          this.cancelar();
          this.cargarSucursales();
        },
        error: (err) => {
          const detalle = err?.error?.detail ?? 'Error al crear la sucursal.';
          this._notificar(detalle, 'error');
        },
      });
    }
  }

  eliminar(sucursal: Sucursal): void {
    const confirmar = window.confirm(
      `¿Eliminar la sucursal ${sucursal.Nombre}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    this.apiService.deleteSucursal(sucursal.id_Sucursal).subscribe({
      next: () => {
        this._notificar('Sucursal eliminada.', 'success');
        this.cargarSucursales();
      },
      error: () => this._notificar('Error al eliminar la sucursal.', 'error'),
    });
  }
}
