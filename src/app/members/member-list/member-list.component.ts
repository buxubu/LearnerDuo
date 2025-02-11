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

  constructor(private memberServices: MemberService) {
    this.userParams = this.memberServices.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers(); // Load members when the component is initialized
  }

  loadMembers() {
    this.memberServices.setUserParams(this.userParams); // set userParams to remember the last filter
    this.memberServices.getMembers(this.userParams).subscribe((response) => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  resetFilters() {
    this.memberServices.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberServices.setUserParams(this.userParams); // set userParams to remember the last filter
    this.loadMembers();
  }
}
