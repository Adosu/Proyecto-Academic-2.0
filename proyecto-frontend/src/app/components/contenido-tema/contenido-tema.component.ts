import { Component, Input, OnInit, AfterViewChecked, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { Contenido, ContenidoService } from '../../services/contenido.service';
import { Tema } from '../../services/tema.service';

@Component({
  selector: 'app-contenido-tema',
  standalone: false,
  templateUrl: './contenido-tema.component.html',
  styleUrl: './contenido-tema.component.css'
})
export class ContenidoTemaComponent implements OnInit, AfterViewChecked {
  @Input() tema!: Tema;
  @Input() modoLectura: boolean = true;
  contenidos: Contenido[] = [];
  nuevoContenido: string = '';
  mostrarNuevo = false;

  editandoId: number | null = null;
  textoTemporal: string = '';
  inputFocused: boolean = false;

  modalVisible: boolean = false;
  modalTitulo: string = '';
  modalMensaje: string = '';
  contenidoPendiente?: Contenido;

  @ViewChildren('inputEditarContenido') inputsEditar!: QueryList<ElementRef>;
  @ViewChild('nuevoContenidoInput') nuevoContenidoInput!: ElementRef;

  constructor(private contenidoService: ContenidoService) { }

  ngOnInit(): void {
    if (this.tema?.idTema) {
      this.cargarContenidos();
    }
  }

  ngAfterViewChecked(): void {
    if (this.editandoId !== null && !this.inputFocused) {
      setTimeout(() => {
        const textareaEl = this.inputsEditar?.find(
          el => (el.nativeElement as HTMLTextAreaElement).value === this.textoTemporal
        );
        if (textareaEl?.nativeElement) {
          const el = textareaEl.nativeElement as HTMLTextAreaElement;
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
          this.inputFocused = true;
        }
      }, 0);
    }

    if (this.mostrarNuevo && this.nuevoContenidoInput?.nativeElement) {
      setTimeout(() => {
        this.nuevoContenidoInput?.nativeElement?.focus();
      }, 0);
    }
  }

  cargarContenidos(): void {
    this.contenidoService.listarContenidos(this.tema.idTema).subscribe({
      next: (data) => this.contenidos = data,
      error: (err) => console.error('Error al cargar contenidos:', err)
    });
  }

  mostrarInputNuevo(): void {
    if (!this.modoLectura) {
      this.mostrarNuevo = true;
      this.nuevoContenido = '';
    }
  }

  agregarContenido(): void {
    const texto = this.nuevoContenido.trim();
    if (!texto) {
      this.cancelarNuevoContenido();
      return;
    }

    const nuevo: Partial<Contenido> = {
      idTema: this.tema.idTema,
      texto
    };

    this.contenidoService.insertarContenido(nuevo).subscribe({
      next: (contenido) => {
        this.contenidos.push(contenido);
        this.nuevoContenido = '';
        this.mostrarNuevo = false;
      },
      error: (err) => console.error('Error al insertar contenido:', err)
    });
  }

  cancelarNuevoContenido(): void {
    this.nuevoContenido = '';
    this.mostrarNuevo = false;
  }

  eliminarContenido(idContenido: number): void {
    const contenido = this.contenidos.find(c => c.idContenido === idContenido);
    if (!contenido) return;

    this.contenidoPendiente = contenido;
    this.modalTitulo = 'Confirmar eliminación';
    this.modalMensaje = '¿Deseas eliminar este contenido? Esta acción no se puede deshacer.';
    this.modalVisible = true;
  }

  confirmarEliminacionContenido(): void {
    if (!this.contenidoPendiente) return;

    this.contenidoService.eliminarContenido(this.contenidoPendiente.idContenido).subscribe({
      next: () => {
        this.contenidos = this.contenidos.filter(c => c.idContenido !== this.contenidoPendiente?.idContenido);
        this.contenidoPendiente = undefined;
        this.modalVisible = false;
      },
      error: err => console.error('Error al eliminar contenido:', err)
    });
  }

  cancelarEliminacionContenido(): void {
    this.modalVisible = false;
    this.contenidoPendiente = undefined;
  }

  habilitarEdicion(c: Contenido): void {
    if (!this.modoLectura) {
      this.editandoId = c.idContenido;
      this.textoTemporal = c.texto;
      this.inputFocused = false;
    }
  }

  guardarEdicion(c: Contenido): void {
    const texto = this.textoTemporal.trim();
    if (!texto) return;

    const actualizado = { ...c, texto };

    this.contenidoService.modificarContenido(actualizado).subscribe({
      next: () => {
        c.texto = texto;
        this.editandoId = null;
      },
      error: (err) => console.error('Error al modificar contenido:', err)
    });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
  }

  detectarTecla(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.agregarContenido();
    } else if (event.key === 'Escape') {
      this.cancelarNuevoContenido();
    }
  }

  blurNuevoContenido(): void {
    const texto = this.nuevoContenido.trim();
    if (texto) {
      this.agregarContenido();
    } else {
      this.cancelarNuevoContenido();
    }
  }

  detectarTeclaEdicion(event: KeyboardEvent, contenido: Contenido): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.guardarEdicion(contenido);
    } else if (event.key === 'Escape') {
      this.cancelarEdicion();
    }
  }

  ajustarAlturaTextarea(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto'; // reset altura
    textarea.style.height = textarea.scrollHeight + 'px'; // altura real del contenido
  }
}
