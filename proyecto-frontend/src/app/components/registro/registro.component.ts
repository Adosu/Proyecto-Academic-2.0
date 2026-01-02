import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  mostrarContrasena = false;
  mostrarConfirmar = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      apellido: ['', [Validators.required, Validators.minLength(4)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmar: ['', [Validators.required]]
    }, { validators: this.matchPasswords });
  }

  cancelar(): void {
    this.router.navigate(['/login']);
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);
    const valid = hasUpper && hasLower && hasDigit && hasSpecial;
    return valid ? null : { invalidPassword: true };
  }

  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('contrasena')?.value;
    const confirm = group.get('confirmar')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  get f() {
    return this.registroForm.controls;
  }

  registrar(): void {
    if (this.registroForm.invalid) {
      this.snackBar.open('Corrige los errores del formulario', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.usuarioService.registrarUsuario(this.registroForm.value).subscribe({
      next: () => {
        this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al registrar usuario', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
