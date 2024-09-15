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

  public navegarA(url: string): void{
    this.router.navigate([url]);
  }

  public logout(): void{
    signOut(this.auth)
    .then(() => {
      this.router.navigate(['/home']);
    })
    .catch((error) => {

      switch (error.code) {
        case 'auth/network-request-failed':
          this.mensajeRespuesta = "La solicitud de red ha fallado";
          break;
        case 'auth/too-many-requests':
          this.mensajeRespuesta = "Demasiadas solicitudes. Inténtalo más tarde";
          break;
        case 'auth/internal-error':
          this.mensajeRespuesta = "Error interno del servidor";
          break;
        default:
          this.mensajeRespuesta = `Se produjo el siguiente error: ${error.code}. Vuelve a intentarlo`;
          break;
      }

      Swal.fire('Error', this.mensajeRespuesta, 'error');

    });
  }
}
