import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] 
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {} // ✅ Se inyecta Router aquí

  iniciarSesion() {
    if (!this.email || !this.password) {
      this.error = 'Debes ingresar un email y contraseña';
      return;
    }
  
    this.authService.iniciarSesion(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Inicio de sesión exitoso', res);
        this.error = ''; // Limpiar el error si el login es exitoso
        // Aquí puedes redirigir a donde quieras después de un inicio de sesión exitoso
        this.router.navigate(['/home']); // Redirige al home después de login exitoso
      },
      error: (err) => {
        this.error = 'Credenciales incorrectas, por favor revisa tus datos.';
        console.error(err);
      }
    });
  }

  irARegistro() {
    this.router.navigate(['/register']); // ✅ Ahora sí funciona correctamente
  }
}
