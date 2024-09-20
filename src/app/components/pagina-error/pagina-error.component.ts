import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'

import { HeaderComponent } from '../header/header.component';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-pagina-error',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './pagina-error.component.html',
  styleUrl: './pagina-error.component.css'
})
export class PaginaErrorComponent implements OnInit {

  public imgPaginaNoEncontradaUrl?: string;
  public mensajeRespuesta: string = "";

  constructor( public authenticationService: AuthenticationService ){}

  ngOnInit(): void {

    this.authenticationService.obtenerUrlDeImagen('images/paginanoencontrada.png')
    .then((url) => {
      this.imgPaginaNoEncontradaUrl=url;
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
