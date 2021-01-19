import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.page.html',
  styleUrls: ['./shop-list.page.scss'],
})
export class ShopListPage implements OnInit {

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  openShop(shopID: number) {
    console.log(shopID);
    this.navCtrl.navigateForward(["/shop/" + shopID])
  }

  myBackButton(){
    this.navCtrl.pop();
  }

}
