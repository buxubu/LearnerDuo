import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  readonly baseApi: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getError404() {
    return this.http.get(this.baseApi + '/buggy/not_found');
  }

  getError400() {
    return this.http.get(this.baseApi + '/buggy/bad_request');
  }

  getError500() {
    return this.http.get(this.baseApi + '/buggy/server_error');
  }

  getError401() {
    return this.http.get(this.baseApi + '/buggy/auth');
  }
}
