import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public profilePhoto: string;

  constructor() { }

  public async addNewProfilePicture() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64, 
      source: CameraSource.Prompt, 
      quality: 95,
      allowEditing: true,
    });
    this.profilePhoto = capturedPhoto.base64String;
  }
}
