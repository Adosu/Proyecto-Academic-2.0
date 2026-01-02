import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto';

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  mostrarNavbar(): boolean {
    const esNavegador = isPlatformBrowser(this.platformId);
    const rutaActual = this.router.url;
    const esRutaPublica = ['/login', '/registro'].includes(rutaActual);

    if (!esNavegador) return false;

    const token = localStorage.getItem('token');
    return !!token && !esRutaPublica;
  }
}
