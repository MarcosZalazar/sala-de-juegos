import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Respuestaapisimpsons } from '../interfaces/respuestaapisimpsons.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiSimpsonsService {

  public THE_SIMPSONS_API_URL: string = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=50';
  public cantidadDePersonajes: number = 10;

  constructor( private http: HttpClient ) {}

  obtenerPersonajesFiltrados(): Observable<Respuestaapisimpsons[]> {
    return this.http.get<Respuestaapisimpsons[]>(this.THE_SIMPSONS_API_URL)
                    .pipe(
                        map(respuesta => this.filtrarPersonajesAleatorios(respuesta, this.cantidadDePersonajes))
                    );
  }

  private filtrarPersonajesAleatorios(personajes: Respuestaapisimpsons[], cantidad: number): Respuestaapisimpsons[] {
    const personajesUnicos: Respuestaapisimpsons[] = [];
    const nombresPersonajes: string[] = [];

    for (const personaje of personajes) {
      if (!nombresPersonajes.includes(personaje.character)) {
        nombresPersonajes.push(personaje.character);
        personajesUnicos.push(personaje);
      }
      if (personajesUnicos.length === cantidad) {
        break;
      }
    }

    return personajesUnicos;
  }
}
