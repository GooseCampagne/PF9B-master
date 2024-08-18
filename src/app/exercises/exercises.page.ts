import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage implements OnInit {
  goal: string = ''; // Inicializa con una cadena vacía
  exercises: string[] = []; // Aquí puedes definir los ejercicios según la meta

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const goalType = this.route.snapshot.paramMap.get('goalType');
    this.goal = goalType ? goalType : ''; // Maneja el caso de null
    this.loadExercisesForGoal(this.goal);
  }

  loadExercisesForGoal(goal: string) {
    // Aquí debes definir qué ejercicios cargar según la meta
    switch (goal) {
      case 'bajar-de-peso':
        this.exercises = ['Correr', 'Nadar', 'Ciclismo'];
        break;
      case 'ganar-musculo':
        this.exercises = ['Levantamiento de pesas', 'Flexiones', 'Sentadillas'];
        break;
      case 'mantenerme-sano':
        this.exercises = ['Yoga', 'Pilates', 'Caminar'];
        break;
      default:
        this.exercises = [];
    }
  }
}
