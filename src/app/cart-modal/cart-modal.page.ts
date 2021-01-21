import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthStateService } from '../services/auth-state.service';
import { Product, CartService } from '../services/cart.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {

  cart: Product[] = [];
 
  constructor(
    public authStateSvc: AuthStateService,
    public cartService: CartService, 
    private modalCtrl: ModalController, 
    private alertCtrl: AlertController,
    private firestore: AngularFirestore,
    private loadingCtrl: LoadingController,
  ) { }
 
  ngOnInit() {
    this.cart = this.cartService.getCart();
  }
 
  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
  }
 
  increaseCartItem(product) {
    this.cartService.addProduct(product);
  }
 
  removeCartItem(product) {
    this.cartService.removeProduct(product);
  }
 
  getTotal() {
    return 5 + this.cart.reduce((i, j) => i + j.price * j.amount, 0);
  }
 
  close() {
    this.modalCtrl.dismiss();
  }
 
  async checkout() {
    if(this.cart.length <= 0) {
      let alert = await this.alertCtrl.create({
        header: 'Warning!',
        message: 'You have no items in the cart.',
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    if(this.cartService.address == null) {
      let alert = await this.alertCtrl.create({
        header: 'Warning!',
        message: 'No Address',
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    //delivery information????
    let order = {
      customerUID: this.authStateSvc.uid,
      order: this.cart,
      deliveryAdress: this.cartService.address,
      timestamp: firebase.default.firestore.Timestamp.fromDate(new Date()),
      status: 'created',
      riderUID: null,
    };
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();
    await this.firestore.collection('order').add(order);
    (await loader).dismiss();
    //Send order to firebase and notification to riderz all the qr shit
    let alert = await this.alertCtrl.create({
      header: 'Thanks for your Order!',
      message: 'We will deliver your items as soon as possible, view your order details at My Orders page',
      buttons: ['OK']
    });
    alert.present().then(() => {
      this.modalCtrl.dismiss();
    });
  }

}
