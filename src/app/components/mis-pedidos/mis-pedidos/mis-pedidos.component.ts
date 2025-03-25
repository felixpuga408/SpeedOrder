import { Component, inject, OnInit } from '@angular/core';
import { PedidoService } from '../../../core/services/pedido.service'; 
import { AuthService } from '../../../core/services/auth.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./mis-pedidos.component.css']
})
export class MisPedidosComponent implements OnInit {
  public pedidoService = inject(PedidoService);
  public authService = inject(AuthService);  
  pedidos: any[] = [];

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuario();  
    if (usuario) {
      this.obtenerPedidos(usuario.nombre);  
    }
  }


  obtenerPedidos(nombreUsuario: string): void {
    this.pedidoService.obtenerPedidosPorUsuario(nombreUsuario).subscribe(pedidos => {
      this.pedidos = pedidos;  
    }, error => {
      console.error('Error al obtener los pedidos:', error);
    });
  }
}
