import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';
import { RoutineModalPage } from '../routine-modal/routine-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  routines: any[] = [];
  user: any;

  constructor(
    private modalController: ModalController,
    private routineService: RoutineService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.loadRoutines();
      }
    });
  }

  async openRoutineModal() {
    const modal = await this.modalController.create({
      component: RoutineModalPage,
      componentProps: { userId: this.user.uid }
    });
    modal.onDidDismiss().then(() => {
      this.loadRoutines();
    });
    await modal.present();
  }

  loadRoutines() {
    this.routineService.getRoutines(this.user.uid).subscribe(routines => {
      this.routines = routines;
    });
  }

  // Implementa el método openRoutineDetails
  openRoutineDetails(routine: any) {
    // Aquí puedes implementar la lógica para abrir los detalles de la rutina.
    // Puede ser un modal o redirigir a otra página.
    console.log('Detalles de la rutina:', routine);
  }
}
