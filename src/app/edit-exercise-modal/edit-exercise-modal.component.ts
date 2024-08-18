import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-exercise-modal',
  templateUrl: './edit-exercise-modal.component.html',
  styleUrls: ['./edit-exercise-modal.component.scss'],
})
export class EditExerciseModalComponent {
  @Input() exercise: any;
  updatedExercise: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.updatedExercise = { ...this.exercise };
  }

  save() {
    this.modalController.dismiss(this.updatedExercise);
  }

  close() {
    this.modalController.dismiss();
  }
}
