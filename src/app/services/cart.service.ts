import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  runcit: Product[] = [
    {id: 'r01', name: '5KG Oil', price: 30, image: '../../assets/runcit/oil5kg.jpg', amount: 0},
    {id: 'r02', name: '5KG Rice', price: 25, image: '../../assets/runcit/beras5kg.jpeg', amount: 0},
    {id: 'r03', name: '12 Eggs', price: 5, image: '../../assets/runcit/egg.png', amount: 0},
  ];
  tesco: Product[] = [
    {id: 't01', name: 'Toilet Paper', price: 15, image: '../../assets/tesco/toilet-paper.jpg', amount: 0},
    {id: 't02', name: 'Dishwasher Liquid', price: 10, image: '../../assets/tesco/dishwasher-liquid.jpg', amount: 0},
    {id: 't03', name: 'Face Mask', price: 10, image: '../../assets/tesco/face-mask.jpg', amount: 0},
  ];
  vegetable: Product[] = [
    {id: 'v01', name: 'Cabbage 100g', price: 5, image: '../../assets/vegetable/cabbage.jpg', amount: 0},
    {id: 'v02', name: 'Carrot 100g', price: 3, image: '../../assets/vegetable/carrot.jpg', amount: 0},
    {id: 'v03', name: 'Kailan 100g', price: 3, image: '../../assets/vegetable/kailan.jpg', amount: 0},
  ];

  private cart = [];
  private cartItemCount = new BehaviorSubject(0);

  public address: string;

  constructor() { }
  
  getProduct(shopID) {
    if(shopID == 1) {
      return this.runcit;
    } else if(shopID == 2) {
      return this.vegetable;
    } else if(shopID == 3) {
      return this.tesco;
    } else {
      console.log("Selection does not exist.");
    }
  }

  getCart() {
    return this.cart;
  }

  getCartItemCount() {
    return this.cartItemCount;
  }

  addProduct(product) {
    let added = false;
    for (let p of this.cart) {
      if (p.id === product.id) {
        p.amount = p.amount + 1;
        added = true;
        break;
      }
    }
    if (!added) {
      product.amount = 1;
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);
  }

  decreaseProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        p.amount -= 1;
        if (p.amount == 0) {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }

  removeProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
      }
    }
  }
}
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  amount: number
}