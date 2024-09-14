import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

//Módulos de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatIconModule,
            MatButtonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  constructor(private router: Router){}

  public usuario: String = "";
  public email: String = "";
  public contrasenia: String = "";

  public registrar(): void{

  }

}
