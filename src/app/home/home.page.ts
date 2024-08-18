import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';
import { RoutineModalPage } from '../routine-modal/routine-modal.page';
import { Timestamp } from 'firebase/firestore'; // Importar correctamente

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
      this.routines = routines.map(routine => {
        let creationDate = routine.creationDate;
        if (creationDate instanceof Timestamp) {
          creationDate = creationDate.toDate();
        } else if (typeof creationDate === 'object' && creationDate.hasOwnProperty('seconds')) {
          creationDate = new Date(creationDate.seconds * 1000);
        }
        return {
          ...routine,
          creationDate
        };
      });
    });
  }

  openRoutineDetails(routine: any) {
    console.log('Detalles de la rutina:', routine);
  }
}
