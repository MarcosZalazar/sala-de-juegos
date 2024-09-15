import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import Swal from 'sweetalert2'
import { Auth, signOut } from '@angular/fire/auth';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatButtonModule, MatIconModule,
            MatToolbarModule, MatListModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(
    private router : Router,
    public auth: Auth
  ){}

  public mensajeRespuesta: string = "";

  public itemsMenuLateral = [
    { nombre: 'Ahorcado', url:'./paginaError' },
    { nombre: 'Mayor o Menor', url:'./paginaError' },
    { nombre: 'Preguntados', url:'./paginaError' },
    { nombre: 'Wordle', url:'./paginaError' },
  ]

  public irAHome(): void{
    this.router.navigate(['/home']);
  }

  public irALogin(): void{
    this.router.navigate(['/login']);
  }

  public irARegistro(): void{
    this.router.navigate(['/registro']);
  }

  public irAQuienSoy(): void{
    this.router.navigate(['/quienSoy']);
  }

  public logout(): void{
    signOut(this.auth)
    .then(() => {
      this.router.navigate(['/home']);
    })
    .catch((e) => {
      this.mensajeRespuesta = "El usuario no pudo abandonar la aplicación correctamente";
      Swal.fire('Error', this.mensajeRespuesta, 'error');
    });
  }
}
