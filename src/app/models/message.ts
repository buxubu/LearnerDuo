import { daLocale } from 'ngx-bootstrap/chronos';

export interface Message {
  messageId: number;
  senderId: number;
  senderUsername: string;
  senderKnownAs: string;
  senderPhotoUrl: string;
  recipientId: number;
  recipientUsername: string;
  recipientPhotoUrl: string;
  recipientKnownAs: string;
  content: string;
  dateRead: Date;
  messageSent: Date;
}
