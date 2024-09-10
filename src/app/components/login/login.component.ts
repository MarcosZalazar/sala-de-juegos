import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

//Módulos de Angular Material
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatIconModule,
            MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router: Router){}

  private usuarioAutorizado: String = "Prueba";
  private contraseniaAutorizada: String = "abc123";
  public usuarioAValidar: String = "";
  public contraseniaAValidar: String = "";

  public onLogin(usuarioAValidar: String, contraseniaAValidar: String ): void{

    if(usuarioAValidar==this.usuarioAutorizado &&
       contraseniaAValidar==this.contraseniaAutorizada)
    {
      this.router.navigate(['/home']);
    }
    else
    {
      Swal.fire('Error','El usuario o la contraseña son inválidos','error');
    }
  }

  public autoCompletarUsuario(): void{
    this.usuarioAValidar="Prueba";
    this.contraseniaAValidar="abc123";
  }
}
