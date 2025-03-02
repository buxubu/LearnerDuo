import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { Member } from '../models/member';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MemberDetailedResolver implements Resolve<Member> {
  constructor(private memberService: MemberService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    return this.memberService.findMember(route.params['username']);
  }
}
