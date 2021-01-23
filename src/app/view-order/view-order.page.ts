import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthStateService } from '../services/auth-state.service';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service';
import * as firebase from 'firebase/app';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {
  orderID: string;
  order: any;
  customerUID: string;
  riderUID: string;
  total: number;
  deliveryAddress: string;
  status: string;
  created: any;
  updatedBy: string;
  date: any;
  duration: any;
  updated: any
  dateNow: any;

  statusColorStyle: string;
  riderName: string;

  elementType: 'url' | 'canvas' | 'img' = 'canvas';
  qrdata: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public authStateSvc: AuthStateService, 
    private loadingCtrl: LoadingController,
    private toastSvc: ToastService,
    private firestore: AngularFirestore,
    public cartSvc: CartService,
    private barcodeScanner: BarcodeScanner,
    private functions: AngularFireFunctions,
    private alertController: AlertController,
  ) { }

  async ngOnInit() {
    this.orderID = this.activatedRoute.snapshot.paramMap.get('id');
    this.dateNow = firebase.default.firestore.Timestamp.fromDate(new Date());
    await this.loadOrder(this.orderID);
  }

  async loadOrder(orderID: string) {
    this.firestore.firestore.collection('order').doc(orderID).onSnapshot(res => {
      this.order = res.data().order;
      this.customerUID = res.data().customerUID;
      this.riderUID = res.data().riderUID;
      this.total = res.data().total;
      this.deliveryAddress = res.data().deliveryAddress;
      this.status = res.data().status;
      this.created = res.data().created;
      this.updatedBy = res.data().updatedBy;
      this.date = res.data().created.toDate();
      this.duration = this.dateNow - res.data().created;
      this.updated = this.dateNow - res.data().updated;
      if(res.data().status != null) {
        this.statusColor(res.data().status);
      }
      if(res.data().riderUID != null) {
        this.firestore.firestore.collection('userInformation').doc(res.data().riderUID).get().then(ress => {
          this.riderName = ress.data().realName;
        })
      }
    });
  }

  statusColor(status: string) {
    if(status == "created") {
      this.statusColorStyle = "color: orange; font-size: 15px;"
    } else if(status == "pickup") {
      this.statusColorStyle = "color: orange; font-size: 15px;"
    } else if(status == "indelivery") {
      this.statusColorStyle = "color: green; font-size: 15px;"
    } else {
      this.statusColorStyle = "font-size: 15px;"
    }
  }

  scanQrCode() {
    this.qrdata = null;
    this.barcodeScanner.scan().then(async barcodeData => {
      console.log(barcodeData, this.qrdata, barcodeData.text);
      if(barcodeData.text) {
        let orderID = barcodeData.text.substring(0, barcodeData.text.indexOf(','));
        let riderUID = barcodeData.text.substring((barcodeData.text.indexOf(',') + 1));
        if(orderID == this.orderID) {
          this.verifyDelivery(barcodeData.text);
        } else {
          const alert = await this.alertController.create({
            header: 'Wrong code.',
            message: 'Make sure you are scanning for the correct order.',
            buttons: ['OK']
          });
          await alert.present();
        }
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  async verifyDelivery(barcodeData: string) {
    let orderID = barcodeData.substring(0, barcodeData.indexOf(','));
    let riderUID = barcodeData.substring((barcodeData.indexOf(',') + 1));
    console.log(orderID, riderUID);

    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    const callable = this.functions.httpsCallable('verifyTheOrder');
    const obs = callable({
      orderID: orderID,
      riderUID: riderUID,
      customerUID: this.authStateSvc.uid,
    });
    console.log(obs);
    obs.subscribe(async res => {
      if(res) {
        console.log(res);
        if(res.result == true) {
          const alert = await this.alertController.create({
            header: 'Order delivered.',
            message: 'Enjoy the products.',
            buttons: ['OK']
          });
          await alert.present();
        } else {
          const alert = await this.alertController.create({
            header: 'Something wrong happened.',
            message: 'Please try again.',
            buttons: ['OK']
          });
          await alert.present();
        }
        (await loader).dismiss();
      }
    });
  }

  myBackButton(){
    this.navCtrl.pop();
  }
}