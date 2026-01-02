import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  error: string = '';

  constructor(private _authService: AuthService, private router: Router) { }

  login() {
    this._authService.login(this.correo, this.contrasena).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.error = err.error?.msg || 'Credenciales inválidas';
      }
    });
  }
}
