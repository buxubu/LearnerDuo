import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from '../services/user.service';
import { PresenceService } from '../services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'LearnerDuoApp';

  constructor(
    private userServices: UserService,
    private presenceService: PresenceService
  ) {}
  ngOnInit(): void {
    this.setCurentUser();
  }

  //khi truy cập home thì sẽ dùng hàm setCurentUser này để kiểm tra có người dùng đã đăng nhập trong locolstorage hay chưa
  //nếu có rồi sẽ truyền object gồm {user và token} qua services getCurrentSource
  setCurentUser() {
    const user: User = JSON.parse(localStorage.getItem('user') as string);
    if (user) {
      this.userServices.setCurrentSource(user);
      this.presenceService.createHubConnection(user); // when we refresh the page, we need to create a new connection
    }
  }
}
