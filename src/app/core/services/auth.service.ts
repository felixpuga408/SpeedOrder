import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://67bd5cac321b883e790c2567.mockapi.io/users';  // URL de la API

  constructor(private http: HttpClient) {}

  // Verificar si el usuario está autenticado
  estaAutenticado(): boolean {
    if (typeof window !== 'undefined') {  // Verificamos si estamos en el navegador
      return !!localStorage.getItem('token');
    }
    return false;
  }

  // Iniciar sesión y verificar contra la API
  iniciarSesion(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const usuario = users.find(user => user.email === email && user.password === password);
        if (usuario) {
          console.log('Usuario encontrado:', usuario);  // Verifica la estructura del usuario aquí
          if (typeof window !== 'undefined') {  // Verificamos si estamos en el navegador
            localStorage.setItem('token', 'user-auth-token');
            localStorage.setItem('usuario', JSON.stringify(usuario));  // Guardamos los detalles del usuario
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

  // Cerrar sesión
  cerrarSesion(): void {
    if (typeof window !== 'undefined') {  // Verificamos si estamos en el navegador
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
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
