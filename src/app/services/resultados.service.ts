import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, Firestore, limit, orderBy, query } from '@angular/fire/firestore';
import { Resultados } from '../interfaces/resultados.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {

  public coleccionDeResultados: CollectionReference<Resultados>;
  public resultados: Resultados[] = [];
  public cantidadMaximaDeResultados: number = 10;

  constructor( private firestore: Firestore ) {
    this.coleccionDeResultados = collection(this.firestore, 'resultados') as CollectionReference<Resultados>;
   }

  public registrarResultado(usuario: string, puntaje: number, juego: string): Promise<any>{

    let coleccion = collection(this.firestore, 'resultados');
    let documento = {
      "usuario": usuario,
      fecha: new Date(),
      "puntaje": puntaje,
      "juego": juego
    };

    return addDoc(coleccion, documento);
  }

  public devolverResultados(): Observable<Resultados[]> {

    const filteredQuery = query(
      this.coleccionDeResultados,
      orderBy('puntaje','desc'),
      limit(this.cantidadMaximaDeResultados)
    );

    return collectionData(filteredQuery)
    .pipe(
      map((resultados: Resultados[]) => {
        this.resultados = resultados.map(resultado => ({
          ...resultado,
          fecha: (resultado.fecha instanceof Date)
            ? resultado.fecha
            : (resultado.fecha as any).toDate()
        }));
        return this.resultados;
      })
    );
  }
}
