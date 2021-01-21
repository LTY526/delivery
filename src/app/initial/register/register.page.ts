import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: string;
  password: string;
  confirmPwd: string;
  constructor(
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private toastSvc: ToastService,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
  }

  async register(role: string) {
    if(this.validateForm()) {
      let loader = this.loadingCtrl.create({
        message: "Please wait..."
      });
      (await loader).present();

      try {
        await this.afAuth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(data => {
            if(role == 'rider') {
              this.firestore.collection('roleList').doc(data.user.uid).set({
                rider: true,
                customer: false,
              });
            } else if(role == 'customer') {
              this.firestore.collection('roleList').doc(data.user.uid).set({
                rider: false,
                customer: true,
              });
            }
            this.firestore.collection('userInformation').doc(data.user.uid).set({
              email: data.user.email,
              uid: data.user.uid,
              timestamp: firebase.default.firestore.Timestamp.fromDate(new Date()),
            })
            this.toastSvc.showToast("Created successfuly. Please log in now.");
            this.navCtrl.navigateRoot("/login");
          });
      } catch(e) { this.toastSvc.showToast(e); console.log(e) }

      (await loader).dismiss();
    }

  }

  validateForm() {
    if(!this.email) {
      this.toastSvc.showToast("Enter your Email");
      return false;
    }
    if(!this.password) {
      this.toastSvc.showToast("Enter your Password");
      return false;
    }
    if(!this.confirmPwd) {
      this.toastSvc.showToast("Enter your Confirm Password");
      return false;
    }
    if(!this.password.match(this.confirmPwd)) {
      this.toastSvc.showToast("Passwords do not match");
      return false;
    }
    return true;
  }

}
