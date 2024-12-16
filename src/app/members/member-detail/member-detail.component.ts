import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MemberService } from '../../../services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(
    private memberServices: MemberService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.detailMember();

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

  detailMember() {
    let name = this.route.snapshot.paramMap.get('name') as string;
    this.memberServices.detailMember(name).subscribe((re) => {
      this.member = re;

      this.galleryImages = this.getImages();
    });
  }
}
