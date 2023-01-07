import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

const DidSeeWelcome = 'did_see_welcome';
@Injectable({
  providedIn: 'root'
})

export class StartupService {

  constructor(private router: Router) { }

  async load() {
    let didSeeWelcome = await Preferences.get({ key: DidSeeWelcome})
    if(didSeeWelcome.value) {
      this.router.navigate(['home'])
      return
    }

    this.router.navigate(['welcome'])
  }
}
