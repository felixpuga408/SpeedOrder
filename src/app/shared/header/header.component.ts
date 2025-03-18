import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';  // Verifica que la ruta sea correcta

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public carritoService = inject(CarritoService);
  public authService = inject(AuthService); // Inyectamos el servicio de autenticación

  // Método para cerrar sesión
  cerrarSesion() {
    this.authService.cerrarSesion(); // Llama al servicio para cerrar sesión
  }
}
