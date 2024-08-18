import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; 
import { map } from 'rxjs/operators';

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
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Error signing out', error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  }

  // Método para cerrar sesión
  logout(): Observable<void> {
    return new Observable(observer => {
      this.signOut().then(() => {
        observer.next();
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getUser() {
    return this.afAuth.user;
  }

  get userPhotoURL(): Observable<string> {
    return this.user$.pipe(
      map(user => user?.photoURL || '')
    );
  }
}
