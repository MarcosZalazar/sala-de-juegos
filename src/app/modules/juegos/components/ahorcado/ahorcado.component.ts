import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';

import Swal from 'sweetalert2'
import { ResultadosService } from '../../../../services/resultados.service';
import { User } from '@angular/fire/auth';
import { AuthenticationService } from '../../../../services/authentication.service';

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
  public botonesDeshabilitados : boolean = false;
  public urlImagen : string = '';
  public imagenes: string[] = [
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado1.png?alt=media&token=35cca303-1079-44af-94fe-63f18af7dbb5',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado2.png?alt=media&token=87187a1f-35ee-40de-8b08-334ed8bbfe40',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado3.png?alt=media&token=c2ba3fb2-c3a4-4297-ac59-a1840df040b9',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado4.png?alt=media&token=91e77d5a-8a3a-42ef-9f39-e44e7e4dfb78',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado5.png?alt=media&token=1fad45f6-b714-4f65-a64f-1650ea08ac67',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado6.png?alt=media&token=f55c6847-133a-40cb-9daf-ce3a5b3ebf9e',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-8b7b8.appspot.com/o/images%2Fjuegos%2Fahorcado%2Fahorcado7.png?alt=media&token=c70a7d96-8a07-4e06-ab81-a85ea36a58d2'
  ];
  public usuarioActual: User | null = null;
  public mensajeRespuesta: string = "";
  public nombreJuego: string = "Ahorcado";

  constructor(
    private http: HttpClient,
    private resultadosService: ResultadosService,
    public authenticationService: AuthenticationService
  ){
    this.cargarJuegoNuevo(),
    this.authenticationService.devolverUsuarioLogueado().subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
    });
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
    this.puntosJugador = 0;
    this.botonesDeshabilitados = false;
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

    this.deshabilitarBoton(letraAEvaluar);
    this.verificarResultado();
  }

  private computarAcierto(letraAEvaluar: string): void {
    const letras = this.letrasAAdivinar.filter(x => x.letra.toUpperCase() === letraAEvaluar);
    letras.forEach(x => x.visible = true);
    this.cantidadAciertos += letras.length;
  }

  private computarError(): void {
    this.cantidadErrores++;
    this.urlImagen = this.imagenes[this.cantidadErrores];
  }

  private deshabilitarBoton(letraAEvaluar: string){
    const objLetra = this.objLetras.find(x => x.letra === letraAEvaluar);
    if (objLetra) {
      objLetra.habilitado = false;
    }
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
    this.botonesDeshabilitados = true;

    if (this.usuarioActual?.email){
      this.registrarResultado(this.usuarioActual?.email, this.puntosJugador, this.nombreJuego);
    }

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

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }
}
