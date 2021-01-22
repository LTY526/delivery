import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  email: string;
  uid: string;
  rider: boolean = false;
  customer: boolean = false;

  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
  ) { }

  async init() {
    this.afAuth.authState.subscribe(res => {
      this.email = res.email;
      this.uid = res.uid;
      this.firestore.firestore.collection('roleList').doc(res.uid).get().then(ress => {
        if(ress.data().rider == true) {
          this.rider = true;
        } else if(ress.data().customer == true) {
          this.customer = true;
        }
      });
    });
  }

  clear() {
    this.email = null;
    this.uid = null;
    this.rider = false;
    this.customer = false;
  }
}
