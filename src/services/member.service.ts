import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Member } from '../app/models/member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  readonly baseApi: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getMembers() {
    return this.http.get<Member[]>(this.baseApi + '/user/getUsers');
  }

  detail(name: string) {
    return this.http.get<Member>(this.baseApi + '/user/detail/' + name);
  }

  findMember(userName: string) {
    return this.http.get<Member>(this.baseApi + '/user/findUser/' + userName);
  }
}
