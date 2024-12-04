import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject } from 'rxjs';
import { User } from '../app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly baseApi: string = environment.baseUrl;

  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post<User>(this.baseApi + '/user/login', model).pipe(
      map((reponse: User) => {
        const user = reponse;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return reponse;
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseApi + '/user/register', model).pipe(
      map((re: User) => {
        if (re) {
          localStorage.setItem('user', JSON.stringify(re));
          this.currentUserSource.next(re);
        }
        return re;
      })
    );
  }

  // dùng để gán người dùng đăng nhập vào replaySubject
  getCurrentSource(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
