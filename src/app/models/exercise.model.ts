export interface Exercise {
    name: string;
    description: string;
    duration: number; // Duración en minutos
    daysOfWeek: string[]; // Días de la semana seleccionados
    restTime: number; // Tiempo de descanso en minutos
  }
  