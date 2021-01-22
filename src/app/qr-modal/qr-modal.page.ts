import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.page.html',
  styleUrls: ['./qr-modal.page.scss'],
})
export class QrModalPage implements OnInit {

  qrdata: any;
  elementType: 'url' | 'canvas' | 'img' = 'canvas';
  
  constructor(
    private navParam: NavParams,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
  ) { 
    this.qrdata = this.navParam.get('data');
    console.log(this.qrdata);
  }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
