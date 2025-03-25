import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/modelo/producto';
import { CarritoService } from '../../../core/services/carrito.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalogo-inicio',
  imports:[CommonModule,FormsModule],
  templateUrl: './catalogo-inicio.component.html',
  styleUrl: './catalogo-inicio.component.css'
})
export class CatalogoInicioComponent implements OnInit {

  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);
  private router = inject(Router); 

  productos: Producto[] = [];
  usuarioEnSesion: boolean = false;
  productoSeleccionado: Producto | null = null;

  ngOnInit(): void {
    this.getProductos();
    this.usuarioEnSesion = this.authService.estaAutenticado();
  }

  getProductos() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        console.log(this.productos);
      }, 
      error: (e) => {
        console.error(e);
      }
    });
  }

  agregarProducto(item: Producto) {
    if (this.usuarioEnSesion) {
      this.carritoService.agregar(item);
    } else {
      if (confirm("Debes iniciar sesión para agregar productos. ¿Deseas iniciar sesión ahora?")) {
        this.router.navigate(['/login']); 
      }
    }
  }

  verDetalles(producto: Producto) {
    this.productoSeleccionado = producto;
  }
}
