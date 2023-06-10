import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflix-d2kt.onrender.com/';

interface userData {
  Username: string;
  Password: string;
}

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  /**
   * Making the api call for the user registration endpoint
   * @function userRegistration
   * @service POST to 'https://myflix-d2kt.onrender.com/users'
   * @param userDetails userDetails: Username(required), Password(required), Email(required), Birthday
   * @returns A JSON object containing data about the new user
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }

  /**
   * API call to get all the movies from the database
   * @function getAllMovies
   * @service GET to 'https://myflix-d2kt.onrender.com/movies'
   * @returns an object containing all the movies
   * @token needed for authorization, received from local storage
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: Object): any {
    const body = res;
    return body || {};
  }

  /**
   * API call to log the user in to the backend and stores the authorization token in local storage
   * @function userLogin
   * @service POST to 'https://myflix-d2kt.onrender.com/login?Username={Username}&Password={Password}'
   * @param userData Username, Password
   * @returns A JSON object containing data about the logged in user
   */
  public userLogin(userData: userData): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userData)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * API call to get one movie by title
   * @function getMovie
   * @service GET to 'https://myflix-d2kt.onrender.com/movies/{movieTitle}'
   * @param movieTitle title of the movie to receive from the backend
   * @returns A JSON object containing data about the movie
   * @token needed for authorization, received from local storage
   */
  public getMovie(movieTitle: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + movieTitle, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * API call to get info about a director by name
   * @function getDirector
   * @service GET to 'https://myflix-d2kt.onrender.com/directors/{name}'
   * @param name name of the director to get
   * @returns a JSON object containing the data about the director
   * @token needed for authorization, received from local storage
   */
  public getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'directors/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * API call to get info about a genre by name
   * @function getGenre
   * @service GET to 'https://myflix-d2kt.onrender.com/genres/{name}'
   * @param name name of the genre to get
   * @returns a JSON object containing the data about the genre
   * @token needed for authorization, received from local storage
   */
  public getGenre(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'genres/' + name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * API call to get info about a user by id
   * @function getUser
   * @service GET to 'https://myflix-d2kt.onrender.com/users/{id}'
   * @returns a JSON object containing the data about the user
   * @token needed for authorization, received from local storage
   * @id received from local storage
   */
  public getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    return this.http
      .get(apiUrl + 'users/' + id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * API call to add a movie to the user's list of favorites
   * @function addFavorite
   * @service POST to 'https://myflix-d2kt.onrender.com/users/{id}/movies/{movieId}'
   * @param movieId string containing the id of the movie to be added
   * @token needed for authorization, received from local storage
   * @id received from local storage
   */
  public addFavorite(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    return this.http
      .post(
        apiUrl + 'users/' + userId + '/movies/' + movieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * API call to delete a movie from the user's list of favorites
   * @function deleteFavorite
   * @service DELETE to 'https://myflix-d2kt.onrender.com/users/{id}/movies/{movieId}'
   * @param movieId string containing the id of the movie to be deleted
   * @token needed for authorization, received from local storage
   * @id received from local storage
   */
  public deleteFavorite(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    return this.http
      .delete(apiUrl + 'users/' + userId + '/movies/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * API call to update an existing user's data
   * @function updateUser
   * @service PUT to 'https://myflix-d2kt.onrender.com/users/{id}'
   * @param userDetails Username, Password, Email, Birthday info to be updated
   * @token needed for authorization, received from local storage
   * @id received from local storage
   */
  public updateUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    return this.http
      .put(apiUrl + 'users/' + id, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * API call to delete an existing user
   * @function deleteUser
   * @service DELETE to 'https://myflix-d2kt.onrender.com/users/{id}'
   * @token needed for authorization, received from local storage
   * @id received from local storage
   */
  public deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    return this.http.delete(apiUrl + 'users/' + id, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    });
  }
}
