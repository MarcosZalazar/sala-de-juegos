import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {

  constructor( private firestore: Firestore ) { }

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

}
