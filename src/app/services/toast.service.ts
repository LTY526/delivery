import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastCtrl: ToastController) { }

  showToast(message: any){
    this.toastCtrl.create({
      message: message,
      duration: 3000,
    })
    .then(toastData => toastData.present());
  }
}
