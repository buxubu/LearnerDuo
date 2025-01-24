import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnDestroy, OnInit {
  constructor(
    public userServices: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  model: any = {};

  user: User | undefined;

  ngOnInit(): void {
    this.userServices.currentUser$.pipe(take(1)).subscribe((re) => {
      this.user = re as User;
      if (this.user.photoUrl === null) {
        this.user.photoUrl = 'assets/Breezeicons-actions-22-im-user.svg.png';
      }
    });
  }

  ngOnDestroy(): void {}

  login() {
    this.userServices.login(this.model).subscribe(
      (re) => {
        this.router.navigateByUrl('/members');
      },
      (error: any) => {
        this.toastr.error(error);
      }
    );
  }

  logOut() {
    this.userServices.logout();
    this.router.navigateByUrl('/');
  }
}
