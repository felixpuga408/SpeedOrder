import { Component, inject, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { PedidoService } from '../../core/services/pedido.service';
import { Router } from '@angular/router';  // Necesitamos Router para la redirección

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public carritoService = inject(CarritoService);
  public authService = inject(AuthService);
  public pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  notificaciones: { mensaje: string }[] = [];
  mostrarNotificaciones: boolean = false;
  nuevasNotificaciones: number = 0;
  esAdmin: boolean = false;  // Variable para verificar si el usuario es admin

  constructor() {}

  ngOnInit() {
    // Verificamos si el usuario es admin al cargar el componente
    this.esAdmin = this.authService.esAdmin();
    console.log('Es admin:', this.esAdmin); 
    this.cargarNotificaciones();
  }

  // Método para cerrar sesión
  cerrarSesion() {
    this.authService.cerrarSesion();  // Llamamos al método de cerrar sesión
    this.router.navigate(['/login']);  // Redirigimos a la página de login después de cerrar sesión
  }

  // Método para alternar la visibilidad del menú de notificaciones
  toggleNotificaciones(event: Event) {
    event.stopPropagation();  // Evita que el clic en el icono cierre el menú inmediatamente
    this.mostrarNotificaciones = !this.mostrarNotificaciones;  // Alternar el estado del menú
    this.cdr.detectChanges();  // Forzamos la actualización de la vista
    console.log('Mostrar notificaciones:', this.mostrarNotificaciones);  // Verifica si el valor de mostrarNotificaciones cambia
  }

  // Escuchar los clics en cualquier parte de la pantalla para cerrar el menú
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const isDropdownClicked = (event.target as HTMLElement).closest('.dropdown-menu') !== null;
    const isBellIconClicked = (event.target as HTMLElement).closest('.fa-bell') !== null;

    // Si se hace clic fuera del dropdown y campana, cerrar el menú
    if (!isDropdownClicked && !isBellIconClicked) {
      this.mostrarNotificaciones = false;
    }
  }

  cargarNotificaciones() {
    if (this.esAdmin) { // Solo cargamos las notificaciones si es admin
      console.log('Cargando notificaciones para admin');
      this.pedidoService.obtenerPedidos().subscribe(pedidos => {
        this.notificaciones = pedidos
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) // Ordena por fecha descendente
          .map(pedido => ({
            mensaje: `Nuevo pedido de ${pedido.cliente}`
          }));
  
        this.nuevasNotificaciones = this.notificaciones.length;
        console.log('Notificaciones cargadas:', this.notificaciones);  // Verificar que las notificaciones están cargadas correctamente
        
        this.cdr.detectChanges(); // Forzar la actualización de la vista
      });
    }
  }
  
}
