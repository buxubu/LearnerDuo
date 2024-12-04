import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../../services/user.service';
import { Subscription, throttleTime } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  registerMode = false;
  users: any;
  constructor(private userServices: UserService) {}

  // subscriptions: Subscription = new Subscription();

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // this.subscriptions.unsubscribe();
  }

  // getUsers() {
  //   this.userServices.getUsers().subscribe(
  //     (re) => {
  //       this.users = re;
  //       console.log(this.users);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
