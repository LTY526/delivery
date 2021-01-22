import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
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
      this.statusColorStyle = "color: yellow; font-size: 15px;"
    } else if(status == "indelivery") {
      this.statusColorStyle = "color: green; font-size: 15px;"
    }
  }

  scanQrCode() {
    this.qrdata = null;
    this.barcodeScanner.scan().then(barcodeData => {
      console.log(barcodeData, this.qrdata, barcodeData.text);
      this.assignqrvalue(barcodeData.text)
    }).catch(err => {
      console.log('Error', err);
    });
  }
  
  //test function
  assignqrvalue(value: any) {
    if(value) {
      this.qrdata = value;
    } else {
      this.qrdata = "12312412312123";
    }
  }

  verifyDelivery() {
    //to be implemented
  }

  myBackButton(){
    this.navCtrl.pop();
  }
}