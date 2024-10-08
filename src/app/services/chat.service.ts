import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, Firestore, limit, orderBy, query } from '@angular/fire/firestore';
import { Chat } from '../interfaces/chat.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public coleccionDeChats: CollectionReference<Chat>;
  public chats: Chat[] = [];
  public cantidadMaximaDeChats: number = 10;
  public usuario: User | null = null;

  constructor(
    private firestore: Firestore,
    public auth: Auth
  )
  {
    this.coleccionDeChats = collection(this.firestore, 'chats') as CollectionReference<Chat>;
    onAuthStateChanged(this.auth, (usuario) => {
      this.usuario=usuario;
    });
  }

  public obtenerUsuarioActual(): Observable<User | null> {
    return new Observable((subscriptor) => {
      const unsubscribe = onAuthStateChanged(this.auth, (usuario) => {
        this.usuario=usuario;
        subscriptor.next(usuario);
      });

      return () => unsubscribe();
    });
  }

  public devolverChats(): Observable<Chat[]> {

    const filteredQuery = query(
      this.coleccionDeChats,
      orderBy('fecha','desc'),
      limit(this.cantidadMaximaDeChats)
    );

    return collectionData(filteredQuery)
          .pipe(
            map((chats: Chat[]) => {
              this.chats = [];
              chats.forEach((chat) => {
                this.chats.unshift(chat);
              });

              return this.chats;
            })
          );
  }

  public agregarChat(texto: string):Promise<any>{

    if (!this.usuario || !this.usuario.email) {
      return Promise.reject(new Error('El email del usuario no está logueado.'));
    }

    let chat: Chat = {
      email:  this.usuario.email,
      mensaje: texto,
      fecha: new Date().getTime()
    }

    return addDoc(this.coleccionDeChats, chat);
  }
}
