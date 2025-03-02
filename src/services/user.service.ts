import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject } from 'rxjs';
import { User } from '../app/models/user';
import { Register } from '../app/models/register';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly baseApi: string = environment.baseUrl;

  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private presenceService: PresenceService
  ) {}

  login(model: any) {
    return this.http.post<User>(this.baseApi + '/user/login', model).pipe(
      map((reponse: User) => {
        const user = reponse;
        if (user) {
          this.setCurrentSource(reponse);
          this.presenceService.createHubConnection(user);
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
          this.presenceService.createHubConnection(re);
        }
        return re;
      })
    );
  }

  // dùng để gán người dùng đăng nhập vào replaySubject
  setCurrentSource(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    // each part in code token have "." so need split('.')
    // atob is decoded token and split to many part
    return JSON.parse(atob(token.split('.')[1]));
  }
}
