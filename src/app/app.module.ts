import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { IonicModule } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { AppRoutingModule } from './app-routing.module';
import { StartupService } from './startup.service';
import { WelcomeSlidesComponent } from './welcome-slides/welcome-slides.component';
import { ContactDetailModalComponent } from './contact-detail-modal/contact-detail-modal.component';
import { AboutComponent } from './about/about.component';
import { CallNumber } from '@ionic-native/call-number/ngx';

@NgModule({
  declarations: [
    AppComponent,
    ContactListComponent,
    ModalComponent,
    WelcomeSlidesComponent,
    ContactDetailModalComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    CallNumber,
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ds: StartupService) => () => ds.load(),
      deps: [StartupService],
      multi: true
    }
  ], 
  
  bootstrap: [AppComponent]
})
export class AppModule { }
