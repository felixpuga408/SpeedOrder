import { Routes } from '@angular/router';
import { CatalogoInicioComponent } from './components/catalago/catalogo-inicio/catalogo-inicio.component';
import { CarritoListarComponent } from './components/carrito/carrito-listar/carrito-listar.component';
import { AuthGuard } from './core/guards/auth.guard';  // Importamos el AuthGuard
import { AdminGuard } from './core/guards/admin.guard';  // Importamos el AdminGuard
import { LoginComponent } from './components/login/login.component';
import { AdminPedidosComponent } from './admin/pedidos/admin-pedidos/admin-pedidos.component';
import { AdminUsuariosComponent } from './admin/usuarios/admin-usuarios/admin-usuarios.component';
import { RegisterComponent } from './components/register/register.component';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos/mis-pedidos.component';

export const routes: Routes = [
  { path: '', component: CatalogoInicioComponent },
  { path: 'carrito', component: CarritoListarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  //{ path: '**', pathMatch: 'full', redirectTo: '' },
  { path: 'admin/pedidos', component: AdminPedidosComponent, canActivate: [AuthGuard, AdminGuard] }, // Solo admin
  { path: 'admin/usuarios', component: AdminUsuariosComponent, canActivate: [AuthGuard, AdminGuard] }, // Solo admin
  { path: 'mis-pedidos', component: MisPedidosComponent, canActivate: [AuthGuard] }
];
