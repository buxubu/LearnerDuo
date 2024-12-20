import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined;

  ngOnInit(): void {}
}
