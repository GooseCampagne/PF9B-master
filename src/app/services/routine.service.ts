import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  constructor(private firestore: AngularFirestore) {}

  addRoutine(routine: any): Promise<void> {
    const userId = routine.userId;
    if (!userId) throw new Error('userId is required'); // Verifica que userId esté presente
    return this.firestore.collection('users').doc(userId).collection('routines').add(routine)
      .then(() => {});
  }

  getRoutines(userId: string): Observable<any[]> {
    if (!userId) throw new Error('userId is required'); // Verifica que userId esté presente
    return this.firestore.collection('users').doc(userId).collection('routines').valueChanges();
  }

  updateRoutine(userId: string, routineId: string, updatedRoutine: any): Promise<void> {
    if (!userId || !routineId) throw new Error('userId and routineId are required'); // Verifica que ambos parámetros estén presentes
    return this.firestore.collection('users').doc(userId).collection('routines').doc(routineId).update(updatedRoutine);
  }

  deleteRoutine(userId: string, routineId: string): Promise<void> {
    if (!userId || !routineId) throw new Error('userId and routineId are required'); // Verifica que ambos parámetros estén presentes
    return this.firestore.collection('users').doc(userId).collection('routines').doc(routineId).delete();
  }
}
