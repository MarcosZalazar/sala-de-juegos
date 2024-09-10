import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatButtonModule, MatIconModule,
            MatToolbarModule, MatListModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router : Router){}

  public itemsMenuLateral = [
    { nombre: 'Ahorcado', url:'./paginaError' },
    { nombre: 'Mayor o Menor', url:'./paginaError' },
    { nombre: 'Preguntados', url:'./paginaError' },
    { nombre: 'Wordle', url:'./paginaError' },
  ]

  public irAHome(): void{
    this.router.navigate(['/home']);
  }

  public irAQuienSoy(): void{
    this.router.navigate(['/quienSoy']);
  }

  public onLogout(): void{
    this.router.navigate(['/login']);
  }
}
