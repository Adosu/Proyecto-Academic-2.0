import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-nabvar',
  standalone: false,
  templateUrl: './nabvar.component.html',
  styleUrls: ['./nabvar.component.css']
})
export class NabvarComponent implements OnInit {
  usuario: Usuario | null = null;
  menuAbierto: boolean = false;

  @ViewChild('menuDropdown', { static: false }) menuDropdownRef!: ElementRef;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.usuarioService.getPerfil().subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
      }
    });
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickDentroMenu = this.menuDropdownRef?.nativeElement.contains(event.target);
    if (!clickDentroMenu) {
      this.menuAbierto = false;
    }
  }

  getIniciales(nombre: string, apellido: string): string {
    const iniNombre = nombre?.trim().charAt(0).toUpperCase() || '';
    const iniApellido = apellido?.trim().charAt(0).toUpperCase() || '';
    return iniNombre + iniApellido;
  }

  irAPerfil() {
    this.router.navigate(['/perfil']);
  }

  irARecordatorios() {
    this.router.navigate(['/actividades']);
  }

  irACalendario() {
    this.router.navigate(['/calendario']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}