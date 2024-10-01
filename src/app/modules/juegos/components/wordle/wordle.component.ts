import { Component } from '@angular/core';

import Swal from 'sweetalert2'
import { ApiPaisesService } from '../../../../services/api-paises.service';

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

  constructor(private apiPaisesService: ApiPaisesService){
    this.cargarJuegoNuevo()
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

}
