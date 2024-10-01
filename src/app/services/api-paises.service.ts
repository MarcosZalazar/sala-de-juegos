import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Respuestaapipais } from '../interfaces/respuestaapipais.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiPaisesService {

  public REST_COUNTRIES_API_URL: string = 'https://restcountries.com/v3.1/all';

  constructor(private http: HttpClient) { }

  public obtenerPaisAleatorio(): Observable<string> {
    return this.http.get<Respuestaapipais[]>(this.REST_COUNTRIES_API_URL).pipe(
      map(respuesta => {
        const paisesFiltrados = respuesta.map(pais => {
          const paisConAcentos = pais.translations?.['spa']?.['common'] || pais.name.common;
          const paisSinAcentos = this.eliminarAcentos(paisConAcentos);
          return paisSinAcentos;
        })
        .filter(nombre => this.filtrarPorCriterio(nombre));

        const indiceAleatorio = Math.floor(Math.random() * paisesFiltrados.length);
        return paisesFiltrados[indiceAleatorio];
      })
    );
  }

  private eliminarAcentos(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  private filtrarPorCriterio(nombre: string): boolean {
    return nombre.length < 8 && !nombre.includes(' ');
  }
}
