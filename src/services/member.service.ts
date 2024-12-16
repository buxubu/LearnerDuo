import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Member } from '../app/models/member';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  readonly baseApi: string = environment.baseUrl;

  members: Member[] = [];

  constructor(private http: HttpClient) {}

  getMembers() {
    if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseApi + '/user/getUsers').pipe(
      map((members) => {
        this.members = members;
        return members;
      })
    );
  }

  detailMember(name: string) {
    const member = this.members.find((x) => x.lastName === name);
    if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseApi + '/user/detail/' + name);
  }

  findMember(userName: string) {
    const member = this.members.find((x) => x.userName === userName);
    if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseApi + '/user/findUser/' + userName);
  }

  editMember(member: Member) {
    return this.http.put(this.baseApi + '/user/editUser', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
