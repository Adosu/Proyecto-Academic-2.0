import { Component, OnInit } from '@angular/core';
import { Materia, MateriaService } from '../../services/materia.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  materias: Materia[] = [];

  constructor(private materiaService: MateriaService, private router: Router) { }

  ngOnInit(): void {
    this.materiaService.getMaterias().subscribe({
      next: (data) => this.materias = data,
      error: (err) => console.error('Error al obtener materias:', err)
    });
  }

  verDetalle(materia: Materia): void {
    this.router.navigate(['/detalle-materia', materia.idMateria]);
  }
}
