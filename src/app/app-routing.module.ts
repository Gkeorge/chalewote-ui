import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserListComponent } from "./user-list/user-list.component";
import { EventListComponent } from "./event-list/event-list.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { EventDetailComponent } from "./event-detail/event-detail.component";

const routes: Routes = [
  { path: "users", component: UserListComponent },
  { path: "events", component: EventListComponent },
  { path: "", redirectTo: "/events", pathMatch: "full" },
  { path: "users/:id", component: UserDetailComponent },
  { path: "events/:id", component: EventDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
