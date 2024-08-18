import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service';
import { RoutineService } from '../services/routine.service';
import { Observable, of, switchMap } from 'rxjs';
import { ModalController, AlertController } from '@ionic/angular';
import { EditExerciseModalComponent } from '../edit-exercise-modal/edit-exercise-modal.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-routine-details',
  templateUrl: './routine-details.page.html',
  styleUrls: ['./routine-details.page.scss'],
})
export class RoutineDetailsPage implements OnInit {
  routineId: string = '';
  routineName: string = ''; 
  userId: string = ''; 
  exercises$: Observable<any[]> = of([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private routineService: RoutineService,
    private modalController: ModalController,
    private location: Location,
    private alertController: AlertController 
  ) {}

  ngOnInit() {
    this.routineId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Routine ID:', this.routineId);

    if (this.routineId) {
      this.authService.user$.subscribe(user => {
        console.log('User:', user);
        if (user) {
          this.userId = user.uid; 
          console.log('Fetching exercises for user:', this.userId);
          this.exercises$ = this.routineService.getRoutineExercises(this.userId, this.routineId);
          this.routineService.getRoutineDetails(this.userId, this.routineId).subscribe(details => {
            this.routineName = details?.name || ''; 
          });
        } else {
          console.error('No user found');
        }
      });
    } else {
      console.error('No routine ID found');
    }
  }

  async endRoutine() {
    const alert = await this.alertController.create({
      header: 'Terminar Rutina',
      message: 'Excelente, estás a puto de terminar la rutina, toma un descanso!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteRoutine();
          }
        }
      ]
    });

    await alert.present();
  }

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
        this.ngOnInit(); 
      },
      error => {
        console.error('Error deleting exercise:', error);
      }
    );
  }

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
        this.ngOnInit(); 
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

  async deleteRoutine() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.performDeleteRoutine();
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  performDeleteRoutine() {
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
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error deleting routine:', error);
      }
    );
  }
  

  goBack() {
    this.location.back(); 
  }
}
