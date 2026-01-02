import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  standalone: false,
  templateUrl: './modal-confirmacion.component.html',
  styleUrl: './modal-confirmacion.component.css'
})
export class ModalConfirmacionComponent {
  @Input() visible: boolean = false;
  @Input() mensaje: string = '¿Estás seguro que deseas continuar?';
  @Input() titulo: string = 'Confirmación';

  @Output() aceptar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  confirmar(): void {
    this.aceptar.emit();
  }

  cerrar(): void {
    this.cancelar.emit();
  }

  // ✅ Captura de teclas cuando el modal está activo
  @HostListener('document:keydown', ['$event'])
  manejarTeclas(event: KeyboardEvent): void {
    if (!this.visible) return;

    if (event.key === 'Enter') {
      event.preventDefault();
      this.confirmar();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cerrar();
    }
  }
}