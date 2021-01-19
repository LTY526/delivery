import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../services/cart.service';
import { CartModalPage } from '../cart-modal/cart-modal.page';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})

export class ShopPage implements OnInit {
  shopID: any;
  cart = [];
  products = [];
  cartItemCount: BehaviorSubject<number>;

  @ViewChild('cart', {static: false, read: ElementRef})fab: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private cartSvc: CartService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.shopID = this.activatedRoute.snapshot.paramMap.get('id');
    this.products = this.cartSvc.getProduct(this.shopID);
    console.log(this.products);
    this.cart = this.cartSvc.getCart();
    this.cartItemCount = this.cartSvc.getCartItemCount();
  }

  myBackButton(){
    this.navCtrl.pop();
  }

  addToCart(item) {
    this.cartSvc.addProduct(item);
    this.animateCSS('tada');
  }

  async openCart() {
    this.animateCSS('bounceOutLeft', true);

    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.onWillDismiss().then(() => {
      this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft')
    });
    modal.present();
  }

  animateCSS(animationName, keepAnimated = false) {
    const node = this.fab.nativeElement;
    node.classList.add('animated', animationName)
    
    //https://github.com/daneden/animate.css
    function handleAnimationEnd() {
      if (!keepAnimated) {
        node.classList.remove('animated', animationName);
      }
      node.removeEventListener('animationend', handleAnimationEnd)
    }
    node.addEventListener('animationend', handleAnimationEnd)
  }
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  amount: number
}