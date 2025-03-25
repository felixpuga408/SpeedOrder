import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre = ''; 
  email = '';
  password = '';
  telefono: string = '';  
  rol = 'usuario';  
  error = '';

  constructor(private router: Router, private http: HttpClient) {}

  registrar() {
    if (!this.nombre || !this.email || !this.password || !this.telefono) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }
  
    // Validar teléfono
    const telefonoRegex = /^[0-9]{10}$/;
    if (!telefonoRegex.test(this.telefono)) {
      this.error = 'El teléfono debe contener solo números y ser de 10 dígitos';
      return;
    }

    // Validar email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Por favor ingresa un correo electrónico válido';
      return;
    }
  
    const nuevoUsuario = {
      nombre: this.nombre, 
      email: this.email,
      password: this.password,
      telefono: this.telefono, 
      rol: this.rol  
    };
  
    this.http.post('https://67bd5cac321b883e790c2567.mockapi.io/users', nuevoUsuario).subscribe({
      next: () => {
        console.log('Usuario registrado correctamente');
        this.router.navigate(['/login']);  
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.error = 'Error al registrar usuario. Inténtalo de nuevo.';
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
