import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { from, } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  getRoutineDetails(userId: string, routineId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId)
      .collection('routines').doc(routineId)
      .valueChanges(); // Devuelve un Observable
  }
  constructor(private firestore: AngularFirestore) {}

  addRoutine(routine: any): Promise<void> {
    const userId = routine.userId;
    if (!userId) throw new Error('userId is required'); // Verifica que userId esté presente

    // Eliminar userId del objeto de rutina para evitar guardarlo en el campo de datos
    const { userId: _, exercises, ...routineData } = routine;

    // Añadir un campo de fecha de creación
    routineData.createdAt = new Date();

    // Añadir la rutina y obtener el ID del documento creado
    return this.firestore.collection('users').doc(userId).collection('routines').add(routineData)
      .then(docRef => {
        // Añadir ejercicios si existen
        if (exercises && exercises.length > 0) {
          const batch = this.firestore.firestore.batch();
          exercises.forEach((exercise: any) => {
            const exerciseRef = docRef.collection('exercises').doc(); // Crear un nuevo documento para cada ejercicio
            batch.set(exerciseRef, exercise);
          });
          return batch.commit().then(() => {
            // Una vez creado el documento, actualízalo con el ID generado
            return docRef.update({ id: docRef.id });
          });
        } else {
          // Si no hay ejercicios, solo actualiza el documento con el ID generado
          return docRef.update({ id: docRef.id });
        }
      });
  }
  getRoutines(userId: string): Observable<any[]> {
    if (!userId) throw new Error('userId is required'); // Verifica que userId esté presente
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
            const id = action.payload.doc.id; // Obtén el ID del documento
            console.log('Document data:', data);
            return {
              id: id, // Incluye el ID en el objeto devuelto
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
// src/app/services/routine.service.ts

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
  
  

