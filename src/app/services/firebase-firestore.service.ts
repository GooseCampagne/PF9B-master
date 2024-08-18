import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFirestoreService {

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  // Guarda la información del perfil en Firestore
  saveUserProfile(firstName: string, lastName: string, phoneNumber: string): Promise<void> {
    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) throw new Error('No user logged in');
        const userRef = this.firestore.collection('users').doc(user.uid);
        return userRef.set({ firstName, lastName, phoneNumber }, { merge: true });
      })
    ).toPromise();
  }

  // Obtiene la información del perfil 
  getUserProfile(): Observable<any> {
    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) throw new Error('No user logged in');
        const userRef = this.firestore.collection('users').doc(user.uid);
        return userRef.valueChanges();
      })
    );
  }
}
