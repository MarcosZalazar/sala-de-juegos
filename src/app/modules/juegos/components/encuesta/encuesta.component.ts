import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../../services/authentication.service';

import Swal from 'sweetalert2'
import { EncuestaService } from '../../../../services/encuesta.service';
import { Respuestaencuesta } from '../../../../interfaces/respuestaencuesta.interface';
import { User } from '@angular/fire/auth';
import { alMenosUnJuegoSeleccionado } from '../../../../validadores/juegoSeleccionado.validator';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent implements OnInit{

  public usuarioActual: User | null = null;
  public formEncuesta: FormGroup;
  public mensajeRespuesta: string = "";

  constructor(
    private formBuilder: FormBuilder,
    public encuestaService: EncuestaService,
    public authenticationService: AuthenticationService
  ) {
    this.formEncuesta = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      genero: ['',Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['',[Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(10)]],
      juegos: this.formBuilder.group({
        pacman: [false],
        solitario: [false],
        buscaminas: [false],
        sudoku: [false]
      }, { validators: alMenosUnJuegoSeleccionado() }),
      calificacion: ['', Validators.required],
      preguntaCambios: ['', [Validators.required, Validators.maxLength(280)]],
      preguntaRecomendacion: ['', [Validators.required, Validators.maxLength(280)]]
    });
  }

  ngOnInit(): void {
    this.authenticationService.devolverUsuarioLogueado().subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
    });
  }

  get nombre() {
    return this.formEncuesta.get('nombre');
  }

  get apellido() {
    return this.formEncuesta.get('apellido');
  }

  get genero() {
    return this.formEncuesta.get('genero');
  }

  get edad() {
    return this.formEncuesta.get('edad');
  }

  get telefono() {
    return this.formEncuesta.get('telefono');
  }

  get juegos() {
    return this.formEncuesta.get('juegos');
  }

  get pacman() {
    return this.juegos?.get('pacman');
  }

  get solitario() {
    return this.juegos?.get('solitario');
  }

  get buscaminas() {
    return this.juegos?.get('buscaminas');
  }

  get sudoku() {
    return this.juegos?.get('sudoku');
  }

  get calificacion() {
    return this.formEncuesta.get('calificacion');
  }

  get preguntaCambios() {
    return this.formEncuesta.get('preguntaCambios');
  }

  get preguntaRecomendacion() {
    return this.formEncuesta.get('preguntaRecomendacion');
  }

  public registrarEncuesta(): void {

    if(this.formEncuesta.invalid){
      Object.keys(this.formEncuesta.controls).forEach(controlName => {
        const control = this.formEncuesta.get(controlName);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    if (!this.usuarioActual || !this.usuarioActual.email) {
      return;
    }

    const encuestaData: Respuestaencuesta = {
      fecha: new Date(),
      usuario: this.usuarioActual?.email,
      ...this.formEncuesta.value
    };

    this.encuestaService.registrarEncuestaEnFireStore(encuestaData)
    .then(() => {
      this.mensajeRespuesta = "Hemos registrado tu respuesta.¡Gracias por darnos tu opinión!";
      Swal.fire('Muchas gracias!', this.mensajeRespuesta, 'success');
      this.formEncuesta.reset();
    })
    .catch((error) => {
      this.mensajeRespuesta = `No se ha podido registrar tu respuesta. Error: ${error.code}`;
      Swal.fire('Error', this.mensajeRespuesta, 'error');
    });
  }
}
