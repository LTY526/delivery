import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { AuthStateService } from '../services/auth-state.service';
import { CartService } from '../services/cart.service';
import { ToastService } from '../services/toast.service';
import * as firebase from 'firebase/app';
import { QrModalPage } from '../qr-modal/qr-modal.page';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-rider-view-order',
  templateUrl: './rider-view-order.page.html',
  styleUrls: ['./rider-view-order.page.scss'],
})
export class RiderViewOrderPage implements OnInit {
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
  customerName: string;

  statusColorStyle: string;

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
    private modalCtrl: ModalController,
    private functions: AngularFireFunctions,
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
      if(res.data().customerUID) {
        this.firestore.firestore.collection('userInformation').doc(res.data().customerUID).get().then(ress => {
          this.customerName = ress.data().realName;
        });
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
    }
  }

  async beginDelivery() {
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();
    await this.firestore.collection('order').doc(this.orderID).update({
      riderUID: this.authStateSvc.uid,
      status: 'indelivery',
      updated: firebase.default.firestore.Timestamp.fromDate(new Date()),
      updatedBy: 'rider',
    });
    this.notifyCustomerCloudFunction(this.orderID, 'indelivery');
    (await loader).dismiss();
    this.toastSvc.showToast("Status updated, begin delivery.")
  }

  notifyCustomerCloudFunction(orderID: string, status: string) {
    console.log("notifyCustomerCloudFunction: reached")
    const callable = this.functions.httpsCallable('notifyTheCustomer');
    const obs = callable({
      orderID: orderID,
      status: status,
      riderUID: this.authStateSvc.uid,
    });
    obs.subscribe();
  }
  
  async generateQRCode() {
    this.qrdata = this.orderID.concat(",").concat(this.authStateSvc.uid);
    console.log(this.qrdata);
    let modal = await this.modalCtrl.create({
      component: QrModalPage,
      componentProps: { data: this.qrdata },
    });
    modal.present();
  }

  myBackButton(){
    this.navCtrl.pop();
  }
}
