import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Member } from '../app/models/member';
import { map, Observable, of } from 'rxjs';
import { NotificationResults } from '../app/models/notificationResults';
import { PaginatedResult } from '../app/models/pagination';
import { ThisReceiver } from '@angular/compiler';
import { UserParams } from '../app/models/userParams';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  readonly baseApi: string = environment.baseUrl;

  members: Member[] = [];

  constructor(private http: HttpClient) {}

  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(params);
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

  setMainPhoto(photoId: number) {
    return this.http.put<NotificationResults>(
      this.baseApi + '/user/setMainPhoto/' + photoId,
      {}
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete<NotificationResults>(
      this.baseApi + '/user/deletePhoto/' + photoId
    );
  }

  // the way to add mutiple objects or classes in the same observable
  private getPaginatedResult<T>(params: HttpParams) {
    // if you want to create new new PaginatedResult<Member[]>() like this you need to create a class
    //  including the result and pagination
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http
      .get<T>(this.baseApi + '/user/getUsers', {
        // create this oberve and params because we want to get the response headers
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body as T;

          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              // the way to get the pagination headers from the response
              response.headers.get('Pagination') ?? ''
            );
          }
          return paginatedResult;
        })
      );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    // create this params because we want to send the page number and page size to the server
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return params;
  }
}
