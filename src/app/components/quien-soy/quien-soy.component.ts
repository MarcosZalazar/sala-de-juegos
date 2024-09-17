import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import Swal from 'sweetalert2'

import { HeaderComponent } from '../header/header.component';

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

  constructor( private storage: Storage ){}

  ngOnInit(): void {

    const reference = ref(this.storage, 'images/miFoto.jpg');

    getDownloadURL(reference)
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
