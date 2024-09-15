import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

//Módulos de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import Swal from 'sweetalert2';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatIconModule,
            MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private router: Router,
    public auth: Auth,
    private firestore: Firestore
  ){}

  public usuarioUno: string = "Usuario 1";
  public contraseniaUno: string = "abc123";
  public usuarioDos: string = "Usuario 2";
  public contraseniaDos: string = "abc124";
  public admin: string = "Admin";
  public contraseniaAdmin: string = "abc125";

  public usuario: string = "";
  public contrasenia: string = "";

  public mensajeRespuesta: string = "";

  public login(): void{

    signInWithEmailAndPassword(this.auth, this.usuario, this.contrasenia)
    .then(() => {
      this.router.navigate(['/home']);
    })
    .catch((e) => {
      this.mensajeRespuesta = "El usuario no pudo loguearse";
      Swal.fire('Error', this.mensajeRespuesta, 'error');
    });
  }

  public registrarLogin(): void{

    let coleccion = collection(this.firestore, 'logins');
    let documento = {
      "usuario": this.usuario,
      fecha: new Date()
    };

     addDoc(coleccion, documento);
  }

  //REFACTORIZAR: LAS CONTRASEÑAS SE DEBEN TRAER CON UNA QUERY DESDE FIREBASE
  public autoCompletarUsuario(usuario: string): void{

    this.usuario=usuario;

    switch (usuario) {
      case "Usuario 1":
        this.contrasenia=this.contraseniaUno;
        break;
      case "Usuario 2":
        this.contrasenia=this.contraseniaDos;
        break;
      default:
        this.contrasenia=this.contraseniaAdmin;
        break;
    }
  }
}
