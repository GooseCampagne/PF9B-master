import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';
import { RoutineModalPage } from '../routine-modal/routine-modal.page';
import { Router } from '@angular/router'; // Importa Router aquí
import { Timestamp } from 'firebase/firestore'; // Importar Timestamp correctamente
import { Observable } from 'rxjs';
import { of } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  routines: any[] = [];
  user: any;
  userPhoto$: Observable<string> = of(''); // Usa Observable<string> para la URL de la foto

  constructor(
    private modalController: ModalController,
    private routineService: RoutineService,
    private authService: AuthService,
    private router: Router // Inyecta Router aquí
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.loadRoutines();
        this.userPhoto$ = this.authService.userPhotoURL; // Asigna el Observable de la URL de la foto
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
        console.log('Routine loaded:', routine); // Verifica los datos aquí
        return {
          ...routine,
          creationDate
        };
      });
    });
  }

  openRoutineDetails(routine: any) {
    console.log('Routine ID:', routine.id);
    if (routine.id) {
      this.router.navigate([`/routine-details/${routine.id}`]);
    } else {
      console.error('Routine ID is missing');
    }
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
