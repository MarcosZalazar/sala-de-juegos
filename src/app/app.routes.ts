import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PaginaErrorComponent } from './components/pagina-error/pagina-error.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'paginaError', component: PaginaErrorComponent },
  { path: 'quienSoy', component: QuienSoyComponent },
  { path: '', redirectTo:'login', pathMatch:"full"},
  { path: '**', redirectTo: 'paginaError' }
];
