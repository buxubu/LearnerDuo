import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { Member } from '../../models/member';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  lstMember: Member[] = [];
  constructor(private memberServices: MemberService) {}
  ngOnInit(): void {
    this.loadListMember();
  }

  loadListMember() {
    this.memberServices.getMembers().subscribe((re) => {
      this.lstMember = re;
    });
  }
}
