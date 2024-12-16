import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { UserService } from '../../../services/user.service';
import { User } from '../../models/user';
import { take } from 'rxjs';

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

  constructor(private userServices: UserService) {
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
        const photo = JSON.parse(reponse);
        this.member?.photos.push(photo);
      }
    };
  }
}
