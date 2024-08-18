import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutineModalPageRoutingModule } from './routine-modal-routing.module';

import { RoutineModalPage } from './routine-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoutineModalPageRoutingModule
  ],
  declarations: [RoutineModalPage]
})
export class RoutineModalPageModule {}
