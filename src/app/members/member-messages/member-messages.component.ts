import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { Message } from '../../models/message';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { empty } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css',
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm | undefined;
  @Input() messages: Message[] = [];
  @Input() recipientUsername: string = '';

  content: string = '';

  constructor(public messageService: MessageService) {}
  ngOnInit(): void {
    console.log(this.messageForm);
  }

  createMessage() {
    this.messageService
      .createMessage(this.recipientUsername, this.content)
      .then(() => {
        this.messageForm?.reset();
      });
  }
}
