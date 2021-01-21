import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-select-map-modal',
  templateUrl: './select-map-modal.page.html',
  styleUrls: ['./select-map-modal.page.scss'],
})
export class SelectMapModalPage implements OnInit {

  image: string = '../../assets/fake-map.PNG';
  
  constructor(
    private modalCtrl: ModalController,
    private cartSvc: CartService,
  ) { }

  ngOnInit() {
  }

  close() {
    this.cartSvc.address = "Jalan Ayer Keroh Lama";
    this.modalCtrl.dismiss();
  }
}
