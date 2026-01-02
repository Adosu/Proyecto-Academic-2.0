import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Materia, MateriaService } from '../../services/materia.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detalle-materia',
  standalone: false,
  templateUrl: './detalle-materia.component.html',
  styleUrl: './detalle-materia.component.css'
})
export class DetalleMateriaComponent implements OnInit {
  materiaSeleccionada?: Materia;
  clave: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materiaService: MateriaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.materiaService.getMaterias().subscribe({
      next: materias => {
        this.materiaSeleccionada = materias.find(m => m.idMateria === id);
        if (!this.materiaSeleccionada) {
          this.snackBar.open('Materia no encontrada', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.router.navigate(['/home']);
        }
      },
      error: err => {
        console.error('Error al cargar detalle:', err);
        this.snackBar.open('Error al cargar la materia', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  inscripcion(): void {
    if (!this.materiaSeleccionada) return;

    this.materiaService.inscribirse(this.materiaSeleccionada.idMateria, this.clave).subscribe({
      next: (res: any) => {
        this.snackBar.open(res.mensaje || 'Inscripción exitosa', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        setTimeout(() => {
          this.router.navigate(['/home']);
        });
      },
      error: (err) => {
        this.snackBar.open(err.error?.mensaje || 'Error en la inscripción', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }
}

