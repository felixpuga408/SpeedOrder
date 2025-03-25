import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http.get('https://67bd5cac321b883e790c2567.mockapi.io/users').subscribe({
      next: (data: any) => {
        this.usuarios = data;
      },
      error: () => {
        this.error = 'Error al obtener los usuarios';
      }
    });
  }

  actualizarUsuario(usuario: any) {
    this.http.put(`https://67bd5cac321b883e790c2567.mockapi.io/users/${usuario.id}`, usuario)
      .subscribe({
        next: () => {
          console.log('Usuario actualizado');
        },
        error: () => {
          this.error = 'Error al actualizar usuario';
        }
      });
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.http.delete(`https://67bd5cac321b883e790c2567.mockapi.io/users/${id}`).subscribe({
        next: () => {
          console.log('Usuario eliminado');
          // Eliminar el usuario de la lista sin necesidad de recargar la página
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
        },
        error: () => {
          this.error = 'Error al eliminar usuario';
        }
      });
    }
  }
}
