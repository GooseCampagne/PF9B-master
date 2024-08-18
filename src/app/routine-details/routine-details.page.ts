import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoutineService } from '../services/routine.service';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-routine-details',
  templateUrl: './routine-details.page.html',
  styleUrls: ['./routine-details.page.scss'],
})
export class RoutineDetailsPage implements OnInit {
  routineId: string = '';
  exercises$: Observable<any[]> = of([]); // Inicializa con un observable vacío

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private routineService: RoutineService
  ) {}

  ngOnInit() {
    this.routineId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Routine ID:', this.routineId);

    if (this.routineId) {
      this.authService.user$.subscribe(user => {
        console.log('User:', user);
        if (user) {
          console.log('Fetching exercises for user:', user.uid);
          this.exercises$ = this.routineService.getRoutineExercises(user.uid, this.routineId);
        } else {
          console.error('No user found');
        }
      });
    } else {
      console.error('No routine ID found');
    }
  }
  // Método para eliminar un ejercicio
  deleteExercise(exerciseId: string) {
    this.authService.user$.pipe(
      switchMap(user => {
        if (user && this.routineId) {
          if (!exerciseId) {
            throw new Error('exerciseId is required');
          }
          return this.routineService.deleteExercise(user.uid, this.routineId, exerciseId);
        } else {
          console.error('No user or routine ID found');
          return of(null);
        }
      })
    ).subscribe(
      () => {
        console.log('Exercise deleted');
        // Opcional: Refresca la lista de ejercicios después de la eliminación
        this.ngOnInit();
      },
      error => {
        console.error('Error deleting exercise:', error);
      }
    );
  }
  // Método para actualizar un ejercicio
  updateExercise(exerciseId: string, updatedExercise: any) {
    this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.routineService.updateExercise(user.uid, this.routineId, exerciseId, updatedExercise);
        } else {
          console.error('No user found');
          return of(null);
        }
      })
    ).subscribe(
      () => {
        console.log('Exercise updated');
        // Opcional: Refresca la lista de ejercicios después de la actualización
        this.ngOnInit();
      },
      error => {
        console.error('Error updating exercise:', error);
      }
    );
  }
  // Método para actualizar un ejercicio
  editExercise(exercise: any) {
    // Ejemplo de actualización: añade 10 minutos a la duración
    const updatedExercise = {
      ...exercise,
      duration: exercise.duration + 10
    };

    this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.routineService.updateExercise(user.uid, this.routineId, exercise.id, updatedExercise);
        } else {
          console.error('No user found');
          return of(null);
        }
      })
    ).subscribe(
      () => {
        console.log('Exercise updated');
        // Opcional: Refresca la lista de ejercicios después de la actualización
        this.ngOnInit();
      },
      error => {
        console.error('Error updating exercise:', error);
      }
    );
  }
}
