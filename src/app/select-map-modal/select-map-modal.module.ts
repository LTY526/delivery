import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectMapModalPageRoutingModule } from './select-map-modal-routing.module';

import { SelectMapModalPage } from './select-map-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectMapModalPageRoutingModule
  ],
  declarations: [SelectMapModalPage]
})
export class SelectMapModalPageModule {}
