import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { HeaderComponent } from '../header/header.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import Swal from 'sweetalert2';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, HeaderComponent, MatFormFieldModule, MatInputModule,
            MatIconModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
  ){}

  public usuariosAutorizados: any = [
    {
      usuario: 'usuario1@gmail.com',
      contrasenia: 'abc123'
    },
    {
      usuario: 'usuario2@gmail.com',
      contrasenia: 'abc124'
    },
    {
      usuario: 'admin@gmail.com',
      contrasenia: 'abc125'
    }
  ];

  public usuario: string = "";
  public contrasenia: string = "";
  public mensajeRespuesta: string = "";
  public subscripciones!: Subscription[];

  public login(): void{

    this.authenticationService.login(this.usuario, this.contrasenia)
    .then(() => {
      this.registrarLogin();
      this.router.navigate(['/home']);
    })
    .catch((error) => {

      switch (error.code) {
        case 'auth/invalid-email':
          this.mensajeRespuesta = "Usuario inválido";
          break;
        case 'auth/user-not-found':
          this.mensajeRespuesta = "No hay ningún registro de algún usuario con este identificador";
          break;
        case 'auth/wrong-password':
          this.mensajeRespuesta = "Contraseña inválida";
          break;
        case 'auth/invalid-credential':
          this.mensajeRespuesta = "Credencial inválida";
          break;
        case 'auth/user-disabled':
          this.mensajeRespuesta = "La cuenta de usuario ha sido deshabilitada";
          break;
        case 'auth/operation-not-allowed':
          this.mensajeRespuesta = "El proveedor de autenticación no está habilitado";
          break;
        case 'auth/network-request-failed':
          this.mensajeRespuesta = "La solicitud de red ha fallado";
          break;
        case 'auth/too-many-requests':
          this.mensajeRespuesta = "Demasiadas solicitudes. Inténtalo más tarde";
          break;
        default:
          this.mensajeRespuesta = `Por favor, verifique los datos ingresados. Error: ${error.code}`;
          break;
      }

      Swal.fire('Error', this.mensajeRespuesta, 'error');

    });
  }

  public registrarLogin(): void{

    this.authenticationService.registrarLogin(this.usuario)
    .then(() => {
    })
    .catch((error) => {

      switch (error.code) {
        case 'permission-denied':
          this.mensajeRespuesta = "Permiso denegado";
          break;
        case 'unavailable':
          this.mensajeRespuesta = "El servicio no está disponible temporalmente";
          break;
        case 'invalid-argument':
          this.mensajeRespuesta = "Argumento no válido";
          break;
        case 'deadline-exceeded':
          this.mensajeRespuesta = "La operación ha tardado demasiado tiempo";
          break;
        case 'already-exists':
          this.mensajeRespuesta = "El documento ya existe";
          break;
        case 'resource-exhausted':
          this.mensajeRespuesta = "Se han agotado los recursos disponibles";
          break;
        case 'failed-precondition':
          this.mensajeRespuesta = "La operación no se puede realizar en el estado actual";
          break;
        case 'aborted':
          this.mensajeRespuesta = "La operación fue abortada";
          break;
        case 'out-of-range':
          this.mensajeRespuesta = "Valor fuera del rango permitido";
          break;
        case 'unimplemented':
          this.mensajeRespuesta = "La operación no está implementada";
          break;
        case 'internal':
          this.mensajeRespuesta = "Error interno del servidor";
          break;
        case 'data-loss':
          this.mensajeRespuesta = "Pérdida de datos irrecuperable.";
          break;
        case 'unauthenticated':
          this.mensajeRespuesta = "El usuario no está autenticado";
          break;
        default:
          this.mensajeRespuesta = `Por favor, verifique los datos ingresados. Error: ${error.code}`;
          break;
      }

      Swal.fire('Error', this.mensajeRespuesta, 'error');

    });
  }

  public autoCompletarUsuario(indice: number): void{

    this.usuario=this.usuariosAutorizados[indice].usuario;
    this.contrasenia=this.usuariosAutorizados[indice].contrasenia;

  }

  ngOnDestroy(): void {
    // this.subscripciones.map(subscripcion => subscripcion.unsubscribe());
  }
}
