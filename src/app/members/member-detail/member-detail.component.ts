import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { Member } from '../../models/member';
import { MemberService } from '../../../services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Message } from '../../models/message';
import { MessageService } from '../../../services/message.service';
import { PresenceService } from '../../../services/presence.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent =
    {} as TabsetComponent; // to get access to the tabset component
  member: Member = {} as Member;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab: TabDirective = {} as TabDirective; // to keep track of the active tab

  messages: Message[] = [];
  user: User = {} as User;

  constructor(
    public presenceService: PresenceService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private userServie: UserService
  ) {
    this.userServie.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user as User;
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      // resolve data from the route
      this.member = data['member'];
    });

    this.route.queryParams.subscribe((params) => {
      params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0);
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];

    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    let imageUrls = [];
    if (this.member?.photos) {
      for (let photo of this.member?.photos) {
        imageUrls.push({
          small: photo.url,
          medium: photo.url,
          big: photo.url,
        });
      }
    }
    return imageUrls;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      // this.loadMessages();
      this.messageService.createHubConnection(this.user, this.member.userName); // this.member.userName is the other user's username
    } else {
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  loadMessages() {
    this.messageService
      .getMessageThread(this.member.userName)
      .subscribe((messages) => {
        this.messages = messages;
      });
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }
}
