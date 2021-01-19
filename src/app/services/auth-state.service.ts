import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  email: string;
  uid: string;

  constructor(
    public afAuth: AngularFireAuth,
  ) { }

  init() {
    this.afAuth.authState.subscribe(res => {
      this.email = res.email;
      this.uid = res.uid;
    })
  }
}
