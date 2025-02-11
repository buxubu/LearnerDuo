import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MemberService } from '../../../services/member.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined;

  constructor(
    private memberServices: MemberService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {}

  addLike(member: Member) {
    this.memberServices.addLike(member.userName).subscribe(
      (res) => {
        this.toastr.success(res.result);
      },
      (error: any) => {
        this.toastr.error(error);
      }
    );
  }
}
