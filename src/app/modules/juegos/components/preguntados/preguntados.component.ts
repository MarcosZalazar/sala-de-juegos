import { Component, OnDestroy, OnInit } from '@angular/core';
import { Respuestaapisimpsons } from '../../../../interfaces/respuestaapisimpsons.interface';
import { ApiSimpsonsService } from '../../../../services/api-simpsons.service';

import Swal from 'sweetalert2'
import { User } from '@angular/fire/auth';
import { ResultadosService } from '../../../../services/resultados.service';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent implements OnInit, OnDestroy {

  public subscripcion: any;
  public personajes: Respuestaapisimpsons[] = [];
  public personajeAAdivinar!: Respuestaapisimpsons;
  public opciones: string[] = [];
  public cantidadDeOpciones: number = 4;
  public puntosJugador: number = 0;
  public contadorDeJugadas: number = 0;
  public cantidadDeJugadas: number = 10;
  public indiceActual: number = 0;
  public mensaje!: string;
  public botonesDeshabilitados : boolean = false;
  public usuarioActual: User | null = null;
  public mensajeRespuesta: string = "";
  public nombreJuego: string = "Preguntados";

  constructor(
    private apiSimpsonsService: ApiSimpsonsService,
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

  public cargarJuegoNuevo() {

    this.resetearValores();
    this.subscripcion = this.apiSimpsonsService.obtenerPersonajesFiltrados()
                                               .subscribe(respuesta => {
                                                  this.personajes = respuesta;
                                                  this.indiceActual = 0;
                                                  this.cargarSiguientePersonaje();
    });
  }

  public resetearValores() : void {
    this.opciones= [];
    this.personajes = [];
    this.contadorDeJugadas = 0;
    this.puntosJugador = 0;
    this.botonesDeshabilitados = false;
  }

  public cargarSiguientePersonaje(): void {
    this.personajeAAdivinar = this.personajes[this.indiceActual];
    this.opciones = this.generarOpciones(this.personajeAAdivinar.character);
  }

  public generarOpciones(nombreCorrecto: string): string[] {
    const opciones: string[] = [];
    opciones.push(nombreCorrecto);

    while (opciones.length < this.cantidadDeOpciones) {
      const personajeAleatorio = this.seleccionarPersonajeAlAzar();
      const nombreAleatorio = personajeAleatorio.character;

      if (!opciones.includes(nombreAleatorio)) {
        opciones.push(nombreAleatorio);
      }
    }

    return this.mezclarOpciones(opciones);
  }

  public seleccionarPersonajeAlAzar(): Respuestaapisimpsons {
    const indiceAleatorio = Math.floor(Math.random() * this.personajes.length);
    return this.personajes[indiceAleatorio];
  }

  public mezclarOpciones(opciones: string[]): string[] {
    return opciones.sort(() => Math.random() - 0.5);
  }

  public verificarRespuesta(nombreElegido: string): void {
    let icono: 'success'|'error'|'info';

    if (nombreElegido === this.personajeAAdivinar.character) {
      this.puntosJugador++;
      this.mensaje = `¡Correcto! El personaje es ${this.personajeAAdivinar.character} .`;
      icono='success'
    } else {
      this.mensaje = `¡Incorrecto! El personaje es ${this.personajeAAdivinar.character} .`;
      icono='error'
    }

    this.comunicarAlUsuario('jugada', this.mensaje,'',icono);
    this.contadorDeJugadas++;
    this.indiceActual++;

    if (this.contadorDeJugadas < this.cantidadDeJugadas){
      this.cargarSiguientePersonaje();
    } else{
      this.botonesDeshabilitados = true;
      this.mensaje = `Se terminó el juego! Tu puntaje es: ${this.puntosJugador} puntos.
                      Si te gustó, volvé a jugar`;
      this.comunicarAlUsuario('final','JUEGO TERMINADO', this.mensaje,'info');
    }
  }

  public comunicarAlUsuario(tipo: string, titulo: string, texto: string, icono: 'success'|'error'|'info'): void {

    switch(tipo)
    {
      case 'jugada':
        Swal.fire({
          position: "center",
          icon: icono,
          title: titulo,
          showConfirmButton: false,
          timer: 1000
        });
        break;
      default:

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
        break;
    }
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
