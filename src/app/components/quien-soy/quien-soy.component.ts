import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2'

import { HeaderComponent } from '../header/header.component';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css'
})
export class QuienSoyComponent {

  public miFotoUrl?: string;
  public mensajeRespuesta: string = "";

  constructor( public authenticationService: AuthenticationService ){}

  ngOnInit(): void {

    this.authenticationService.obtenerUrlDeImagen('images/miFoto.jpg')
    .then((url) => {
      this.miFotoUrl=url;
    })
    .catch((error) => {

      switch (error.code) {
        case 'storage/object-not-found':
          this.mensajeRespuesta = "El archivo no existe";
          break;
        case 'storage/unauthorized':
          this.mensajeRespuesta = "El usuario no tiene permiso para acceder a este archivo";
          break;
        default:
          this.mensajeRespuesta = `Se ha producido el siguiente error: ${error.code}`;
          break;
      }

      Swal.fire('Error', this.mensajeRespuesta, 'error');

    });
  }

}
