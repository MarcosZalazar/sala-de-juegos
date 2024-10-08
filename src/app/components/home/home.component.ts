import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Card } from './../../interfaces/card.interface';
import { HeaderComponent } from '../header/header.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '@angular/fire/auth';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, MatCardModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  public usuarioActual: User | null = null;
  public email: string|null|undefined = "";

  constructor(
    private router : Router,
    public authenticationService: AuthenticationService
  ){}

  public cards: Card[] = [
    {
      nombre: 'AHORCADO',
      descripcion:'¡Poné a prueba tu vocabulario! Adiviná la palabra antes de que se complete el'+
                  'dibujo. Un clásico que te hará pensar rápido. ¿Te animás a jugar?',
      url:'/juegos/ahorcado',
      imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fahorcado.png?alt=media&token=ad0ab61f-8040-48a2-af8e-85f3e012e24a'
    },
    {
      nombre: 'MAYOR O MENOR',
      descripcion:'¡Jugátela! Adiviná si la próxima carta será mayor o menor. Sencillo, '+
                  'pero súper adictivo, no vas a querer dejar de jugarlo con. ¡Dale, animate!',
      url:'/juegos/mayoromenor',
      imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fmayoromenor.png?alt=media&token=69e30c1c-ebbb-4d7d-8bc5-ff9b87d69a15'
    },
    {
      nombre: 'PREGUNTADOS',
      descripcion:'¿Te la pasas repitiendo frases de los simpsons? Este juego es '+
                  'para vos. Demostrá que sos el que más sabe de esta familia de Springfield',
      url:'/juegos/preguntados',
      imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fpreguntados.png?alt=media&token=de0f2b65-e274-4871-8306-6cb72a2640b1'
    },
    {
      nombre: 'WORDLE',
      descripcion:'Pensá rápido y descifrá la palabra oculta en seis intentos. Cada pista '+
                  'te acerca más a la respuesta.¡Ideal para los amantes de los desafíos!',
      url:'/juegos/wordle',
      imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fwordle.png?alt=media&token=79ce5bcf-4a5f-4409-ab6a-29ccebfba106'
    },
  ];

  ngOnInit(): void {
    this.authenticationService.devolverUsuarioLogueado().subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
    });
  }

  public navegarA(url: string): void{
    this.router.navigate([url]);
  }
}
