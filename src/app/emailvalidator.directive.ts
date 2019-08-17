import { Directive, Injectable } from "@angular/core";
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { UserService } from "./service/user/user.service";

@Injectable({ providedIn: "root" })
export class Emailvalidator implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.userService.checkEmailUnique(ctrl.value).pipe(
      map(isTaken => (isTaken ? { uniqueEmail: true } : null)),
      catchError(this.userService.handleError)
    );
  }
}

@Directive({
  selector: "[appEmailvalidator]"
})
export class EmailvalidatorDirective {
  constructor() {}
}
