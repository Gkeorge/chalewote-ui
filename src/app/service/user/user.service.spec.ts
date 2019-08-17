import { TestBed } from "@angular/core/testing";
import { asyncData, asyncError } from "../../testing/async-observable-helpers";
import { UserService } from "./user.service";
import { User } from "src/app/shared/User";
import {
  HttpErrorResponse,
  HttpClient,
  HttpResponse
} from "@angular/common/http";
import {
  HttpTestingController,
  HttpClientTestingModule
} from "@angular/common/http/testing";

describe("UserService (with spies)", () => {
  let httpClientSpy: { get: jasmine.Spy };
  let userService: UserService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
    userService = new UserService(<any>httpClientSpy);
  });

  it("should return expected registered users (HttpClient called once)", () => {
    const expectedRegisteredUsers: User[] = [
      { userId: 1235324, emailAddress: "gorkofi@gmail.com" },
      { userId: 2345234, emailAddress: "gor@gmail.com" }
    ];

    httpClientSpy.get.and.returnValue(asyncData(expectedRegisteredUsers));
    userService
      .getRegisteredUsers()
      .subscribe(
        registeredUsers =>
          expect(registeredUsers).toEqual(
            expectedRegisteredUsers,
            "expected users"
          ),
        fail
      );

    expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
  });

  it("should return an error when the server returns a 404", () => {
    const errorResponse = new HttpErrorResponse({
      error: "test error",
      status: 404,
      statusText: "Not Found"
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    userService
      .getRegisteredUsers()
      .subscribe(
        registeredUsers => fail("expected an error, not users"),
        error => expect(error).toContain("bad happened")
      );
  });
});

describe("UserService (with mocks)", () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
      // Provide the service-under-test
      providers: [UserService]
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    userService = TestBed.get(UserService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it("should be created", () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  // UserService method tests begin //
  it("#should return expected users (called once)", () => {
    const expectedRegisteredUsers: User[] = [
      { userId: 1235324, emailAddress: "gorkofi@gmail.com" },
      { userId: 2345234, emailAddress: "gor@gmail.com" }
    ];

    userService
      .getRegisteredUsers()
      .subscribe(
        registeredUsers =>
          expect(expectedRegisteredUsers).toEqual(
            registeredUsers,
            "should return users"
          ),
        fail
      );

    // UserService should have made one request to GET heroes from expected URL
    const req = httpTestingController.expectOne(userService.USERS_API);
    expect(req.request.method).toEqual("GET");

    // Respond with the mock users
    req.flush(expectedRegisteredUsers);
  });

  it("should be OK returning no users", () => {
    userService
      .getRegisteredUsers()
      .subscribe(
        users =>
          expect(users.length).toEqual(0, "should have empty users array"),
        fail
      );

    const req = httpTestingController.expectOne(userService.USERS_API);
    req.flush([]); // Respond with no users
  });

  it("should turn 404 into a user-friendly error", () => {
    const msg = "Something bad happened";
    userService
      .getRegisteredUsers()
      .subscribe(
        users => fail("expected to fail"),
        error => expect(error).toContain(msg)
      );

    const req = httpTestingController.expectOne(userService.USERS_API);

    // respond with a 404 and the error message in the body
    req.flush(msg, { status: 404, statusText: "Not Found" });
  });

  it("should return expected heroes (called multiple times)", () => {
    const expectedRegisteredUsers: User[] = [
      { userId: 1235324, emailAddress: "gorkofi@gmail.com" },
      { userId: 2345234, emailAddress: "gor@gmail.com" }
    ];

    userService.getRegisteredUsers().subscribe();
    userService.getRegisteredUsers().subscribe();
    userService
      .getRegisteredUsers()
      .subscribe(
        users =>
          expect(users).toEqual(
            expectedRegisteredUsers,
            "should return expected users"
          ),
        fail
      );

    const requests = httpTestingController.match(userService.USERS_API);
    expect(requests.length).toEqual(3, "calls to getRegisteredUsers()");

    // Respond to each request with different mock hero results
    requests[0].flush([]);
    requests[1].flush([{ userId: 1, emailAddress: "bob" }]);
    requests[2].flush(expectedRegisteredUsers);
  });

  it("should update a user and return it", () => {
    const makeUrl = (id: number) => `${userService.USERS_API}/?id=${id}`;

    const updatedUser: User = { userId: 1, emailAddress: "kofinano@yahoo.com" };

    userService
      .updateRegisteredUser(updatedUser)
      .subscribe(
        data => expect(data).toEqual(updatedUser, "should return the user"),
        fail
      );

    // UserService should have made one request to PUT hero
    const req = httpTestingController.expectOne(userService.USERS_API);
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body).toEqual(updatedUser);

    // Expect server to return the hero after PUT
    const expectedResponse = new HttpResponse({
      status: 200,
      statusText: "OK",
      body: updatedUser
    });
    req.event(expectedResponse);
  });

  it("should turn 404 error into user-facing error", () => {
    const msg = "Something bad happened";
    const updatedUser: User = { userId: 1, emailAddress: "kofinano@yahoo.com" };
    userService
      .updateRegisteredUser(updatedUser)
      .subscribe(
        users => fail("expected to fail"),
        error => expect(error).toContain(msg)
      );

    const req = httpTestingController.expectOne(userService.USERS_API);

    // respond with a 404 and the error message in the body
    req.flush(msg, { status: 404, statusText: "Not Found" });
  });

  it("should turn network error into user-facing error", () => {
    const emsg = "bad";

    const updatedUser: User = { userId: 1, emailAddress: "kofinano@yahoo.com" };
    userService
      .updateRegisteredUser(updatedUser)
      .subscribe(
        users => fail("expected to fail"),
        error => expect(error).toContain(emsg)
      );

    const req = httpTestingController.expectOne(userService.USERS_API);

    // Create mock ErrorEvent, raised when something goes wrong at the network level.
    // Connection timeout, DNS error, offline, etc
    const errorEvent = new ErrorEvent("so sad", {
      message: emsg,
      // The rest of this is optional and not used.
      // Just showing that you could provide this too.
      filename: "HeroService.ts",
      lineno: 42,
      colno: 21
    });

    // Respond with mock error
    req.error(errorEvent);
  });
});
