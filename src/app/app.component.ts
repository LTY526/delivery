import { Component, OnInit } from '@angular/core';

import { AlertController, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthStateService } from './services/auth-state.service'
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastService } from './services/toast.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/folder/Main',
      icon: 'home'
    },
    {
      title: 'My Orders',
      url: '/folder/Orders',
      icon: 'checkmark-done-circle'
    },
    {
      title: 'Profile',
      url: '/folder/Profile',
      icon: 'person-circle'
    },
  ];
  public riderappPages = [
    {
      title: 'Home',
      url: '/folder/RiderMain',
      icon: 'home'
    },
    {
      title: 'Other Function',
      url: '/folder/RiderOFunc',
      icon: 'paper-plane'
    },
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authStateSvc: AuthStateService,
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private navCtrl: NavController,
    private toastSvc: ToastService,
    private afAuth: AngularFireAuth,
    private fcmService: FcmService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcmService.initPush();
    });
  }

  async ngOnInit() {
    await this.authStateSvc.init();
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      if(this.authStateSvc.rider == true) {
        this.selectedIndex = this.riderappPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
      } else if(this.authStateSvc.customer == true) {
        this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
      }
    }
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Logout',
      message: 'Are you sure?',
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary', handler: () => { console.log('Logout cancelled'); }}, 
        { text: 'Yes', handler: () => { this.logout(); } }
      ]
    });
    await alert.present();
  }

  async logout() {
    await this.firestore.collection('token').doc(this.authStateSvc.uid).delete();
    await this.afAuth.signOut();
    this.toastSvc.showToast("Goodbye");
    this.navCtrl.navigateRoot("/login");
  }
}
