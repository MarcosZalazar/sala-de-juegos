import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import Swal from 'sweetalert2'
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatIconModule,
            MatButtonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  constructor(
    public auth: Auth,
    private router: Router
  ){}

  public nuevoUsuario: string = "";
  public nuevaContrasenia: string = "";

  public usuarioRegistrado: string = "";
  public mensajeRespuesta: string = "";

  public registrar(): void{
    createUserWithEmailAndPassword(this.auth, this.nuevoUsuario, this.nuevaContrasenia)
    .then((respuesta) => {
      if (respuesta.user.email !== null){
        this.usuarioRegistrado = respuesta.user.email;
      }

      this.router.navigate(['/home']);
      this.mensajeRespuesta = "Usuario registrado exitosamente";
      Swal.fire('Felicitaciones!', this.mensajeRespuesta, 'success');

    })
    .catch((e) => {

      switch (e.code) {
        case "auth/invalid-email":
          this.mensajeRespuesta = " Usuario inválido";
          break;
        case "auth/email-already-in-use":
          this.mensajeRespuesta = "Usuario existente";
          break;
        default:
          this.mensajeRespuesta = `Por favor, verifique los datos ingresados. Error: ${e.code}`;
          break;
      }

      Swal.fire('Error', this.mensajeRespuesta, 'error');

    });
  }

}
