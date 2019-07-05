import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class EventService {
  private API = "//" + window.location.hostname + ":8080";
  private EVENTS_API = this.API + "api/events";

  constructor(private http: HttpClient) {}

  /** GET Events from server */
  getEvents(): Observable<any> {
    return this.http.get<any>(this.EVENTS_API).pipe(
      tap(_ => this.log("fetched events")),
      catchError(this.handleError<any>("getEvents", []))
    );
  }

  /** GET Event by EventID. Will 404 if EventID not found */
  getEventDetail(eventId: number): Observable<any> {
    const url = `${this.EVENTS_API}/${eventId}`;
    return this.http.get<any>(url).pipe(
      tap(_ => this.log(`fetched event with ID=${eventId}`)),
      catchError(this.handleError<any>(`getEvent eventId=${eventId}`))
    );
  }

  /** POST: register event on the server */
  registerEvent(event: Event): Observable<any> {
    return this.http.post<Event>(this.EVENTS_API, event, httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>("registerEvent"))
    );
  }

  /** PUT: update registered event */
  updateRegisteredEvent(event: Event): Observable<any> {
    return this.http.post<any>(this.EVENTS_API, event, httpOptions).pipe(
      tap(_ => this.log(`updated event`)),
      catchError(this.handleError<any>("updateRegisteredEvent"))
    );
  }

  /** DELETE: delete registered event*/
  deleteRegisteredEvent(eventId: number): Observable<any> {
    const url = `${this.EVENTS_API}/${eventId}`;

    return this.http.delete<any>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted event with ID: ${eventId}`)),
      catchError(this.handleError<any>("deleteRegisteredEvent"))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
