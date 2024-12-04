import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { User } from '../../models/user';
import { Member } from '../../models/member';
import { UserService } from '../../../services/user.service';
import { MemberService } from '../../../services/member.service';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  user: User | undefined;
  member: Member | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private userServices: UserService,
    private memberServices: MemberService,
    private toastr: ToastrService
  ) {
    this.userServices.currentUser$.pipe(take(1)).subscribe((re) => {
      this.user = re as User;
    });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    if (this.user?.userName) {
      this.memberServices.findMember(this.user.userName).subscribe((re) => {
        this.member = re;
      });
    }
  }

  updateMember() {
    console.log(this.member);
    this.toastr.success('Update success.');
    this.editForm?.reset(this.member);
  }
}
