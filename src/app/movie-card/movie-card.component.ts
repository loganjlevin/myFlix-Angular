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
  movies: any[] = [];
  favorites: string[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.movies = response;
    });
  }

  getFavorites(): void {
    this.fetchApiData.getUser().subscribe((response) => {
      this.favorites = response.FavoriteMovies;
    });
  }

  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  addFavorite(id: string): void {
    this.fetchApiData.addFavorite(id).subscribe((response) => {
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  deleteFavorite(id: string): void {
    this.fetchApiData.deleteFavorite(id).subscribe((response) => {
      this.snackBar.open('Movie deleted from favorites', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        title: genre.Name,
        body: genre.Description,
      },
    });
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        title: director.Name,
        body: director.Bio,
      },
    });
  }

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
