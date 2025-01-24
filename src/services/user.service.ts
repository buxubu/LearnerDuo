import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject } from 'rxjs';
import { User } from '../app/models/user';
import { Register } from '../app/models/register';

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
          this.setCurrentSource(reponse);
        }
        return reponse;
      })
    );
  }

  register(model: Register) {
    return this.http.post<User>(this.baseApi + '/user/register', model).pipe(
      map((re: User) => {
        if (re) {
          this.setCurrentSource(re);
        }
        return re;
      })
    );
  }

  // dùng để gán người dùng đăng nhập vào replaySubject
  setCurrentSource(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
