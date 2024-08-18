import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-routine-modal',
  templateUrl: './routine-modal.page.html',
  styleUrls: ['./routine-modal.page.scss'],
})
export class RoutineModalPage {
  @Input() userId: string = ''; // Inicializa con un valor predeterminado (vacío en este caso)
  routine: any = {}; // Asegúrate de definir cómo es el objeto routine

  constructor(
    private modalController: ModalController,
    private routineService: RoutineService,
    private authService: AuthService
  ) {}

  async saveRoutine() {
    if (this.userId) {
      this.routine.userId = this.userId; // Asegúrate de agregar userId al objeto routine
      try {
        await this.routineService.addRoutine(this.routine);
        this.modalController.dismiss();
      } catch (error) {
        console.error('Error al guardar la rutina', error);
      }
    } else {
      console.error('userId is required');
    }
  }

  async deleteRoutine() {
    if (this.routine.id && this.userId) {
      try {
        await this.routineService.deleteRoutine(this.userId, this.routine.id);
        this.modalController.dismiss();
      } catch (error) {
        console.error('Error al eliminar la rutina', error);
      }
    }
  }

  removeExercise(index: number) {
    if (this.routine.exercises) {
      this.routine.exercises.splice(index, 1);
    }
  }

  addExercise() {
    if (!this.routine.exercises) {
      this.routine.exercises = [];
    }
    this.routine.exercises.push({ name: '', duration: 0, description: '' });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
