import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrModalPageRoutingModule } from './qr-modal-routing.module';

import { QrModalPage } from './qr-modal.page';
import { NgxQRCodeModule } from 'ngx-qrcode2'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrModalPageRoutingModule,
    NgxQRCodeModule,
  ],
  declarations: [QrModalPage]
})
export class QrModalPageModule {}
