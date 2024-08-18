import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-exercise-modal',
  templateUrl: './edit-exercise-modal.component.html',
  styleUrls: ['./edit-exercise-modal.component.scss'],
})
export class EditExerciseModalComponent {
  @Input() exercise: any;
  updatedExercise: any = {};
  isFormValid: boolean = true;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.updatedExercise = { ...this.exercise };
  }

  save() {
    this.isFormValid = this.validateForm();
    if (this.isFormValid) {
      this.modalController.dismiss(this.updatedExercise);
    }
  }

  close() {
    this.modalController.dismiss();
  }

  private validateForm(): boolean {
    // Validate if all fields are filled
    return this.updatedExercise.name &&
           this.updatedExercise.description &&
           this.updatedExercise.duration &&
           this.updatedExercise.restTime &&
           this.updatedExercise.daysOfWeek && this.updatedExercise.daysOfWeek.length > 0;
  }
}
