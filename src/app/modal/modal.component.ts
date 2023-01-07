import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { JobsService } from '../jobs.service';
import { MessageService } from '../message.service';
import { Contact, Guid, Job } from '../pModels';
import { App } from '@capacitor/app';
const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex: RegExp = /^[0-9\-]*$/;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() modalType: 'job' | 'contact';
  @Input() data: any;
  @Input() addContactToJob: Job;
  isEditMode: boolean;
  targetJob: Job;
  targetContact: Contact;
  jobName: string;
  contactForm = new FormGroup({
    FirstName: new FormControl('', [Validators.required]),
    LastName: new FormControl(''),
    PhoneNumber: new FormControl('', [Validators.required, Validators.pattern(phoneRegex)]),
    Address: new FormControl(''),
    Email: new FormControl('', [Validators.pattern(emailRegex)]),
    Note: new FormControl(''),
    Company: new FormControl(''),
  })
  constructor(
    public modalController: ModalController,
    private jobService: JobsService,
    private messageService: MessageService,
    private platform: Platform
  ) {
    App.removeAllListeners();
    App.addListener('backButton', () => {this.cancel()});
   }

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    if (!this.isEditMode) return;

    if (this.modalType == 'job') {
      this.targetJob = this.data;
      this.jobName = this.targetJob.JobName;
    } else {
      this.targetContact = this.data;
      this.contactForm.patchValue({
        FirstName: this.targetContact.FirstName,
        LastName: this.targetContact.LastName,
        PhoneNumber: this.targetContact.PhoneNumber,
        Address: this.targetContact.Address,
        Email: this.targetContact.Email,
        Note: this.targetContact.Note,
        Company: this.targetContact.Company
      })
    }
  }

  cancel() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  confirm() {
    if (this.modalType == 'job') {
      this.addOrEditJob();
    } else {
      this.addOrEditContact();
    }
  }

  async addOrEditJob() {
    if (!this.jobName) {
      this.messageService.showMessage('لطفا نام شغل را وارد کنید', 'warning');
      return;
    }
    if (this.isEditMode) {
      let jobs = await this.jobService.getJobs();
      let tJob: Job = jobs.find(job => job.Id == this.targetJob.Id);
      tJob.JobName = this.jobName;
      await this.jobService.updateJob(tJob);
      this.messageService.showMessage('شغل با موفقیت ویرایش شد', 'success');
      this.modalController.dismiss({
        'dismissed': true
      });
      return
    }

    let newJob = new Job();
    newJob = {
      Id: Guid.newGuid(),
      JobName: this.jobName
    }

    await this.jobService.addJob(newJob);
    this.messageService.showMessage('شغل جدید با موفقیت اضافه شد', 'success');
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async addOrEditContact() {
    this.checkValidation();
    if (!this.contactForm.valid) {
      this.messageService.showMessage('لطفا فیلد های اجباری را وارد کنید', 'warning');
      return;
    }

    if (this.isEditMode) {
      let contacts = await this.jobService.getAllContact();
      let tContact: Contact = contacts.find(c => c.Id == this.targetContact.Id);
      tContact = this.contactForm.value;
      tContact.Id = this.targetContact.Id;
      tContact.JobId = this.targetContact.JobId;
      tContact.JobName = this.targetContact.JobName;
      await this.jobService.updateContact(tContact);
      this.messageService.showMessage('مخاطب با موفقیت ویرایش شد', 'success');
      this.modalController.dismiss({
        'dismissed': true
      });
      return
    }

    
    let newUser: Contact = this.contactForm.value;
    newUser.Id = Guid.newGuid();
    newUser.JobId = this.addContactToJob.Id;
    newUser.JobName = this.addContactToJob.JobName;
    await this.jobService.addContact(newUser);
    this.messageService.showMessage('مخاطب جدید با موفقیت اضافه شد', 'success');
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  checkValidation() {
    Object.values(this.contactForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
