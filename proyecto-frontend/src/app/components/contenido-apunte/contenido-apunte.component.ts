import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChildren, QueryList, ElementRef, AfterViewChecked, ViewChild } from '@angular/core';
import { Tema, TemaService } from '../../services/tema.service';
import { Apunte } from '../../services/apunte.service';

@Component({
  selector: 'app-contenido-apunte',
  standalone: false,
  templateUrl: './contenido-apunte.component.html',
  styleUrl: './contenido-apunte.component.css'
})
export class ContenidoApunteComponent implements OnInit, OnChanges, AfterViewChecked {
  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  temaPendiente?: Tema;
  modoLectura: boolean = true;

  @Input() apunte!: Apunte;

  temas: Tema[] = [];
  nuevoTema: string = '';

  editandoId: number | null = null;
  nombreTemporal: string = '';
  nuevoSubtemaPadreId: number | null = null;
  inputFocused = false;

  @ViewChildren('inputEditarRef') inputsEditar!: QueryList<ElementRef>;
  @ViewChild('inputNuevoSubtema') inputNuevoSubtema!: ElementRef;

  constructor(private temaService: TemaService) { }

  ngOnInit(): void {
    this.cargarTemas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apunte'] && !changes['apunte'].firstChange) {
      this.cargarTemas();
    }
  }

  alternarModo(): void {
    this.modoLectura = !this.modoLectura;
  }

  ngAfterViewChecked(): void {
    if (this.editandoId !== null && !this.inputFocused) {
      setTimeout(() => {
        if (this.inputsEditar && this.inputsEditar.length > 0) {
          const inputEl = this.inputsEditar.find(el => {
            const nativeEl = el?.nativeElement as HTMLInputElement;
            return nativeEl?.value === this.nombreTemporal;
          });

          if (inputEl?.nativeElement) {
            const input = inputEl.nativeElement as HTMLInputElement;
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
            this.inputFocused = true;
          }
        }
      }, 0);
    }

    if (this.nuevoSubtemaPadreId !== null) {
      setTimeout(() => {
        if (this.inputNuevoSubtema?.nativeElement) {
          this.inputNuevoSubtema.nativeElement.focus();
        }
      }, 0);
    }
  }

  cargarTemas(): void {
    this.temaService.listarTemas(this.apunte.idApunte).subscribe({
      next: data => this.temas = data,
      error: err => console.error('Error al cargar temas:', err)
    });
  }

  get temasPadre(): Tema[] {
    return this.temas.filter(t => t.idTemaPadre == null);
  }

  obtenerSubtemas(padre: Tema): Tema[] {
    return this.temas.filter(t => Number(t.idTemaPadre) === padre.idTema);
  }

  agregarTema(): void {
    const nombre = this.nuevoTema.trim();
    if (!nombre) return;

    const nuevo: Partial<Tema> = {
      nombre,
      idApunte: this.apunte.idApunte,
      idTemaPadre: null
    };

    this.temaService.insertarTema(nuevo).subscribe({
      next: tema => {
        this.temas.push(tema);
        this.nuevoTema = '';
      },
      error: err => console.error('Error al agregar tema:', err)
    });
  }

  agregarSubtema(padre: Tema): void {
    this.nuevoSubtemaPadreId = padre.idTema;
    this.editandoId = -1;
    this.nombreTemporal = '';
  }

  guardarNuevoSubtema(padre: Tema): void {
    const nombre = this.nombreTemporal.trim();
    if (!nombre) {
      this.cancelarNuevoSubtema();
      return;
    }

    const nuevo: Partial<Tema> = {
      nombre,
      idApunte: this.apunte.idApunte,
      idTemaPadre: padre.idTema
    };

    this.temaService.insertarTema(nuevo).subscribe({
      next: tema => {
        this.temas.push(tema);
        this.nuevoSubtemaPadreId = null;
        this.editandoId = null;
      },
      error: err => console.error('Error al insertar subtema:', err)
    });
  }

  cancelarNuevoSubtema(): void {
    this.nuevoSubtemaPadreId = null;
    this.editandoId = null;
    this.nombreTemporal = '';
  }

  habilitarEdicion(tema: Tema): void {
    this.editandoId = tema.idTema;
    this.nombreTemporal = tema.nombre;
    this.inputFocused = false;
  }

  guardarEdicion(tema: Tema): void {
    const nuevoNombre = this.nombreTemporal.trim();
    if (!nuevoNombre) return;

    const actualizado = { ...tema, nombre: nuevoNombre };

    this.temaService.modificarTema(actualizado).subscribe({
      next: () => {
        tema.nombre = nuevoNombre;
        this.editandoId = null;
      },
      error: err => console.error('Error al actualizar tema:', err)
    });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
  }

  eliminarTema(tema: Tema): void {
    this.temaPendiente = tema;
    this.modalTitulo = 'Confirmar eliminación';
    this.modalMensaje = '¿Estás seguro de eliminar este tema? También se eliminarán sus contenidos y subtemas.';
    this.modalVisible = true;
  }

  confirmarEliminacionTema(): void {
    if (!this.temaPendiente) return;

    this.temaService.eliminarTema(this.temaPendiente.idTema).subscribe({
      next: () => {
        this.temas = this.temas.filter(
          t => t.idTema !== this.temaPendiente?.idTema && t.idTemaPadre !== this.temaPendiente?.idTema
        );
        this.temaPendiente = undefined;
        this.modalVisible = false;
      },
      error: err => console.error('Error al eliminar tema:', err)
    });
  }

  cancelarEliminacionTema(): void {
    this.modalVisible = false;
    this.temaPendiente = undefined;
  }
}