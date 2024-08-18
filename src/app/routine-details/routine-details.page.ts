import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importar Router
import { AuthService } from '../services/auth.service';
import { RoutineService } from '../services/routine.service';
import { Observable, of, switchMap } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { EditExerciseModalComponent } from '../edit-exercise-modal/edit-exercise-modal.component';

@Component({
  selector: 'app-routine-details',
  templateUrl: './routine-details.page.html',
  styleUrls: ['./routine-details.page.scss'],
})
export class RoutineDetailsPage implements OnInit {
  routineId: string = '';
  routineName: string = ''; // Agregada la propiedad
  userId: string = ''; // Agregada la propiedad
  exercises$: Observable<any[]> = of([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Añadido Router
    private authService: AuthService,
    private routineService: RoutineService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.routineId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Routine ID:', this.routineId);

    if (this.routineId) {
      this.authService.user$.subscribe(user => {
        console.log('User:', user);
        if (user) {
          this.userId = user.uid; // Establecer userId
          console.log('Fetching exercises for user:', this.userId);
          this.exercises$ = this.routineService.getRoutineExercises(this.userId, this.routineId);
          this.routineService.getRoutineDetails(this.userId, this.routineId).subscribe(details => {
            this.routineName = details?.name || ''; // Cargar nombre de la rutina
          });
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
        this.ngOnInit(); // Refresca la lista de ejercicios
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
        this.ngOnInit(); // Refresca la lista de ejercicios
      },
      error => {
        console.error('Error updating exercise:', error);
      }
    );
  }

  async editExercise(exercise: any) {
    const modal = await this.modalController.create({
      component: EditExerciseModalComponent,
      componentProps: { exercise }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.authService.user$.pipe(
          switchMap(user => {
            if (user && this.routineId) {
              return this.routineService.updateExercise(user.uid, this.routineId, exercise.id, result.data);
            } else {
              console.error('No user or routine ID found');
              return of(null);
            }
          })
        ).subscribe(
          () => {
            console.log('Exercise updated');
            this.ngOnInit(); // Refresca la lista de ejercicios
          },
          error => {
            console.error('Error updating exercise:', error);
          }
        );
      }
    });
  
    return await modal.present();
  }

  // Método para actualizar el nombre de la rutina
  async updateRoutineName() {
    const newName = prompt('Enter new routine name:', this.routineName);
    if (newName && newName.trim()) {
      try {
        await this.routineService.updateRoutineName(this.userId, this.routineId, newName.trim());
        this.routineName = newName.trim();
      } catch (error) {
        console.error('Error updating routine name:', error);
      }
    }
  }

  async openEditExerciseModal(exerciseId: string) {
    const modal = await this.modalController.create({
      component: EditExerciseModalComponent,
      componentProps: { exerciseId }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.authService.user$.pipe(
          switchMap(user => {
            if (user && this.routineId) {
              return this.routineService.updateExercise(user.uid, this.routineId, exerciseId, result.data);
            } else {
              console.error('No user or routine ID found');
              return of(null);
            }
          })
        ).subscribe(
          () => {
            console.log('Exercise updated');
            this.exercises$ = this.routineService.getRoutineExercises(this.userId, this.routineId);
          },
          error => {
            console.error('Error updating exercise:', error);
          }
        );
      }
    });
  
    return await modal.present();
  }

  deleteRoutine() {
    this.authService.user$.pipe(
      switchMap(user => {
        if (user && this.routineId) {
          return this.routineService.deleteRoutine(user.uid, this.routineId);
        } else {
          console.error('No user or routine ID found');
          return of(null);
        }
      })
    ).subscribe(
      () => {
        console.log('Routine deleted');
        // Redirige al home después de eliminar
        this.router.navigate(['/home']); // Usa router aquí
      },
      error => {
        console.error('Error deleting routine:', error);
      }
    );
  }
}
