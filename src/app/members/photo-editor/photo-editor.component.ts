import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { UserService } from '../../../services/user.service';
import { User } from '../../models/user';
import { take } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MemberService } from '../../../services/member.service';
import { Photo } from '../../models/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css',
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;

  user: User | undefined;

  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.baseUrl;
  // hasAnotherDropZoneOver: boolean | undefined;
  // response: string | undefined;

  constructor(
    private userServices: UserService,
    private toastr: ToastrService,
    private memberService: MemberService
  ) {
    this.userServices.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user as User));
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.photoId).subscribe((re) => {
      if (this.user && this.member) {
        // set photo in nav component and update user
        this.user.photoUrl = photo.url;
        // after update user need to set new user in subject
        this.userServices.setCurrentSource(this.user);
        // update new url to display in screen when u channged the main photo
        this.member.photoUrl = photo.url;

        // when update main photo set all false but what photo u choose get it id and update it true
        this.member.photos.forEach((x) => {
          if (x.isMain) x.isMain = false;
          if (x.photoId == photo.photoId) x.isMain = true;
        });
        this.toastr.success(re.result);
      } else {
        this.toastr.error('Object user or member in file ts was underfined. ');
      }
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe((re) => {
      if (this.member != null) {
        this.member.photos = this.member?.photos.filter(
          (x) => x.photoId != photoId
        );
      } else {
        return this.toastr.error(re.result);
      }
      return this.toastr.success(re.result);
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + '/user/addPhoto',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, reponse, status, headers) => {
      if (reponse) {
        if (this.member != null) {
          //because from server i'm return IActionresult with type OK(...(type: text)) so here we need parse to json
          const photo = JSON.parse(reponse) as Photo;
          this.member.photos.push(photo);
          if (this.user) {
            this.user.photoUrl = photo.url;
            this.member.photoUrl = photo.url;
            this.userServices.setCurrentSource(this.user);
          }
          // after update user need to set new user in subject
        }
      }
      this.toastr.success('Upload file success. ');
    };
  }
}
