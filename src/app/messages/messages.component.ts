import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private toastr: ToastrService,
    private confirmService: ConfirmService
  ) {}

  messages: Message[] = [];
  pagination: Pagination = {} as Pagination;

  pageNumber = 1;
  pageSize = 5;
  container = 'Unred';
  loading = false;

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe(
        (response) => {
          this.messages = response.result;
          this.pagination = response.pagination;
          this.loading = false;
        },
        (error) => {
          this.toastr.error(error);
        }
      );
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }

  deleteMessage(messageId: number) {
    this.confirmService
      .confirm('Confirm delete message', 'This cannot be undone')
      .subscribe((result) => {
        if (result) {
          this.messageService.deleteMessage(messageId).subscribe(() => {
            this.messages.splice(
              this.messages.findIndex((m) => m.messageId === messageId),
              1
            );
            this.toastr.success('Message deleted');
          });
        }
      });
  }
}
