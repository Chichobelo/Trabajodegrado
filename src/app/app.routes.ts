import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { SettingsComponent } from './settings/settings.component';
import { PagesComponent } from './pages/pages.component';
import { loginComponent } from './login/login.component';
import { CreacionProductoComponent } from './creacion-producto/creacion-producto.component';
import { InventarioComponent } from './inventario/inventario.component';
import { FormulaComponent } from './formula/formula.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './AuthGuard';

export const routes: Routes = [
  { path: 'login', component: loginComponent }, // Página de login
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'settings', component: SettingsComponent, }, // Protegida
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'pages', component: PagesComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'creacion-producto', component: CreacionProductoComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'formula', component: FormulaComponent, canActivate: [AuthGuard] }, // Protegida
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirección al login si no se proporciona una ruta
  { path: '**', redirectTo: 'login' }, // Redirigir rutas desconocidas al login
];
