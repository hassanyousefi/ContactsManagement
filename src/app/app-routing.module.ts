import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { WelcomeSlidesComponent } from './welcome-slides/welcome-slides.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeSlidesComponent },
  { path: 'home', component: ContactListComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: ContactListComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
