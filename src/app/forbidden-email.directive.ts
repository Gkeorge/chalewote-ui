import {
  ValidatorFn,
  AbstractControl,
  NG_VALIDATORS,
  Validator
} from "@angular/forms";
import { Directive, Input } from "@angular/core";

/** A user's email can't match the given regular expression */
export function forbiddenEmailValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenEmail: { value: control.value } } : null;
  };
}

@Directive({
  selector: "[appForbiddenEmail]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ForbiddenEmailDirective,
      multi: true
    }
  ]
})
export class ForbiddenEmailDirective implements Validator {
  @Input("appForbiddenEmail") forbiddenName: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.forbiddenName
      ? forbiddenEmailValidator(new RegExp(this.forbiddenName, "i"))(control)
      : null;
  }
}
