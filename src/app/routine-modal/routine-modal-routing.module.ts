import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutineModalPage } from './routine-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RoutineModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutineModalPageRoutingModule {}
