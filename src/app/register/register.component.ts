import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  validateMessages: string[] = [];

  constructor(
    private userServices: UserService,
    private toastr: ToastrService
  ) {}

  register() {
    this.userServices.register(this.model).subscribe(
      (re) => {
        console.log(re);
        this.cancel();
      },
      (error: any) => {
        // this.toastr.error(error);
        this.validateMessages = error;
        console.log(this.validateMessages);
      }
    );
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
