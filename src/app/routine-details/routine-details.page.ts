import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoutineService } from '../services/routine.service';
import { Observable, of } from 'rxjs';

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
}
