import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RoutineService } from '../services/routine.service';
import { Exercise } from '../models/exercise.model'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-routine-modal',
  templateUrl: './routine-modal.page.html',
  styleUrls: ['./routine-modal.page.scss'],
})
export class RoutineModalPage {
  routine = {
    name: '',
    exercises: [] as Exercise[], // Utiliza la interfaz Exercise
    creationDate: new Date(),
    totalDuration: 0,
    userId: ''
  };

  constructor(
    private modalController: ModalController,
    private routineService: RoutineService
  ) {}

  addExercise() {
    this.routine.exercises.push({
      name: '',
      description: '',
      duration: 0,
      daysOfWeek: [],
      restTime: 0
    });
  }

  removeExercise(index: number) {
    this.routine.exercises.splice(index, 1);
  }

  async saveRoutine() {
    this.routine.totalDuration = this.routine.exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
    await this.routineService.addRoutine(this.routine);
    this.modalController.dismiss();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
