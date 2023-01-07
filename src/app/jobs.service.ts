import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Contact, Job } from './pModels';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor() { }

  async addJob(job: Job) {
    let jobs: Job[] = await this.getJobs();
    jobs.push(job);
    await this.setAllJobs(jobs);
  }

  async setAllJobs(jobs: Job[]) {
    let josnJobs = jobs.map(j => JSON.stringify(j));
    await Preferences.set({
      key: 'jobs',
      value: JSON.stringify(josnJobs),
    });
  }

  async getJobs(): Promise<Job[]> {
    let getList = await Preferences.get({ key: 'jobs' });
    if (getList.value) {
      let list = JSON.parse(getList.value);
      let result = list.map(j => JSON.parse(j));
      return result
    }
    return [];
  }

  async deleteJob(job: Job) {
    let jobs: Job[] = await this.getJobs();
    jobs = jobs.filter(j => j.Id !== job.Id);
    await this.setAllJobs(jobs);
    let contacts: Contact[] = await this.getAllContact();
    contacts = contacts.filter(c => c.JobId !== job.Id);
    await this.setAllContact(contacts);
  }

  async updateJob(targetJob: Job) {
    let jobs: Job[] = await this.getJobs();
    jobs = jobs.map(job => {
      if(job.Id == targetJob.Id) {
        job = targetJob;
      }
      return job;
    })
    await this.setAllJobs(jobs);
  }

// ---- contact -----

  async addContact(contact: Contact) {
    let contacts: Contact[] = await this.getAllContact();
    contacts.push(contact);
    await this.setAllContact(contacts);
  }

  async setAllContact(contacts: Contact[]) {
    let jsonContacts = contacts.map(c => JSON.stringify(c));
    await Preferences.set({
      key: 'contacts',
      value: JSON.stringify(jsonContacts),
    });
  }

  async getAllContact() {
   let getList = await Preferences.get({ key: 'contacts' });
    if (getList.value) {
      let list = JSON.parse(getList.value);
      let result =  list.map(c => JSON.parse(c));
      return result;
    }
    return [];
  }

  async getSpecContacts(jobId: string) {
    let contacts: Contact[] = await this.getAllContact();
    return contacts.filter(c => c.JobId == jobId);
  }

  async deleteContact(contact: Contact) {
    let contacts: Contact[] = await this.getAllContact();
    contacts = contacts.filter(c => c.Id !== contact.Id);
    this.setAllContact(contacts);
  }

  async updateContact(targetContact: Contact) {
    let contacts: Contact[] = await this.getAllContact();
    contacts = contacts.map(contact => {
      if(contact.Id == targetContact.Id) {
        contact = targetContact;
      }
      return contact;
    })
    await this.setAllContact(contacts);
  }
}
