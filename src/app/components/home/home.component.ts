import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Juego } from '../../classes/juego';

import { HeaderComponent } from '../header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, MatCardModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  public juegos: Juego[] = [
    new Juego('AHORCADO', '¡Poné a prueba tu vocabulario! Adiviná la palabra antes de que se complete el'+
              'dibujo. Un clásico que te hará pensar rápido. ¿Te animás a jugar?',
              'assets/ahorcado.png'),
    new Juego('MAYOR O MENOR', '¡Jugátela! Adiviná si la próxima carta será mayor o menor. Sencillo, '+
              'pero súper adictivo, no vas a querer dejar de jugar con todos tus amigos. ¡Dale, animate!',
              'assets/mayoromenor.png'),
    new Juego('PREGUNTADOS', '¿Te la pasas repitiendo frases de los simpsons? Este juego es'+
              'para vos. Demostrá que sos el que más sabe de esta familia de Springfield',
              'assets/preguntados.png'),
    new Juego('WORDLE', 'Pensá rápido y descifrá la palabra oculta en seis intentos. Cada pista'+
              'te acerca más a la respuesta.¡Ideal para los amantes de los desafíos!',
              'assets/wordle.png')
  ];

}
