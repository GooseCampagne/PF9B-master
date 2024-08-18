import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa desde 'compat'
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; // Importa desde 'compat'
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = afAuth.authState;
  }

  async signUp(email: string, password: string) {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error signing up', error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  }

  async signIn(email: string, password: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error signing in', error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  }

  async signOut() {
    try {
      return await this.afAuth.signOut();
    } catch (error) {
      console.error('Error signing out', error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  }

  getUser() {
    return this.afAuth.user;
  }
}
