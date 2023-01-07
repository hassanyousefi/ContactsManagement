import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Contact } from '../pModels';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-contact-detail-modal',
  templateUrl: './contact-detail-modal.component.html',
  styleUrls: ['./contact-detail-modal.component.scss']
})
export class ContactDetailModalComponent implements OnInit {

  @Input() contact: Contact;
  constructor(public modalController: ModalController) { }

  ngOnInit(): void {
    App.removeAllListeners();
    App.addListener('backButton', () => {this.backButton()});
  }

  backButton() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
