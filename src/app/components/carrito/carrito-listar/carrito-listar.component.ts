import { CarritoService } from '../../../core/services/carrito.service';
import { Carrito } from '../../../core/modelo/carrito';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';  // Asegúrate de importar AuthService
import { Router } from '@angular/router';  // Asegúrate de importar Router
import { HttpClient } from '@angular/common/http';  // Necesario para hacer la petición al API
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-carrito-listar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito-listar.component.html',
  styleUrls: ['./carrito-listar.component.css']
})
export class CarritoListarComponent implements OnInit {
  public carritoService = inject(CarritoService);
  public authService = inject(AuthService);
  public router = inject(Router);
  public http = inject(HttpClient);
  public platformId: Object = inject(PLATFORM_ID); // Injectar el ID de la plataforma
  listCarrito: Carrito[] = [];

  ngOnInit(): void {
    this.getListCarrito();
    if (isPlatformBrowser(this.platformId)) {  // Verificamos si estamos en el navegador
      this.cargarBotonPayPal();
    }
  }

  getListCarrito() {
    this.listCarrito = this.carritoService.getCarrito();
  }

  eliminarItem(index: number) {
    this.carritoService.eliminar(index);
    this.getListCarrito();
  }

  onKeyDown(event: any) {
    event.preventDefault();
  }

  actualizarCantidad(index: number, event: any) {
    const nuevaCantidad = Number(event.target.value);
    if (nuevaCantidad < 1) return;
    this.carritoService.actualizar(index, nuevaCantidad);
  }

  cambiarCantidad(index: number, cambio: number) {
    let nuevaCantidad = this.listCarrito[index].cantidad + cambio;
    if (nuevaCantidad < 1) return;
    this.carritoService.actualizar(index, nuevaCantidad);
  }

  realizarPago() {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
    } else {
      console.log('Procesando el pago...');
    }
  }

  procesarPedido(pagoExitoso: boolean) {
    if (pagoExitoso) {
      const usuario = this.authService.obtenerUsuario();
      console.log('Usuario desde localStorage:', usuario);
      const nuevoPedido = {
        cliente: usuario?.nombre || 'Desconocido',
        productos: this.listCarrito,
        total: this.carritoService.total(),
        estado: 'Pendiente',
        fecha: new Date(),
      };

      this.http.post('https://67bd5cac321b883e790c2567.mockapi.io/pedidos', nuevoPedido).subscribe(response => {
        console.log('Pedido guardado con éxito:', response);
        this.router.navigate(['/mis-pedidos']);
      });
    } else {
      alert('El pago no fue exitoso. Intenta nuevamente.');
    }
  }

  cargarBotonPayPal() {
    // Ahora esto solo se ejecuta en el navegador
    if (typeof window !== 'undefined') {
      (window as any).paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          const totalRedondeado = this.carritoService.total().toFixed(2);
  
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalRedondeado,
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert('Pago realizado con éxito: ' + details.payer.name.given_name);
            this.procesarPedido(true);
          });
        },
        onError: (err: any) => {
          console.error('Error en el pago:', err);
          this.procesarPedido(false);
        }
      }).render('#paypal-button-container');
    }
  }
}
