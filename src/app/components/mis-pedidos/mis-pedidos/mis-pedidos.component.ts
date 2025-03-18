import { Component, inject, OnInit } from '@angular/core';
import { PedidoService } from '../../../core/services/pedido.service';  // Asegúrate de importar el servicio de pedidos
import { AuthService } from '../../../core/services/auth.service';  // Importar AuthService para obtener el usuario
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
  public authService = inject(AuthService);  // Inyectamos AuthService para obtener el usuario autenticado
  pedidos: any[] = [];

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuario();  // Obtener el usuario autenticado
    if (usuario) {
      this.obtenerPedidos(usuario.nombre);  // Obtener los pedidos del usuario
    }
  }

  // Método para obtener los pedidos del usuario
  obtenerPedidos(nombreUsuario: string): void {
    this.pedidoService.obtenerPedidosPorUsuario(nombreUsuario).subscribe(pedidos => {
      this.pedidos = pedidos;  // Asignamos los pedidos recuperados a la variable
    }, error => {
      console.error('Error al obtener los pedidos:', error);
    });
  }
}
