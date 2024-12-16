import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { Member } from '../../models/member';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent implements OnInit {
  lstMember$?: Observable<Member[]>;
  constructor(private memberServices: MemberService) {}
  ngOnInit(): void {
    this.lstMember$ = this.memberServices.getMembers();
  }
}
