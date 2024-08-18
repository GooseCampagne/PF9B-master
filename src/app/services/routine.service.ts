import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { from, } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  updateRoutine: any;
  getRoutineDetails(userId: string, routineId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId)
      .collection('routines').doc(routineId)
      .valueChanges();
  }
  constructor(private firestore: AngularFirestore) {}

  addRoutine(routine: any): Promise<void> {
    const userId = routine.userId;
    if (!userId) throw new Error('userId is required'); 


    const { userId: _, exercises, ...routineData } = routine;


    routineData.createdAt = new Date();


    return this.firestore.collection('users').doc(userId).collection('routines').add(routineData)
      .then(docRef => {

        if (exercises && exercises.length > 0) {
          const batch = this.firestore.firestore.batch();
          exercises.forEach((exercise: any) => {
            const exerciseRef = docRef.collection('exercises').doc(); 
            batch.set(exerciseRef, exercise);
          });
          return batch.commit().then(() => {

            return docRef.update({ id: docRef.id });
          });
        } else {

          return docRef.update({ id: docRef.id });
        }
      });
  }
  getRoutines(userId: string): Observable<any[]> {
    if (!userId) throw new Error('userId is required'); 
    return this.firestore.collection('users').doc(userId).collection('routines').valueChanges();
  }

  deleteRoutine(userId: string, routineId: string): Promise<void> {
    return this.firestore.collection('users').doc(userId)
      .collection('routines').doc(routineId).delete();
  }

  updateRoutineName(userId: string, routineId: string, newName: string): Promise<void> {
    return this.firestore.collection('users').doc(userId)
      .collection('routines').doc(routineId).update({ name: newName });
  }
  
  getRoutineExercises(userId: string, routineId: string): Observable<any[]> {
    if (!userId || !routineId) {
      throw new Error('userId and routineId are required');
    }
    return this.firestore.collection('users').doc(userId)
      .collection('routines').doc(routineId)
      .collection('exercises').snapshotChanges().pipe(
        map((actions: DocumentChangeAction<any>[]) => {
          console.log('Snapshot actions:', actions);
          return actions.map(action => {
            const data = action.payload.doc.data() as any;
            const id = action.payload.doc.id; 
            console.log('Document data:', data);
            return {
              id: id, 
              daysOfWeek: data.daysOfWeek || [],
              description: data.description || '',
              duration: data.duration || 0,
              name: data.name || '',
              restTime: data.restTime || 0
            };
          });
        })
      );
  }

  // Método para actualizar un ejercicio
deleteExercise(userId: string, routineId: string, exerciseId: string): Observable<void> {
  return from(
    this.firestore.collection('users').doc(userId)
      .collection('routines').doc(routineId)
      .collection('exercises').doc(exerciseId)
      .delete()
  );
}

updateExercise(userId: string, routineId: string, exerciseId: string, updatedExercise: any): Observable<void> {
  return from(
    this.firestore.collection('users').doc(userId)
      .collection('routines').doc(routineId)
      .collection('exercises').doc(exerciseId)
      .update(updatedExercise)
  );
}

}
  
  

