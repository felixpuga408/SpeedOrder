import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: any[] = [];
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerPedidos();
  }

  obtenerPedidos() {
    this.http.get('https://67bd5cac321b883e790c2567.mockapi.io/pedidos').subscribe({
      next: (data: any) => {
        this.pedidos = data.map((pedido: any) => ({
          ...pedido,
          productosString: pedido.productos
            ? pedido.productos.map((p: any) => p.nombre).join(', ') 
            : 'Sin productos'
        }));
      },
      error: () => {
        this.error = 'Error al obtener los pedidos';
      }
    });
  }

  actualizarEstado(pedido: any) {
    this.http.put(`https://67bd5cac321b883e790c2567.mockapi.io/pedidos/${pedido.id}`, pedido)
      .subscribe({
        next: () => {
          console.log('Pedido actualizado');
        },
        error: () => {
          this.error = 'Error al actualizar pedido';
        }
      });
  }
}
