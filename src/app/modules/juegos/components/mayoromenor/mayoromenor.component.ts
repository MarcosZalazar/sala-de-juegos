import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Mazo } from '../../../../interfaces/mazo.interface';
import { map, Observable, Subscription } from 'rxjs';
import { Respuestaapicarta } from '../../../../interfaces/respuestaapicarta.interface';

import Swal from 'sweetalert2'
import { User } from '@angular/fire/auth';
import { ResultadosService } from '../../../../services/resultados.service';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-mayoromenor',
  templateUrl: './mayoromenor.component.html',
  styleUrl: './mayoromenor.component.css'
})
export class MayoromenorComponent implements OnInit, OnDestroy {

  public DECK_OF_CARDS_API_URL: string = 'https://www.deckofcardsapi.com/api/deck';
  public mazoID!: string;
  public subscripcion: any;
  public cartaActual!: number;
  public urlImgCartaActual: string = '';
  public cartaSiguiente!: number;
  public urlImgCartaSiguiente: string = 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fmayoromenor%2Freversocarta.png?alt=media&token=50f5b502-6a9f-4125-8125-fac6a15a809c';
  public mensaje!: string;
  public cantidadAciertos: number = 0;
  public contadorDeJugadas: number = 0;
  public cantidadDeJugadas: number = 10;
  public puntosPorAcierto: number = 1;
  public puntosJugador: number = 0;
  public estiloRespuesta: string = '';
  public botonesDeshabilitados : boolean = false;
  public subscripciones: Subscription[] = [];
  public usuarioActual: User | null = null;
  public mensajeRespuesta: string = "";
  public nombreJuego: string = "Mayor o menor";

  constructor(
    private http: HttpClient,
    private resultadosService: ResultadosService,
    public authenticationService: AuthenticationService
   ) {
    this.authenticationService.devolverUsuarioLogueado().subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
    });
  }

  ngOnInit(): void {
    this.cargarJuegoNuevo();
  }

  public cargarJuegoNuevo(): void {

    this.resetearValores();

    const subscripcionMazo = this.generarMazo().subscribe(deckId => {
      this.mazoID = deckId;

      const subscripcionCarta = this.obtenerCarta().subscribe(respuesta => {
        this.cartaActual = this.formatearCarta(respuesta.cards[0].value);
        this.urlImgCartaActual=respuesta.cards[0].image;
      });

      this.subscripciones.push(subscripcionCarta);
    });

    this.subscripciones.push(subscripcionMazo);
  }

  public resetearValores() : void {
    this.mensaje = "Adivina si la siguiente carta será mayor o menor.";
    this.cantidadAciertos = 0;
    this.contadorDeJugadas = 0;
    this.puntosJugador = 0;
    this.estiloRespuesta = '';
    this.botonesDeshabilitados = false;
  }

  public generarMazo(): Observable<string> {
    return this.http.get<Mazo>(`${this.DECK_OF_CARDS_API_URL}/new/draw/?count=1`)
                    .pipe(map(respuesta => respuesta.deck_id));
  }

  public obtenerCarta(): Observable<Respuestaapicarta> {
    return this.http.get<Respuestaapicarta>(`${this.DECK_OF_CARDS_API_URL}/${this.mazoID}/draw/?count=1`);
  }

  public formatearCarta(cartaString: string): number {

    let numeroCarta;

    switch (cartaString) {

      case 'ACE':
        numeroCarta = 1;
        break;
      case 'JACK':
        numeroCarta = 11;
        break;
      case 'QUEEN':
        numeroCarta = 12;
        break;
      case 'KING':
        numeroCarta = 13;
        break;
      default:
        numeroCarta = parseInt(cartaString);
        break;
    }

    return numeroCarta;
  }

  public adivinar(mayor: boolean): void {

    this.obtenerCarta().subscribe(respuesta => {
      this.cartaSiguiente = this.formatearCarta(respuesta.cards[0].value);
      this.urlImgCartaActual=respuesta.cards[0].image;

      if ((mayor && this.cartaSiguiente > this.cartaActual) ||
          (!mayor && this.cartaSiguiente < this.cartaActual)){
            this.cantidadAciertos++;
            this.estiloRespuesta = 'respuesta-correcta';
            this.mensaje = `Correcto! Tu carta era ${this.cartaActual} y la nueva es ${this.cartaSiguiente}.`;
      }else{
        this.estiloRespuesta = 'respuesta-incorrecta';
        this.mensaje = `Incorrecto! Tu carta era ${this.cartaActual} y la nueva es ${this.cartaSiguiente}.`;
      }

      this.contadorDeJugadas++;
      this.cartaActual = this.cartaSiguiente;
      this.puntosJugador = this.cantidadAciertos * this.puntosPorAcierto;

      if (this.contadorDeJugadas === this.cantidadDeJugadas) {
        this.mensaje = `Se terminó el juego! Tu puntaje es:${this.puntosJugador} puntos.
                        Si te gustó, volvé a jugar`;
        this.estiloRespuesta = '';
        this.botonesDeshabilitados = true;

        if (this.usuarioActual?.email){
          this.registrarResultado(this.usuarioActual?.email, this.puntosJugador, this.nombreJuego);
        }

        Swal.fire({
          title: 'JUEGO TERMINADO',
          text: this.mensaje,
          icon: 'info',
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
    });
  }

  public registrarResultado(usuario: string, puntaje: number, juego: string): void{
    this.resultadosService.registrarResultado(usuario,puntaje,juego)
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

  ngOnDestroy(): void {
    this.subscripciones.forEach(subscripcion => subscripcion.unsubscribe());
  }

}
