import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewOrderPageRoutingModule } from './view-order-routing.module';

import { ViewOrderPage } from './view-order.page';
import { NgxQRCodeModule } from 'ngx-qrcode2'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewOrderPageRoutingModule,
    NgxQRCodeModule
  ],
  declarations: [ViewOrderPage]
})
export class ViewOrderPageModule {}
