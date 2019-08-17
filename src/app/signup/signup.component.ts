import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../service/user/user.service";
import { ActivatedRoute } from "@angular/router";
import { forbiddenEmailValidator } from "../forbidden-email.directive";
import { Emailvalidator } from "../emailvalidator.directive";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private uniqueEmail: Emailvalidator
  ) {}

  ngOnInit() {}

  userForm = new FormGroup(
    {
      emailAddress: new FormControl(
        "",
        [
          Validators.required,
          Validators.email,
          forbiddenEmailValidator(/bob/i) // <-- Here's how you pass in the custom validator.
        ],
        this.uniqueEmail.validate.bind(this.uniqueEmail)
      ),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern("[a-zA-Z0-9!@#$%$^$^%^-]*")
      ])
    },
    { updateOn: "blur" }
  );

  registerNewUser(): void {
    console.log("User", this.userForm.value);
    this.userService.registerUser(this.userForm.value).subscribe();
  }

  get emailAddress() {
    return this.userForm.get("emailAddress");
  }

  get password() {
    return this.userForm.get("password");
  }
}
