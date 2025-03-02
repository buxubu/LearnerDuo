import { Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../app/models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  readonly baseApi: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(
      this.baseApi + '/admin/users-with-roles'
    );
  }

  editUserRoles(username: string, roles: string[]) {
    return this.http.put(
      this.baseApi + '/admin/edit-roles/' + username + '?roles=' + roles,
      {}
    );
  }
}
