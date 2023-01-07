import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-welcome-slides',
  templateUrl: './welcome-slides.component.html',
  styleUrls: ['./welcome-slides.component.scss']
})
export class WelcomeSlidesComponent implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  constructor(private router: Router) { }

  async ngOnInit() {
    let didSee = await Preferences.get({ key: 'did_see_welcome' });
    if (didSee.value == 'true') {
      App.removeAllListeners();
      App.addListener('backButton', () => { this.backToJobList() });
    }
  }

  async start() {
    await Preferences.set({
      key: 'did_see_welcome',
      value: 'true',
    });
    this.router.navigate(['home'])
  }

  async backToJobList() {
    this.router.navigate(['/home']);
  }
}
