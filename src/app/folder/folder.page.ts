import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { AuthStateService } from '../services/auth-state.service';
import { PhotoService } from '../services/photo.service';
import * as firebase from 'firebase/app';
import { ToastService } from '../services/toast.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { SelectMapModalPage } from '../select-map-modal/select-map-modal.page';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  dateNow: any;
  public folder: string;
  public profileForm: FormGroup;
  //homepage
  canBeginShop: boolean = false;
  //order page
  orderListObj = {};
  orderList = [];
  //profile page
  info: any[] = [];
  private itemsCollection: AngularFirestoreCollection<any>;
  realName: string;
  phoneNumber: string;
  address: string;
  email: string;
  image: any;
  completeProfile: boolean;
  enableEdit: boolean = false;
  profileImageURL: string;

  //rider home page
  neworderListObj = {};
  neworderList = [];

  //rider order page
  riderOrderListObj = {};
  riderOrderList = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    public authStateSvc: AuthStateService, 
    public photoService: PhotoService,
    private loadingCtrl: LoadingController,
    private toastSvc: ToastService,
    private firestore: AngularFirestore,
    private modalCtrl: ModalController,
    public cartSvc: CartService,
    private alertCtrl: AlertController,
  ) { 
    this.profileForm = formBuilder.group({
      email: [
        '',
      ],
      phoneNumber: [
        '',
        Validators.compose([Validators.pattern("^[0-9]*$"), Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
      ],
      realName: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(99), Validators.minLength(10)]),
      ],
      address: [
        '',
        Validators.compose([Validators.required]),
      ],
    });
  }

  async ngOnInit() {
    this.dateNow = firebase.default.firestore.Timestamp.fromDate(new Date());
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    await this.loadProfile(this.authStateSvc.uid);
    if(this.authStateSvc.customer == true) {
      this.getOrders(this.authStateSvc.uid);
    }
    if(this.authStateSvc.rider == true) {
      this.riderGetOrders(this.authStateSvc.uid);
    }
    this.getnewOrders();
  }

  //customer home page
  async pickAddress(selection: number) {
    //reset
    this.cartSvc.address = null;
    this.canBeginShop = false;
    if(selection == 1) {
      this.cartSvc.address = this.address;
      this.canBeginShop = true;
    } else if(selection == 2){
      this.canBeginShop = true;
      let modal = await this.modalCtrl.create({
        component: SelectMapModalPage,
        cssClass: 'select-map-modal'
      });
      modal.present();
    }
  }

  viewShop() {
    this.navCtrl.navigateForward(['/shop-list']);
  }

  //customer order page
  getOrders(uid: string){
    this.firestore.firestore.collection('order').where('customerUID', '==', uid).onSnapshot(res => {
      res.forEach(order => {
        this.orderListObj[order.id] = order.data();
        this.orderListObj[order.id].orderID = order.id;
        this.orderListObj[order.id].date = order.data().created.toDate();
        this.orderListObj[order.id].duration = this.dateNow - order.data().created; //elapsed time
        this.orderListObj[order.id].updated = this.dateNow - order.data().updated; //last updated
        this.orderListObj[order.id].statusColorStyle = this.statusColor(order.data().status);
      });
      this.orderList = Object.values(this.orderListObj);
    });
  }

  statusColor(status: string) {
    if(status == "created") {
      return "color: orange; font-size: 15px;"
    } else if(status == "pickup") {
      return "color: orange; font-size: 15px;"
    } else if(status == "indelivery") {
      return "color: green; font-size: 15px;"
    }
  }

  viewOrder(orderID: string) {
    this.navCtrl.navigateForward(['/view-order/' + orderID]);
  }

  //profile page
  getProfile(uid: string) {
    this.itemsCollection = this.firestore.collection<any>('userInformation', ref => ref.where('uid', '==', uid));
    return this.itemsCollection.snapshotChanges().pipe(map((info: any[]) => {
      this.info = [];

      for (const infos of info) {
        this.info.unshift(infos);
      }
      return this.info;
    }));
  }

  async loadProfile(uid: string) {
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    try {
      this.getProfile(uid).subscribe((data: any) => {
        if(data.length !== 0) {
          this.completeProfile = true;
          this.realName = data[0].payload.doc.data()['realName'];
          this.phoneNumber = data[0].payload.doc.data()['phoneNumber'];
          this.email = data[0].payload.doc.data()['email'];
          this.image = data[0].payload.doc.data()['image'];
          this.address = data[0].payload.doc.data()['address'];
        }
      });
      (await loader).dismiss();
    } catch (e) {
      this.toastSvc.showToast(e);
    }
  }

  openEdit() {
    this.enableEdit = !this.enableEdit;
  }

  async discardEdit() {
    this.enableEdit = !this.enableEdit;
    await this.loadProfile(this.authStateSvc.uid);
  }

  takeImage() {
    this.photoService.addNewProfilePicture();
    console.log("takeImage() done.")
  }

  removePhoto(selection) {
    if(selection == 'photoSvcImg')
      this.photoService.profilePhoto = '';
    else if(selection == 'this.Image')
      this.image = '';
  }

  async uploadImage() {
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    if(this.photoService.profilePhoto != null) {
      try {
        const id = Math.random().toString(36).substring(2);
        const file = this.photoService.profilePhoto;
        const filePath = `user-images/${this.authStateSvc.uid}_profile_${id}`;
        const ref = firebase.default.storage().ref(filePath);
        await ref.putString(file, 'base64', {contentType:'image/jpeg'}).then(function(snapshot) {
          console.log('Uploaded');  //maybe need remove or change to console log
        })
        await ref.getDownloadURL().then(url => {
          try {
            this.profileImageURL = url;
          } catch (e) {
            console.log(e);
            this.toastSvc.showToast(e);
          }
        })
      } catch(e) {
        console.log(e);
        this.toastSvc.showToast(e);
      }
      this.photoService.profilePhoto = null;
      this.image = null;
    }
    (await loader).dismiss();
  }

  async updateInfo(realName, phoneNumber, address) {
    try {
      await this.uploadImage();
    } catch (e) {
      console.log(e);
      this.toastSvc.showToast(e);
    }
    if(this.image && this.profileImageURL == null) {
      const info = {
        email: this.authStateSvc.email,
        uid: this.authStateSvc.uid,
        realName: realName,
        phoneNumber: phoneNumber,
        address: address,
        updatedAt: firebase.default.firestore.Timestamp.fromDate(new Date()),
      }
      this.saveToDb(info);
    } else if(this.profileImageURL) {
      const info = {
        email: this.authStateSvc.email,
        uid: this.authStateSvc.uid,
        realName: realName,
        phoneNumber: phoneNumber,
        address: address,
        updatedAt: firebase.default.firestore.Timestamp.fromDate(new Date()),
        image: this.profileImageURL,
      } 
      this.saveToDb(info);
    } else {
      const info = {
        email: this.authStateSvc.email,
        uid: this.authStateSvc.uid,
        realName: realName,
        phoneNumber: phoneNumber,
        address: address,
        updatedAt: firebase.default.firestore.Timestamp.fromDate(new Date()),
        image: null,
      } 
      this.saveToDb(info);
    }
  }

  async saveToDb(info) {
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    try {
      await this.firestore.collection('userInformation').doc(info.uid).update(info);
    } catch(e) { 
      this.toastSvc.showToast(e); 
    }
    (await loader).dismiss();
    this.toastSvc.showToast("Updated.");
    this.enableEdit = !this.enableEdit;
  }

  //riderorder
  getnewOrders(){
    this.firestore.firestore.collection('order').where('riderUID', '==', null).where('status', '==', 'created').onSnapshot(res => {
      res.forEach(order => {
        this.neworderListObj[order.id] = order.data();
        this.neworderListObj[order.id].orderID = order.id;
        this.neworderListObj[order.id].date = order.data().created.toDate();
        this.neworderListObj[order.id].duration = this.dateNow - order.data().created; //elapsed time
        this.neworderListObj[order.id].updated = this.dateNow - order.data().updated; //last updated
        if(order.data().customerUID) {
          this.firestore.firestore.collection('userInformation').doc(order.data().customerUID).get().then(ress => {
            this.neworderListObj[order.id].customerName = ress.data().realName;
          });
        }
      });
      this.neworderList = Object.values(this.neworderListObj);
    });
  }

  async acceptOrder(orderID: string) {
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();
    await this.firestore.collection('order').doc(orderID).update({
      riderUID: this.authStateSvc.uid,
      status: 'pickup',
      updated: firebase.default.firestore.Timestamp.fromDate(new Date()),
      updatedBy: 'rider',
    });
    (await loader).dismiss();
    this.viewJobOrder(orderID);
    this.toastSvc.showToast("Job accepted.");
  }

  //riderorderpage
  riderGetOrders(riderUID: string){
    this.firestore.firestore.collection('order').where('riderUID', '==', riderUID).onSnapshot(res => {
      res.forEach(order => {
        this.riderOrderListObj[order.id] = order.data();
        this.riderOrderListObj[order.id].orderID = order.id;
        this.riderOrderListObj[order.id].date = order.data().created.toDate();
        this.riderOrderListObj[order.id].duration = this.dateNow - order.data().created; //elapsed time
        this.riderOrderListObj[order.id].updated = this.dateNow - order.data().updated; //last updated
        this.riderOrderListObj[order.id].statusColorStyle = this.statusColor(order.data().status);
        if(order.data().customerUID) {
          this.firestore.firestore.collection('userInformation').doc(order.data().customerUID).get().then(ress => {
            this.riderOrderListObj[order.id].customerName = ress.data().realName;
          });
        }
      });
      this.riderOrderList = Object.values(this.riderOrderListObj);
    });
  }

  viewJobOrder(orderID: string) {
    this.navCtrl.navigateForward(['/rider-view-order/' + orderID]);
  }

}
