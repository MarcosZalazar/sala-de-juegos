import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Respuestaencuesta } from '../interfaces/respuestaencuesta.interface';


@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  constructor( private firestore: Firestore ) { }

  public registrarEncuestaEnFireStore(respuestaEncuesta: Respuestaencuesta): Promise<any>{

    let coleccion = collection(this.firestore, 'encuesta');
    let documento = respuestaEncuesta;

    return addDoc(coleccion, documento);
  }

}
