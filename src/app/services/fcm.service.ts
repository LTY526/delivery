import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  uid: string;

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) { 
  }

  initPush() {
    console.log(Capacitor.platform);
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });
 
    PushNotifications.addListener(
      'registration',
      async (token: PushNotificationToken) => {
        console.log('My token (token value): ' + token.value);
        this.afAuth.authState.subscribe(async info => {
          //check so nobody can have same token
          await this.sanitize(token.value);
          this.registerToken(info.uid, token.value);
        });
      }
    );
 
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });
 
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        //console.log('Push received: ' + JSON.stringify(notification));
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );
 
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(data));
        if (data) {
          //to implement
          //this.navCtrl.navigateForward(["/home/" + JSON.stringify(data)]);
          //this.navCtrl.navigateForward(`/home/${data.detailsId}`);
        }
      }
    );
  }

  private registerToken(uid: string, token: string) {
    this.firestore.collection('token').doc(uid).set({value: token});
    console.log("Done");
  }

  async sanitize(token: string) {
    this.firestore.firestore.collection('token').where('token', '==', token).get().then(res => {
      console.log(res.size)
      if(res.size >= 1) {
        res.forEach(item => {
          this.firestore.collection('token').doc(item.id).delete();
        });
      } else { return; }
    });
  }
}
