import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap, retry } from "rxjs/operators";
import { User } from "src/app/shared/User";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class UserService {
  private API = "//" + window.location.hostname + ":8080";
  private USERS_API = this.API + "/api/users";

  constructor(private http: HttpClient) {}

  /** GET Registered users from server */
  getRegisteredUsersWithFullResponse(): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.USERS_API, { observe: "response" }).pipe(
      retry(3), // retry a failed request up to 3 times
      tap(users => this.log(users.body), error => this.log(error)),
      catchError(this.handleError)
    );
  }

  /** GET Registered users from server */
  getRegisteredUsers(): Observable<any> {
    return this.http.get<any>(this.USERS_API).pipe(
      retry(3), // retry a failed request up to 3 times
      tap(data => this.log(data), error => this.log(error)),
      catchError(this.handleError)
    );
  }

  /** GET User by userID. Will 404 if User not found */
  getRegisteredUserDetail(userId: number): Observable<any> {
    const url = `${this.USERS_API}/${userId}`;
    return this.http.get<any>(url).pipe(
      tap(
        _ => this.log(`fetched user with ID=${userId}`),
        error => this.log(error)
      ),
      catchError(this.handleError)
    );
  }

  /** POST: register user on the server */
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.USERS_API, user, httpOptions).pipe(
      tap(data => this.log(""), error => this.log(error)),
      catchError(this.handleError)
    );
  }

  /** PUT: update registered user */
  updateRegisteredUser(user: User): Observable<any> {
    return this.http.post<any>(this.USERS_API, user, httpOptions).pipe(
      tap(_ => this.log(`updated user`)),
      catchError(this.handleError)
    );
  }

  /** DELETE: delete registered user*/
  deleteRegisteredUser(userId: number): Observable<any> {
    const url = `${this.USERS_API}/${userId}`;

    return this.http.delete<any>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted event with ID: ${userId}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
