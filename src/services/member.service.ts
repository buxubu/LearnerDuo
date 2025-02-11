import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Member } from '../app/models/member';
import { map, Observable, of, take } from 'rxjs';
import { NotificationResults } from '../app/models/notificationResults';
import { PaginatedResult } from '../app/models/pagination';
import { ThisReceiver } from '@angular/compiler';
import { UserParams } from '../app/models/userParams';
import { UserService } from './user.service';
import { User } from '../app/models/user';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  readonly baseApi: string = environment.baseUrl;

  members: Member[] = [];

  partialMembers: Partial<Member[]> = []; // the goal when we create partial because in server we have model LikeDto
  // it already have each feild in Member model

  user: User = {} as User;

  userParams: UserParams = {} as UserParams;

  memberCahe = new Map();

  constructor(private http: HttpClient, private userServices: UserService) {
    userServices.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.user = user;
        // in this case we need to get current user to data transmisson from userServices to userParams to check gender
        // like the code below
        // constructor(user: User) {
        //   this.gender = user.gender === 'female' ? 'male' : 'female'; // this code is in UserParams class
        // }
        this.userParams = new UserParams(user);
      }
    });
  }

  addLike(userName: string) {
    return this.http.post<NotificationResults>(
      this.baseApi + '/likes/' + userName,
      {}
    );
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = this.getPaginationHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return this.getPaginatedResult<Partial<Member[]>>(
      this.baseApi + '/likes',
      params
    );
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    var reponse = this.memberCahe.get(Object.values(userParams).join('-')); // get value from the cache by compare Key
    if (reponse) {
      return of(reponse);
    }

    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(
      this.baseApi + '/user/getUsers',
      params
    ).pipe(
      map((respon) => {
        this.memberCahe.set(Object.values(userParams).join('-'), respon); // save the response in the cache with Key and Value
        return respon;
      })
    );
  }

  detailMember(name: string) {
    const member = [...this.memberCahe.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.lastName === name);
    console.log(member);

    if (member) return of(member);
    return this.http.get<Member>(this.baseApi + '/user/detail/' + name);
  }

  findMember(userName: string) {
    const member = [...this.memberCahe.values()] // get all the values from the cache
      .reduce((arr, elem) => arr.concat(elem.result), []) // reduce the values to one array
      .find((member: Member) => member.userName === userName); // find the member by the userName

    if (member) return of(member);

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
  private getPaginatedResult<T>(baseUrl: string, params: HttpParams) {
    // if you want to create new new PaginatedResult<Member[]>() like this you need to create a class
    //  including the result and pagination
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http
      .get<T>(baseUrl, {
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
