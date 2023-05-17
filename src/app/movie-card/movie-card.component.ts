import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];

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
}
