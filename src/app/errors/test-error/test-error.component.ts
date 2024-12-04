import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../../services/errors.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.css',
})
export class TestErrorComponent implements OnInit {
  constructor(private errorServices: ErrorsService) {}

  validationMessage: string[] = [];

  ngOnInit(): void {}

  getError404() {
    this.errorServices.getError404().subscribe(
      (re) => {
        console.log(re);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getError400() {
    this.errorServices.getError400().subscribe(
      (re) => {
        console.log(re);
      },
      (error: any) => {
        this.validationMessage = error;
        console.log(this.validationMessage);
      }
    );
  }

  getError500() {
    this.errorServices.getError500().subscribe(
      (re) => {
        console.log(re);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getError401() {
    this.errorServices.getError401().subscribe(
      (re) => {
        console.log(re);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
