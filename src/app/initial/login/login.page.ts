import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, NavController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  
  constructor(
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private toastSvc: ToastService,
  ) { }

  ngOnInit() {
  }

  async login() {
    if(this.validateForm()) {
      let loader = this.loadingCtrl.create({
        message: "Please wait..."
      });
      (await loader).present();

      try {
        await this.afAuth
          .setPersistence('local')
          .then(_=> {
            return this.afAuth.signInWithEmailAndPassword(this.email, this.password)
          })
          .then(data => {
            this.toastSvc.showToast("Welcome back, " + data.user.email);
            this.navCtrl.navigateRoot("/folder/Main");
          });
      } catch(e) { this.toastSvc.showToast(e); }

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
    return true;
  }

}
