import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css',
})
export class ServerErrorComponent implements OnInit {
  error: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }
  ngOnInit(): void {}
}
