import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) { }

  public login(usuario: string, contrasenia: string): Promise<any>{
    return signInWithEmailAndPassword(this.auth, usuario, contrasenia);
  }

  public registrarLogin(usuario: string): Promise<any>{

    let coleccion = collection(this.firestore, 'logins');
    let documento = {
      "usuario": usuario,
      fecha: new Date()
    };

    return addDoc(coleccion, documento);
  }

  public async devolverUsuarioLogueado(): Promise<User| null>{
    return await this.auth.currentUser;
  }

  public registrar(nuevoUsuario: string, nuevaContrasenia: string): Promise<any>{
    return createUserWithEmailAndPassword(this.auth, nuevoUsuario, nuevaContrasenia);
  }

  public obtenerUrlDeImagen(url: string): Promise<string>{

    const reference = ref(this.storage, url);
    return getDownloadURL(reference);
  }

  public logout(): Promise<any>{
    return signOut(this.auth);
  }

}
