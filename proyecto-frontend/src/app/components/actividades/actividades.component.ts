import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Recordatorio, RecordatorioService } from '../../services/recordatorio.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-actividades',
  standalone: false,
  templateUrl: './actividades.component.html',
  styleUrl: './actividades.component.css'
})
export class ActividadesComponent implements OnInit {
  recordatoriosAgrupados: { [fecha: string]: Recordatorio[] } = {};
  filtroSeleccionado: string = '7';
  menuAbierto: number | null = null;

  constructor(private recordatorioService: RecordatorioService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.cargarRecordatorios();
  }

  aplicarFiltro(): void {
    this.cargarRecordatorios();
  }

  cargarRecordatorios(): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.recordatorioService.getRecordatorios().subscribe(recordatorios => {
      // Filtrar solo activos
      recordatorios = recordatorios.filter(r => r.estado === 'Activo');

      if (this.filtroSeleccionado === '7') {
        const fechaLimite = new Date(hoy);
        fechaLimite.setDate(hoy.getDate() + 7);
        recordatorios = recordatorios.filter(r => {
          const fecha = new Date(r.fechaLimite);
          return fecha >= hoy && fecha <= fechaLimite;
        });
      } else if (this.filtroSeleccionado === '30') {
        const fechaLimite = new Date(hoy);
        fechaLimite.setDate(hoy.getDate() + 30);
        recordatorios = recordatorios.filter(r => {
          const fecha = new Date(r.fechaLimite);
          return fecha >= hoy && fecha <= fechaLimite;
        });
      } else if (this.filtroSeleccionado === 'atrasadas') {
        recordatorios = recordatorios.filter(r => {
          const fecha = new Date(r.fechaLimite);
          return fecha < hoy;
        });
      }

      this.recordatoriosAgrupados = this.agruparPorFecha(recordatorios);
    });
  }

  agruparPorFecha(recordatorios: Recordatorio[]): { [fecha: string]: Recordatorio[] } {
    return recordatorios.reduce((acc, r) => {
      const fecha = r.fechaLimite;
      acc[fecha] = acc[fecha] || [];
      acc[fecha].push(r);
      return acc;
    }, {} as { [fecha: string]: Recordatorio[] });
  }

  get fechasOrdenadas(): string[] {
    return Object.keys(this.recordatoriosAgrupados).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }

  toggleMenu(id: number): void {
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  abrirFormulario(): void {
    this.router.navigate(['/recordatorio'], { state: { modo: 'crear' } });
  }

  modificarRecordatorio(recordatorio: Recordatorio): void {
    this.router.navigate(['/recordatorio'], { state: { modo: 'editar', recordatorio } });
  }

  eliminarRecordatorio(id: number): void {
    this.recordatorioService.eliminarRecordatorio(id).subscribe({
      next: () => {
        this.snackBar.open('Recordatorio eliminado correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });
        this.cargarRecordatorios();
      },
      error: () => {
        this.snackBar.open('Error al eliminar recordatorio', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Si el clic no ocurre dentro de un .menu-opciones o .menu-btn, cierra el menú
    if (!target.closest('.menu-opciones') && !target.closest('.menu-btn')) {
      this.menuAbierto = null;
    }
  }
}