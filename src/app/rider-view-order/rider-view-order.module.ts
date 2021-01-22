import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiderViewOrderPageRoutingModule } from './rider-view-order-routing.module';

import { RiderViewOrderPage } from './rider-view-order.page';
import { NgxQRCodeModule } from 'ngx-qrcode2'
import { QrModalPageModule } from '../qr-modal/qr-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiderViewOrderPageRoutingModule,
    NgxQRCodeModule,
    QrModalPageModule,
  ],
  declarations: [RiderViewOrderPage]
})
export class RiderViewOrderPageModule {}
