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

  deleteUserProfile(): void {
    if (
      confirm(
        'Are you sure you want to delete your profile? All data will be lost.'
      )
    ) {
      this.fetchApiData.deleteUser().subscribe(
        (response) => {
          this.snackBar.open(response, 'OK', {
            duration: 2000,
          });
          localStorage.clear();
          this.router.navigate(['welcome']);
        },
        (response) => {
          this.snackBar.open(response, 'OK', {
            duration: 2000,
          });
        }
      );
    }
  }
}
