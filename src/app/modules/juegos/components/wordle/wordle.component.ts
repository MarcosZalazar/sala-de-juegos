import { Component } from '@angular/core';

import Swal from 'sweetalert2'
import { ApiPaisesService } from '../../../../services/api-paises.service';
import { User } from '@angular/fire/auth';
import { ResultadosService } from '../../../../services/resultados.service';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-wordle',
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.css'
})
export class WordleComponent {

  public letras: string[] = []
  public palabraAAdivinar: string = '';
  public intentos: string[] = [];
  public respuestaActual: string = '';
  public cantidadDeJugadas: number = 6;
  public puntosJugador: number = 10;
  public estadoLetrasTeclado: { [letra: string]: string } = {};
  public botonesDeshabilitados : boolean = false;
  public usuarioActual: User | null = null;
  public mensajeRespuesta: string = "";
  public nombreJuego: string = "Wordle";

  constructor(
    private apiPaisesService: ApiPaisesService,
    private resultadosService: ResultadosService,
    public authenticationService: AuthenticationService
  ){
    this.cargarJuegoNuevo();
    this.authenticationService.devolverUsuarioLogueado().subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
    });
  }

  public cargarJuegoNuevo() : void {
    this.resetearValores();
    this.crearTeclado();
    this.apiPaisesService.obtenerPaisAleatorio().subscribe(pais => {
      this.palabraAAdivinar = pais.toUpperCase();
    });
  }

  public resetearValores() : void {
    this.puntosJugador = 10;
    this.intentos = [];
    this.respuestaActual = '';
    this.botonesDeshabilitados = false;
    this.letras.forEach(letra => {
      this.estadoLetrasTeclado[letra] = 'default';
    });
  }

  public crearTeclado() : void {
    this.letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  }

  public obtenerEspaciosVaciosIntentoActual(): number[] {
    return new Array(this.palabraAAdivinar.length - this.respuestaActual.length).fill(0);
  }

  public obtenerFilasVaciasRestantes(): number[] {

    if(this.intentos.length>=this.cantidadDeJugadas){
      return [];
    }

    const filasVacias = this.cantidadDeJugadas - this.intentos.length - 1;
    return filasVacias > 0 ? new Array(filasVacias).fill(0) : [];
  }

  public obtenerLetrasVaciasPorFila(): number[] {
    return new Array(this.palabraAAdivinar.length).fill(0);
  }

  public agregarLetra(letra: string) : void {
    if (this.respuestaActual.length < this.palabraAAdivinar.length) {
      this.respuestaActual += letra;
    }
  }

  public borrarLetra() : void{
    this.respuestaActual = this.respuestaActual.slice(0, -1);
  }

  public verificarPablabra(): void {

    if (this.respuestaActual.length === this.palabraAAdivinar.length &&
        this.intentos.length < this.cantidadDeJugadas) {

      this.intentos.push(this.respuestaActual);
      this.actualizarEstadoLetrasTeclado();

      if (this.intentos[this.intentos.length - 1] === this.palabraAAdivinar) {
        this.informarResultado('FELICITACIONES',
          `¡Ganaste! Tu puntaje es: ${this.puntosJugador} puntos`,
          'success');
        return;
      }

      this.calcularPuntos();

      if (this.intentos.length === this.cantidadDeJugadas) {
        this.informarResultado('LA PRÓXIMA SERÁ...',
          `¡Perdiste! La palabra era '${this.palabraAAdivinar}.'
           Tu puntaje es: ${this.puntosJugador}`,
          'error');
      }

      this.respuestaActual = '';
    }
  }

  public actualizarEstadoLetrasTeclado(): void {
    this.respuestaActual.split('').forEach((letra, index) => {
      if (letra === this.palabraAAdivinar[index]) {
        this.estadoLetrasTeclado[letra] = 'correcta';
      } else if (this.palabraAAdivinar.includes(letra)) {
        this.estadoLetrasTeclado[letra] = 'parcial';
      } else {
        this.estadoLetrasTeclado[letra] = 'incorrecta';
      }
    });
  }

  private calcularPuntos(): void {
    const intentosUsados = this.intentos.length;

    if (this.puntosJugador > 0) {
      this.puntosJugador -= 1;
    }

    if(intentosUsados === this.cantidadDeJugadas)
    {
      this.puntosJugador = 0;
    }
  }

  public informarResultado(titulo: string, texto: string, icono: 'success'|'error'): void {
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
}
