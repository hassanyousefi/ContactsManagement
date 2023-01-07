import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    App.removeAllListeners();
    App.addListener('backButton', () => {this.backToJobList()});
  }

  backToJobList() {
    this.router.navigate(['/home']);
  }
}
