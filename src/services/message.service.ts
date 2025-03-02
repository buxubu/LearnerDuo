import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import PaginationHelper from './paginationHelper';
import { Message } from '../app/models/message';
import { environment } from '../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { User } from '../app/models/user';
import { Group } from '../app/models/group';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  readonly baseApi: string = environment.baseUrl;
  readonly hubUrl: string = environment.hubUrl;

  private hubConnection: HubConnection = {} as HubConnection;

  private messagesThreadSource = new BehaviorSubject<Message[]>([]); // save list messages
  messagesThread$ = this.messagesThreadSource.asObservable();

  messages: Message[] = [];

  constructor(private http: HttpClient) {}

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect() // This will automatically reconnect the connection if it is lost
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messagesThreadSource.next(messages);
    });

    this.hubConnection.on('NewMessage', (message) => {
      // get old messages from behavior subject
      this.messagesThreadSource.pipe(take(1)).subscribe((messages) => {
        this.messagesThreadSource.next([...messages, message]); // add new message in behavior subject
      });
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.username === otherUsername)) {
        this.messagesThreadSource.pipe(take(1)).subscribe((messages) => {
          messages.forEach((message) => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          });
          this.messagesThreadSource.next([...messages]);
        });
      }
    });
  }

  // async is like a promise, it will return a promise
  async createMessage(recipientUsername: string, content: string) {
    return this.hubConnection
      .invoke('SendMessage', { recipientUsername, content })
      .catch((error) => {
        console.log(error);
      });
  }

  stopHubConnection = () => {
    if (this.hubConnection) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  };

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = PaginationHelper.getPaginationHeaders(pageNumber, pageSize);

    params = params.append('Container', container);

    return PaginationHelper.getPaginatedResult<Message[]>(
      this.baseApi + '/messages',
      params,
      this.http
    );
  }

  getMessageThread(recipientUsername: string) {
    return this.http.get<Message[]>(
      this.baseApi + '/messages/thread/' + recipientUsername
    );
  }

  deleteMessage(messageId: number) {
    return this.http.delete(this.baseApi + '/messages/' + messageId);
  }
}
