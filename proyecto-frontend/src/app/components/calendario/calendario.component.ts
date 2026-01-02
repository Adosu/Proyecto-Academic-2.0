import { Component, OnInit } from '@angular/core';
import { Recordatorio, RecordatorioService } from '../../services/recordatorio.service';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit {
  recordatoriosPorDia: { [key: string]: Recordatorio[] } = {};
  diasDelMes: Date[] = [];
  mesActual: number = new Date().getMonth();
  anioActual: number = new Date().getFullYear();

  constructor(private recordatorioService: RecordatorioService) { }

  ngOnInit(): void {
    this.cargarDiasDelMes();
    this.cargarRecordatorios();
  }

  cargarDiasDelMes(): void {
    const dias: Date[] = [];
    const primerDia = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDia = new Date(this.anioActual, this.mesActual + 1, 0);

    for (let d = primerDia.getDate(); d <= ultimoDia.getDate(); d++) {
      dias.push(new Date(this.anioActual, this.mesActual, d));
    }

    this.diasDelMes = dias;
  }

  cargarRecordatorios(): void {
    this.recordatorioService.getRecordatorios().subscribe(recordatorios => {
      this.recordatoriosPorDia = {};
      for (const r of recordatorios.filter(r => r.estado === 'Activo')) {
        const fecha = new Date(r.fechaLimite);
        const clave = fecha.toISOString().split('T')[0];
        if (!this.recordatoriosPorDia[clave]) {
          this.recordatoriosPorDia[clave] = [];
        }
        this.recordatoriosPorDia[clave].push(r);
      }
    });
  }

  obtenerRecordatoriosPorFecha(fecha: Date): Recordatorio[] {
    const clave = fecha.toISOString().split('T')[0];
    return this.recordatoriosPorDia[clave] || [];
  }

  getNombreMes(): string {
    const nombres = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return nombres[this.mesActual];
  }

  cambiarMes(delta: number): void {
    const nuevaFecha = new Date(this.anioActual, this.mesActual + delta, 1);
    this.mesActual = nuevaFecha.getMonth();
    this.anioActual = nuevaFecha.getFullYear();
    this.cargarDiasDelMes();
    this.cargarRecordatorios();
  }

  esHoy(dia: Date): boolean {
    const hoy = new Date();
    return dia.getFullYear() === hoy.getFullYear() &&
      dia.getMonth() === hoy.getMonth() &&
      dia.getDate() === hoy.getDate();
  }
}
