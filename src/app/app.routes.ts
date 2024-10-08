import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PaginaErrorComponent } from './components/pagina-error/pagina-error.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { RegistroComponent } from './components/registro/registro.component';
import { guardAutenticacionGuard } from './guards/guard-autenticacion.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'home', component: HomeComponent },
  { path: 'paginaError', component: PaginaErrorComponent },
  { path: 'quienSoy', component: QuienSoyComponent },
  { path: 'juegos',
    loadChildren:() => import('./modules/juegos/juegos.module').then(m => m.JuegosModule),
    canActivate: [guardAutenticacionGuard] },
  { path: '', redirectTo:'home', pathMatch:"full"},
  { path: '**', redirectTo: 'paginaError' }
];
