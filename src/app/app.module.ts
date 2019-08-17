import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EventListComponent } from "./event-list/event-list.component";
import { EventDetailComponent } from "./event-detail/event-detail.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { SignupComponent } from './signup/signup.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { ForbiddenEmailDirective } from './forbidden-email.directive';
import { EmailvalidatorDirective } from './emailvalidator.directive';

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventDetailComponent,
    UserListComponent,
    UserDetailComponent,
    SignupComponent,
    NavigationComponent,
    FooterComponent,
    ForbiddenEmailDirective,
    EmailvalidatorDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
