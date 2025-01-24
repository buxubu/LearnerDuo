import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { Member } from '../../models/member';
import { Observable, take } from 'rxjs';
import { Pagination } from '../../models/pagination';
import { UserParams } from '../../models/userParams';
import { UserService } from '../../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination = {} as Pagination;
  user: User = {} as User;
  userParams: UserParams = {} as UserParams;

  genderList = [
    { value: 'male', display: 'Male' },
    { value: 'female', display: 'Female' },
  ];

  constructor(
    private memberServices: MemberService,
    userServices: UserService
  ) {
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

  ngOnInit(): void {
    this.loadMembers(); // Load members when the component is initialized
  }

  loadMembers() {
    this.memberServices.getMembers(this.userParams).subscribe((response) => {
      this.members = response.result;
      this.pagination = response.pagination;
      console.log(this.userParams);
    });
  }

  resetFilters() {
    this.userParams = new UserParams(this.user);
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }
}
