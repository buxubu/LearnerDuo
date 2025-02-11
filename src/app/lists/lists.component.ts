import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { MemberService } from '../../services/member.service';
import { Pagination } from '../models/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]> = [];
  pagination: Pagination = {} as Pagination;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService
      .getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe((response) => {
        this.members = response.result;
        this.pagination = response.pagination;
      });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadLikes();
  }
}
