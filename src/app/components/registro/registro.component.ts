import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { HeaderComponent } from '../header/header.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import Swal from 'sweetalert2'
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule, HeaderComponent, MatFormFieldModule, MatInputModule,
            MatIconModule, MatButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  public formularioRegistro!: FormGroup;
  public mensajeRespuesta: string = "";

  constructor(
    public formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
    private router: Router
  ){
    this.formularioRegistro = this.formBuilder.group(
      {
        nuevoUsuario: ['', [Validators.required, Validators.email] ],
        nuevaContrasenia: ['', [Validators.required, Validators.minLength(4)] ]
      }
    );
  }

  get nuevoUsuario() {
    return this.formularioRegistro.get('nuevoUsuario');
  }

  get nuevaContrasenia() {
    return this.formularioRegistro.get('nuevaContrasenia');
  }

  public registrar(): void{

    if(this.formularioRegistro.invalid) return;

    const nuevoUsuario = this.formularioRegistro.get('nuevoUsuario')?.value;
    const nuevaContrasenia = this.formularioRegistro.get('nuevaContrasenia')?.value;

    this.authenticationService.registrar(nuevoUsuario, nuevaContrasenia)
    .then(() => {
      this.router.navigate(['/home']);
      this.mensajeRespuesta = "Usuario registrado exitosamente";
      Swal.fire('Felicitaciones!', this.mensajeRespuesta, 'success');

    })
    .catch((error) => {

      switch (error.code) {
        case "auth/invalid-email":
          this.mensajeRespuesta = "Usuario inválido";
          break;
        case "auth/email-already-in-use":
          this.mensajeRespuesta = "El usuario ya está en uso";
          break;
        case 'auth/weak-password':
          this.mensajeRespuesta = "La contraseña es demasiado débil";
          break;
        case 'auth/operation-not-allowed':
          this.mensajeRespuesta = "El proveedor de autenticación no está habilitado";
          break;
        case 'auth/argument-error':
          this.mensajeRespuesta = "Se ha proporcionado un argumento no válido";
          break;
        case 'auth/app-not-authorized':
          this.mensajeRespuesta = "La aplicación no está autorizada";
          break;
        case 'auth/network-request-failed':
          this.mensajeRespuesta = "La solicitud de red ha fallado";
          break;
        case 'auth/too-many-requests':
          this.mensajeRespuesta = "Demasiadas solicitudes. Inténtalo más tarde";
          break;
        case 'auth/internal-error':
          this.mensajeRespuesta = "Error interno del servidor";
          break;
        case 'auth/invalid-api-key':
          this.mensajeRespuesta = "La clave API no es válida";
          break;
        case 'auth/user-disabled':
          this.mensajeRespuesta = "La cuenta de usuario ha sido deshabilitada";
          break;
        case 'auth/invalid-credential':
          this.mensajeRespuesta = "La credencial no es válida";
          break;
        case 'auth/invalid-verification-code':
          this.mensajeRespuesta = "El código de verificación no es válido";
          break;
        case 'auth/invalid-verification-id':
          this.mensajeRespuesta = "El ID de verificación no es válido";
          break;
        default:
          this.mensajeRespuesta = `Por favor, verifique los datos ingresados. Error: ${error.code}`;
          break;
      }

      Swal.fire('Error', this.mensajeRespuesta, 'error');

    });
  }

}
