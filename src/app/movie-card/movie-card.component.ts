import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  /**
   * These variables will store info from the API calls
   * @movies stores array of JSON objects representing all the movies in the database
   * @favorites stores array of favorite movies of the current user
   */
  movies: any[] = [];
  favorites: string[] = [];

  /**
   *
   * @param fetchApiData creates the API service to make the API calls
   * @param snackBar shows messages to the user when a function succeeds or throws an error
   * @param dialog opens a dialog to display genre, director, or movie description
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }

  /**
   * Gets an object containing all the movies from the API
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.movies = response;
    });
  }

  /**
   * Gets all the favorited movies of the current user
   */
  getFavorites(): void {
    this.fetchApiData.getUser().subscribe((response) => {
      this.favorites = response.FavoriteMovies;
    });
  }

  /**
   * checks if the movie is a favorite of the current user
   * @param id string containing the id of the movie
   * @returns true if the movie is a favorite of the current user
   */
  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  /**
   * adds the movie to the current user's favorites
   * @param id string containing the id of the movie
   */
  addFavorite(id: string): void {
    this.fetchApiData.addFavorite(id).subscribe((response) => {
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  /**
   * deletes the movie from the current user's favorites
   * @param id string containing the id of the movie
   */
  deleteFavorite(id: string): void {
    this.fetchApiData.deleteFavorite(id).subscribe((response) => {
      this.snackBar.open('Movie deleted from favorites', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  /**
   * displays a dialog of the genre info
   * @param genre the genre object (name, description) to be displayed
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        title: genre.Name,
        body: genre.Description,
      },
    });
  }

  /**
   * displays a dialog of the director info
   * @param director the director object (name, bio) to be displayed
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        title: director.Name,
        body: director.Bio,
      },
    });
  }

  /**
   * displays a dialog of the movie description
   * @param description the movie description object ( title, description) to be displayed
   */
  openDescriptionDialog(description: any): void {
    this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        title: 'Description',
        body: description,
      },
    });
  }
}
