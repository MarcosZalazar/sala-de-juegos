import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent implements OnDestroy {

  public RANDOM_WORD_API_URL: string = 'https://clientes.api.greenborn.com.ar/public-random-word?l=10';
  public subscripcion: any;
  public palabraAAdivinar: string = '';
  public letrasAAdivinar: any[] = [];
  public objLetras: any[] = []
  public cantidadAciertos: number = 0;
  public cantidadErrores: number = 0;
  public cantidadErroresPermitidos: number = 6;
  public puntosPorAcierto: number = 10;
  public puntosJugador: number = 0;
  public desahibilitarBotones : boolean = false;
  public urlImagen : string = '';
  public imagenes: string[] = [
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado1.png?alt=media&token=35cca303-1079-44af-94fe-63f18af7dbb5',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado2.png?alt=media&token=87187a1f-35ee-40de-8b08-334ed8bbfe40',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado3.png?alt=media&token=c2ba3fb2-c3a4-4297-ac59-a1840df040b9',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado4.png?alt=media&token=91e77d5a-8a3a-42ef-9f39-e44e7e4dfb78',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado5.png?alt=media&token=1fad45f6-b714-4f65-a64f-1650ea08ac67',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado6.png?alt=media&token=f55c6847-133a-40cb-9daf-ce3a5b3ebf9e',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado7.png?alt=media&token=c70a7d96-8a07-4e06-ab81-a85ea36a58d2'
  ]

  constructor( private http: HttpClient){
    this.cargarJuegoNuevo()
  }

  public cargarJuegoNuevo() : void {
    this.resetearValores();
    this.crearArrayDeObjLetras();
    this.generarPalabra();
  }

  public resetearValores() : void {
    this.cantidadErrores = 0;
    this.cantidadAciertos = 0;
    this.palabraAAdivinar = '';
    this.letrasAAdivinar = [];
    this.urlImagen = this.imagenes[0];
    this.desahibilitarBotones = false;
  }

  public crearArrayDeObjLetras() : void {
    this.objLetras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')
                                                  .map(x =>
      ({
        letra: x,
        habilitado: true
       }
      ));
  }

  public generarPalabra() : void {

    this.subscripcion = this.http.get<string[]>(this.RANDOM_WORD_API_URL)
                                 .subscribe(response => {
        let palabraGenerada = response[0];
        this.palabraAAdivinar = this.eliminarAcentos(palabraGenerada);
        this.letrasAAdivinar = this.palabraAAdivinar.split('')
                                                    .map(letra =>
                                                      ({
                                                          letra,
                                                          visible: false
                                                      }));
    });
  }

  public eliminarAcentos(palabra: string): string {
    return palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  public evaluarLetraIngresada(letra: string): void {
    const letraAEvaluar = letra.toUpperCase();

    if (this.palabraAAdivinar.toUpperCase().includes(letraAEvaluar)) {
      this.computarAcierto(letraAEvaluar);
    } else {
      this.computarError();
    }

    this.verificarResultado();
  }

  private computarAcierto(letraAEvaluar: string): void {
    const objLetra = this.objLetras.find(x => x.letra === letraAEvaluar);
    if (objLetra) {
      objLetra.habilitado = false;
    }

    const letras = this.letrasAAdivinar.filter(x => x.letra.toUpperCase() === letraAEvaluar);
    letras.forEach(x => x.visible = true);
    this.cantidadAciertos += letras.length;
  }

  private computarError(): void {
    this.cantidadErrores++;
    this.urlImagen = this.imagenes[this.cantidadErrores];
  }

  private verificarResultado(): void {
    this.puntosJugador = this.cantidadAciertos * this.puntosPorAcierto;
    if (this.cantidadAciertos === this.palabraAAdivinar.length) {
      this.informarResultado('FELICITACIONES',
                             `¡Ganaste! Y solo te llevo ${this.cantidadErrores} intentos.
                              Tu puntaje es:${this.puntosJugador} puntos`,
                             'success');
    }
    else{
      if (this.cantidadErrores === this.cantidadErroresPermitidos) {
        this.informarResultado('LA PRÓXIMA SERÁ...',
                               `¡Perdiste! La palabra era '${this.palabraAAdivinar}.'
                                Tu puntaje es:${this.puntosJugador}`,
                               'error');
      }
    }
  }

  private informarResultado(titulo: string, texto: string, icono: 'success'|'error'): void {
    this.desahibilitarBotones = true;

    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "Cerrar",
      confirmButtonText: "Jugar de nuevo"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargarJuegoNuevo();
      }
    });
  }

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }
}
