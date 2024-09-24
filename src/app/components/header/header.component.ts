import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import Swal from 'sweetalert2'
import { AuthenticationService } from '../../services/authentication.service';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import { User } from '@angular/fire/auth';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule,
            MatToolbarModule, MatListModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  public usuarioActual: User | null = null;
  public mensajeRespuesta: string = "";
  // public email: string|null|undefined = "";

  constructor(
    private router : Router,
    public authenticationService: AuthenticationService
  ){}

  public navegarA(url: string): void{
    this.router.navigate([url]);
  }

  public logout(): void{
    this.authenticationService.logout()
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

  ngOnInit(): void {
    this.authenticationService.devolverUsuarioLogueado().subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
    });
  }
}
