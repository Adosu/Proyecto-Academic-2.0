import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  mostrarContrasena: boolean = false;

  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      idUsuario: [''],
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      apellido: ['', [Validators.required, Validators.minLength(4)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.minLength(8), this.passwordValidator]]
    });

    this.usuarioService.getPerfil().subscribe({
      next: (data) => this.perfilForm.patchValue(data),
      error: (err) => {
        console.error('Error al obtener perfil:', err);
        this.snackBar.open('Error al cargar perfil', 'Cerrar', { duration: 3000 });
      }
    });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);
    const valid = hasUpper && hasLower && hasDigit && hasSpecial;
    return valid ? null : { invalidPassword: true };
  }

  get f() {
    return this.perfilForm.controls;
  }

  guardarCambios(): void {
    if (this.perfilForm.invalid) {
      this.snackBar.open('Corrige los errores del formulario', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.usuarioService.modificarUsuario(this.perfilForm.value).subscribe({
      next: () => {
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });
      },
      error: (err) => {
        console.error('Error al modificar usuario:', err);
        this.snackBar.open('Error al guardar cambios', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  eliminarUsuario(): void {
    this.modalTitulo = 'Eliminar cuenta';
    this.modalMensaje = '¿Estás seguro que deseas eliminar tu cuenta? Esta acción es irreversible y eliminará todos tus apuntes y datos personales.';
    this.modalVisible = true;
  }

  confirmarEliminacion(): void {
    this.usuarioService.eliminarUsuario().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.snackBar.open('Error al eliminar usuario', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });
      }
    });

    this.modalVisible = false;
  }

  cancelarEliminacion(): void {
    this.modalVisible = false;
  }

  getIniciales(): string {
    const n = this.f['nombre']?.value || '';
    const a = this.f['apellido']?.value || '';
    return `${n.charAt(0)}${a.charAt(0)}`.toUpperCase();
  }
}
