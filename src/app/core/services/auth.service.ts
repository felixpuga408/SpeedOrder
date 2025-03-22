// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';  // Importamos Router para la redirección

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://67bd5cac321b883e790c2567.mockapi.io/users';  // URL de la API

  constructor(private http: HttpClient, private router: Router) {}

  // Verificar si el usuario está autenticado
  estaAutenticado(): boolean {
    if (typeof window !== 'undefined') {  // Verificamos si estamos en el navegador
      return !!localStorage.getItem('token');
    }
    return false;
  }

  iniciarSesion(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const usuario = users.find(user => user.email === email && user.password === password);
        if (usuario) {
          // Guardamos el usuario y el token en localStorage
          localStorage.setItem('token', 'user-auth-token');
          localStorage.setItem('usuario', JSON.stringify(usuario));
  
          // Redirigir según el rol del usuario
          if (usuario.rol === 'admin') {
            this.router.navigate(['/admin/pedidos']).then(() => {
              window.location.reload();  // Recargar la página después de la navegación
            });
          } else {
            this.router.navigate(['/']).then(() => {
              window.location.reload();  // Recargar la página después de la navegación
            });
          }
  
          return usuario;
        } else {
          throw new Error('Credenciales incorrectas');
        }
      }),
      catchError(err => {
        throw new Error('Credenciales incorrectas');
      })
    );
  }
  

  // Registrar un nuevo usuario
  registrarUsuario(nombre: string, email: string, password: string, telefono: number): Observable<any> {
    const nuevoUsuario = { nombre, email, password, telefono, rol: 'user' }; // Rol por defecto 'user'
    return this.http.post<any>(this.apiUrl, nuevoUsuario);
  }

  cerrarSesion(): void {
    if (typeof window !== 'undefined') {  // Verificamos si estamos en el navegador
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    window.location.reload(); // Recargamos la página después de cerrar sesión
  }

  // Obtener los detalles del usuario desde localStorage
  obtenerUsuario(): any {
    if (typeof window !== 'undefined') {  // Verificamos si estamos en el navegador
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      console.log('Usuario obtenido:', usuario);
      return usuario;
    }
    return {};  // Retorna un objeto vacío si está en SSR
  }

  // Verificar si el usuario es administrador
  esAdmin(): boolean {
    const usuario = this.obtenerUsuario();
    return usuario?.rol === 'admin';  // Verifica si el rol es 'admin'
  }
}
