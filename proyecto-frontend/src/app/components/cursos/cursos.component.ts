import { Component, OnInit, ElementRef, HostListener, ViewChildren, QueryList } from '@angular/core';
import { Materia, MateriaService } from '../../services/materia.service';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioMateriaService } from '../../services/usuario-materia.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cursos',
  standalone: false,
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent implements OnInit {
  materias: Materia[] = [];
  nombreUsuario: string = '';
  menuAbierto: number | null = null;

  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  materiaPendiente?: Materia;


  @ViewChildren('dropdownMenu') dropdownMenus!: QueryList<ElementRef>;

  constructor(
    private materiaService: MateriaService,
    private usuarioService: UsuarioService,
    private usuarioMateriaService: UsuarioMateriaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Cargar perfil del usuario
    this.usuarioService.getPerfil().subscribe({
      next: (usuario) => {
        this.nombreUsuario = usuario.nombre + ' ' + usuario.apellido;
      },
      error: (err) => console.error('Error al obtener el perfil:', err)
    });

    // Cargar materias inscritas
    this.cargarMaterias();
  }

  cargarMaterias() {
    this.materiaService.getMisCursos().subscribe({
      next: (data) => this.materias = data,
      error: (err) => console.error('Error al cargar cursos:', err)
    });
  }

  getImagenFondo(materia: Materia): string {
    return `/img/${materia.imagenUrl || 'vacio.jpg'}`;
  }

  toggleMenu(idMateria: number) {
    this.menuAbierto = this.menuAbierto === idMateria ? null : idMateria;
  }

  desinscribirse(materia: Materia) {
    this.materiaPendiente = materia;
    this.modalTitulo = 'Confirmar desinscripción';
    this.modalMensaje = `¿Estás seguro que deseas desinscribirte de "${materia.nombreMateria}"? 
  Todos los apuntes relacionados se perderán.`;
    this.modalVisible = true;
    this.menuAbierto = null;
  }

  irACuadernoVirtual(idMateria: number): void {
    this.router.navigate(['/cuaderno-virtual', idMateria]);
  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.dropdownMenus || this.dropdownMenus.length === 0) {
      return; // Evita error si aún no hay menús cargados
    }

    const clickedInsideAnyMenu = this.dropdownMenus.some(
      (menu) => menu.nativeElement.contains(event.target)
    );

    if (!clickedInsideAnyMenu) {
      this.menuAbierto = null;
    }
  }

  confirmarDesinscripcion(): void {
    if (!this.materiaPendiente) return;

    this.usuarioMateriaService.desinscribirse(this.materiaPendiente.idMateria).subscribe({
      next: () => {
        this.snackBar.open(`Te has desinscrito`, 'Cerrar', {
          duration: 3000
        });
        this.cargarMaterias();
      },
      error: (err) => {
        console.error('Error al desinscribirse:', err);
        this.snackBar.open('Ocurrió un error al desinscribirse', 'Cerrar', {
          duration: 3000
        });
      }
    });

    this.modalVisible = false;
    this.materiaPendiente = undefined;
  }

  cancelarDesinscripcion(): void {
    this.modalVisible = false;
    this.materiaPendiente = undefined;
  }

}