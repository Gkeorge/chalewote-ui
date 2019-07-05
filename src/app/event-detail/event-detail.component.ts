import { Component, OnInit, Input } from "@angular/core";
import { EventService } from "../service/event/event.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.css"]
})
export class EventDetailComponent implements OnInit {
  @Input() event: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private location: Location
  ) {}

  ngOnInit() {}

  getRegisteredEventDetail(): void {
    const eventId = +this.route.snapshot.paramMap.get("eventId");
    this.eventService
      .getEventDetail(eventId)
      .subscribe(event => (this.event = event));
  }

  updateRegisteredEvent() {
    this.eventService
      .updateRegisteredEvent(this.event)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
