import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recordatorio, RecordatorioService } from '../../services/recordatorio.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recordatorio',
  standalone: false,
  templateUrl: './recordatorio.component.html',
  styleUrl: './recordatorio.component.css'
})
export class RecordatorioComponent implements OnInit {
  form!: FormGroup;
  modo: 'crear' | 'editar' = 'crear';
  recordatorioOriginal?: Recordatorio;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private recordatorioService: RecordatorioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const estado = history.state;
    this.modo = estado.modo || 'crear';
    this.recordatorioOriginal = estado.recordatorio;

    const fechaFormateada = this.recordatorioOriginal?.fechaLimite
      ? this.transformarFecha(this.recordatorioOriginal.fechaLimite)
      : '';

    this.form = this.fb.group({
      titulo: [this.recordatorioOriginal?.titulo || '', [Validators.required, Validators.minLength(4)]],
      descripcion: [this.recordatorioOriginal?.descripcion || ''],
      fechaLimite: [fechaFormateada, Validators.required],
      hora: [this.recordatorioOriginal?.hora || '', Validators.required],
    });
  }

  transformarFecha(fecha: string): string {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  }

  get f() {
    return this.form.controls;
  }

  guardar(): void {
    if (this.form.invalid) return;

    const data = {
      ...this.form.value,
      idRecordatorio: this.recordatorioOriginal?.idRecordatorio
    };

    const peticion = this.modo === 'crear'
      ? this.recordatorioService.insertarRecordatorio(data)
      : this.recordatorioService.modificarRecordatorio(data);

    peticion.subscribe({
      next: () => {
        this.snackBar.open(
          this.modo === 'crear' ? 'Recordatorio creado exitosamente' : 'Recordatorio actualizado correctamente',
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
        this.router.navigate(['/actividades']);
      },
      error: () => {
        this.snackBar.open('Ocurrió un error al guardar', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/actividades']);
  }
}
