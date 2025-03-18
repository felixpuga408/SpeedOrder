import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'https://67bd5cac321b883e790c2567.mockapi.io/pedidos';

  constructor(private http: HttpClient) {}

  // Obtener todos los pedidos
  obtenerPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener los pedidos de un usuario específico
  obtenerPedidosPorUsuario(usuarioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?cliente=${usuarioId}`);
  }
}
