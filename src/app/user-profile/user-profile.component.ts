import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user = {
    _id: '',
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  @Input() updatedUser = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Makes an API call to get user info from the database
   * @function getUser
   * @returns JSON object with user information
   */
  getUser(): void {
    this.fetchApiData.getUser().subscribe(
      (response) => {
        this.user = response;
      },
      (response) => {
        this.snackBar.open(response, 'OK', {
          duration: 2000,
        });
      }
    );
  }

  /**
   * Updates the user's info in the database by sending a new user object
   * then gets the new user info by calling the getUser function
   * @function updateUserInfo
   *
   */
  updateUserInfo(): void {
    this.fetchApiData.updateUser(this.updatedUser).subscribe(
      (response) => {
        this.getUser();
        this.snackBar.open('Successfully updated user info!', 'OK', {
          duration: 2000,
        });
      },
      (response) => {
        console.log(response);
        this.snackBar.open(response, 'OK', {
          duration: 2000,
        });
      }
    );
  }

  /**
   * Deletes the user from the database and then logs out and return the to welcome page
   * @function deleteUserProfile
   */
  deleteUserProfile(): void {
    if (
      confirm(
        'Are you sure you want to delete your profile? All data will be lost.'
      )
    ) {
      this.fetchApiData.deleteUser().subscribe();
      localStorage.clear();
      this.router.navigate(['welcome']);
      this.snackBar.open('Profile successfully deleted', 'OK', {
        duration: 2000,
      });
    }
  }
}
