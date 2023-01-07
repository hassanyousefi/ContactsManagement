import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(public toastController: ToastController) { }

  async showMessage(text: string, type: 'danger' | 'success'| 'warning', position?: 'middle' | 'top' | 'bottom') {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      color: type,
      position: position || 'middle'
    });
    toast.present();
  }
}
