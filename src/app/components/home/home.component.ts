import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Juego } from '../../classes/juego';
import { Auth } from '@angular/fire/auth';

import { HeaderComponent } from '../header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, MatCardModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    private router : Router,
    public auth: Auth
  ){}

  public juegos: Juego[] = [
    new Juego('AHORCADO', '¡Poné a prueba tu vocabulario! Adiviná la palabra antes de que se complete el'+
              'dibujo. Un clásico que te hará pensar rápido. ¿Te animás a jugar?',
              'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fahorcado.png?alt=media&token=ad0ab61f-8040-48a2-af8e-85f3e012e24a'),
    new Juego('MAYOR O MENOR', '¡Jugátela! Adiviná si la próxima carta será mayor o menor. Sencillo, '+
              'pero súper adictivo, no vas a querer dejar de jugar con todos tus amigos. ¡Dale, animate!',
              'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fmayoromenor.png?alt=media&token=69e30c1c-ebbb-4d7d-8bc5-ff9b87d69a15'),
    new Juego('PREGUNTADOS', '¿Te la pasas repitiendo frases de los simpsons? Este juego es'+
              'para vos. Demostrá que sos el que más sabe de esta familia de Springfield',
              'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fpreguntados.png?alt=media&token=de0f2b65-e274-4871-8306-6cb72a2640b1'),
    new Juego('WORDLE', 'Pensá rápido y descifrá la palabra oculta en seis intentos. Cada pista'+
              'te acerca más a la respuesta.¡Ideal para los amantes de los desafíos!',
              'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fwordle.png?alt=media&token=79ce5bcf-4a5f-4409-ab6a-29ccebfba106')
  ];

}
