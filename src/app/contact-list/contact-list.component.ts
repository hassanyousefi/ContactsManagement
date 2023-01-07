
import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ActionSheetController, ModalController, Platform } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';
import { JobsService } from '../jobs.service';
import { Contact, Job } from '../pModels';
import { MessageService } from '../message.service';
import { ContactDetailModalComponent } from '../contact-detail-modal/contact-detail-modal.component';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { SyncAsync } from '@angular/compiler/src/util';

enum PageStatus {
  jobs = 1,
  contacts = 2
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})

export class ContactListComponent implements OnInit {
  listMode: 'job' | 'contact' = 'job';
  selectedJob: Job;
  jobList: Job[] = [];
  contactList: Contact[] = [];

  constructor(
    private callNumber: CallNumber,
    private jobService: JobsService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    private messageService: MessageService,
    private platform: Platform,
    private router: Router
  ) { }

  async ngOnInit() {
    this.handleBackButton();
    await this.getLastJobs();
  }

  async presentModal(data = '') {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'modalType': this.listMode,
        'data': data,
        'addContactToJob': this.selectedJob
      }
    });

    modal.onDidDismiss()
      .then(async (data) => {
        if (this.listMode == 'job') {
          await this.getLastJobs();
        } else if (this.listMode == 'contact') {
          this.handleBackButton();
          await this.getlastContacts();
        }
      });

    return await modal.present();
  }

  async openContactDetail(contact: Contact) {
    const modal = await this.modalController.create({
      component: ContactDetailModalComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'contact': contact,
      }
    });

    modal.onDidDismiss()
      .then(async (data) => {
        this.handleBackButton();
      });

    return await modal.present();
  }


  async getLastJobs() {
    this.jobList = await this.jobService.getJobs();
  }

  async confirmJobDelete(job: Job) {
    const actionSheet = await this.actionSheetController.create({
      header: 'آیا میخواهید این شغل را حذف کنید؟',
      buttons: [
        {
          text: 'حذف',
          role: 'destructive',
          icon: 'trash',
          handler: async () => {
            await this.deleteJob(job);
          },
        },
        {
          text: 'انصراف',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async deleteJob(job: Job) {
    await this.jobService.deleteJob(job);
    await this.getLastJobs();
    this.messageService.showMessage('حذف شغل با موفقیت انجام شد', 'success');
  }

  async goToContactsOfJob(job: Job) {
    this.listMode = 'contact';
    this.selectedJob = job;
    this.contactList = await this.jobService.getSpecContacts(job.Id);
    this.handleBackButton();
  }

  async getlastContacts() {
    this.contactList = await this.jobService.getSpecContacts(this.selectedJob.Id);
  }

  async onCallNumber(contact: Contact) {
    try {
      await this.callNumber.callNumber(contact.PhoneNumber, true);
    } catch {
      this.messageService.showMessage('تماس ناموفق!', 'danger');
    }
  }

  async confirmContactDelete(contact: Contact) {
    const actionSheet = await this.actionSheetController.create({
      header: 'آیا میخواهید این مخاطب را حذف کنید؟',
      buttons: [
        {
          text: 'حذف',
          role: 'destructive',
          icon: 'trash',
          handler: async () => {
            await this.deleteContact(contact);
          },
        },
        {
          text: 'انصراف',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async deleteContact(contact: Contact) {
    await this.jobService.deleteContact(contact);
    await this.getlastContacts();
    this.messageService.showMessage('حذف مخاطب با موفقیت انجام شد', 'success');
  }

  backToJobList() {
    window.location.reload();
  }

  exit() {
    App.exitApp();
  }

  help() {
    this.router.navigate(['/welcome'])
  }

  about() {
    this.router.navigate(['/about'])
  }

  async searchJobs(event: any) {
    await this.getLastJobs();
    const query = event.target.value.toLowerCase();
    this.jobList = this.jobList.filter(d => d.JobName.toLowerCase().indexOf(query) > -1);
  }

  async searchContacts(event: any) {
    await this.getlastContacts();
    const query = event.target.value.toLowerCase();
    this.contactList = this.contactList.filter(d => {
      if (
        d.FirstName.toLowerCase().indexOf(query) > -1 ||
        d.LastName.toLowerCase().indexOf(query) > -1 ||
        d.PhoneNumber.toLowerCase().indexOf(query) > -1
      ) return d;
    });
  }

  handleBackButton() {
    App.removeAllListeners();
    App.addListener('backButton', () => {
      if(this.listMode == 'contact') {
        this.backToJobList();
      } else if (this.listMode == 'job') {
        this.confirmExit();
      }
    })
  }

  async confirmExit() {
    const actionSheet = await this.actionSheetController.create({
      header: 'آیا میخواهید از برنامه خارج شوید؟',
      buttons: [
        {
          text: 'خارج میشوم',
          role: 'destructive',
          icon: 'exit-outline',
          handler: async () => {
            this.exit();
          },
        },
        {
          text: 'انصراف',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
}





/// for update
// ng build --prod
// npx cap copy 
// npx cap sync 
// npx cap open android







