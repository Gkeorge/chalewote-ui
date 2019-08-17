import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { UserService } from "../service/user/user.service";
import { User } from "../shared/User";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"]
})
export class UserListComponent implements OnInit {
  users: Array<any>;
  error: any;
  headers: any;

  // emailAddress = new FormControl("");

  userForm = new FormGroup({
    emailAddress: new FormControl("", [
      Validators.required,
      Validators.minLength(4)
      //forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
    ]),
    password: new FormControl("", Validators.required)
  });

  get emailAddress() {
    return this.userForm.get("emailAddress");
  }

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getRegisteredUsersWithFullResponse();
  }

  getRegisteredUsersWithFullResponse(): void {
    this.userService.getRegisteredUsersWithFullResponse().subscribe(
      // response is of type `HttpResponse<any>`
      response => {
        // display its headers
        const keys = response.headers.keys();
        this.headers = keys.map(key => `${key}: ${response.headers.get(key)}`);

        // access the body directly.
        this.users = response.body.content;
      }, //success path
      error => (this.error = error) // error path
    );
  }

  getRegisteredUsers(): void {
    this.userService.getRegisteredUsers().subscribe(
      users => (this.users = users.content), // success path
      error => (this.error = error) // error path
    );
  }

  registerNewUser(): void {
    console.log("User", this.userForm.value);
    this.userService.registerUser(this.userForm.value).subscribe();
  }

  deleteRegisteredUser(): void {
    const userId = +this.route.snapshot.paramMap.get("userId");
    this.userService.deleteRegisteredUser(userId).subscribe();
  }
}
