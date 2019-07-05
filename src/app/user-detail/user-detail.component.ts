import { Component, OnInit, Input } from "@angular/core";
import { UserService } from "../service/user/user.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { User } from "../shared/User";

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.css"]
})
export class UserDetailComponent implements OnInit {
  @Input() user: User;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {}

  getRegisteredUserDetail(): void {
    const userId = +this.route.snapshot.paramMap.get("userId");
    this.userService
      .getRegisteredUserDetail(userId)
      .subscribe(user => (this.user = user));
  }

  updateRegisteredUser(): void {
    this.userService
      .updateRegisteredUser(this.user)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
