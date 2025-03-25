import { Component, inject, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { PedidoService } from '../../core/services/pedido.service';
import { Router } from '@angular/router';  

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
  esAdmin: boolean = false; 
  constructor() {}

  ngOnInit() {
    
    this.esAdmin = this.authService.esAdmin();
    console.log('Es admin:', this.esAdmin); 
    this.cargarNotificaciones();
  }


  cerrarSesion() {
    this.authService.cerrarSesion();  
    this.router.navigate(['/login']);  
  }

  
  toggleNotificaciones(event: Event) {
    event.stopPropagation();  
    this.mostrarNotificaciones = !this.mostrarNotificaciones; 
    this.cdr.detectChanges();  
    console.log('Mostrar notificaciones:', this.mostrarNotificaciones);  
    }
 
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const isDropdownClicked = (event.target as HTMLElement).closest('.dropdown-menu') !== null;
    const isBellIconClicked = (event.target as HTMLElement).closest('.fa-bell') !== null;


    if (!isDropdownClicked && !isBellIconClicked) {
      this.mostrarNotificaciones = false;
    }
  }

  cargarNotificaciones() {
    if (this.esAdmin) { 
      console.log('Cargando notificaciones para admin');
      this.pedidoService.obtenerPedidos().subscribe(pedidos => {
        this.notificaciones = pedidos
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) 
          .map(pedido => ({
            mensaje: `Nuevo pedido de ${pedido.cliente}`
          }));
  
        this.nuevasNotificaciones = this.notificaciones.length;
        console.log('Notificaciones cargadas:', this.notificaciones);  
        
        this.cdr.detectChanges(); 
      });
    }
  }
  
}
