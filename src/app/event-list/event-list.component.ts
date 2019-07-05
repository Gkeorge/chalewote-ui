import { Component, OnInit } from "@angular/core";
import { EventService } from "../service/event/event.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-event-list",
  templateUrl: "./event-list.component.html",
  styleUrls: ["./event-list.component.css"]
})
export class EventListComponent implements OnInit {
  events: Array<any>;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}

  getEvents(): void {
    this.eventService.getEvents().subscribe(events => (this.events = events));
  }

  registerNewEvent(event: Event): void {
    this.eventService.registerEvent(event).subscribe();
  }

  deleteEvent(): void {
    const eventId = +this.route.snapshot.paramMap.get("eventId");
    this.eventService.deleteRegisteredEvent(eventId).subscribe();
  }
}
