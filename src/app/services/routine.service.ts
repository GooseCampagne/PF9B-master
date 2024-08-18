import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Usa compatibilidad para Firestore
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  constructor(private firestore: AngularFirestore) {}

  addRoutine(routine: any) {
    return this.firestore.collection('routines').add(routine);
  }

  getRoutines(userId: string) {
    return this.firestore.collection('routines', ref => ref.where('userId', '==', userId)).valueChanges();
  }
}
