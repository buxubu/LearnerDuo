import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../_modal/roles-modal/roles-modal.component';
import { initialState } from 'ngx-bootstrap/timepicker/reducer/timepicker.reducer';
import { __values } from 'tslib';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  users: Partial<User[]> = [];
  bsModalRef: BsModalRef = {} as BsModalRef;

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {}
  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe((users) => {
      this.users = users;
    });
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: { user, roles: this.getRolesArray(user) },
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe((values: any) => {
      const rolesToUpdate = {
        roles: [
          ...values
            .filter((el: any) => el.checked == true)
            .map((el: any) => el.name),
        ],
      };
      if (rolesToUpdate) {
        this.adminService
          .editUserRoles(user.userName, rolesToUpdate.roles)
          .subscribe(() => {
            user.roles = [...rolesToUpdate.roles];
          });
      }
    });
  }

  private getRolesArray(user: User) {
    const roles: any[] = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' },
    ];

    availableRoles.forEach((role) => {
      let itMatch = false;

      for (const userRole of userRoles) {
        if (role.name === userRole) {
          itMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }

      if (!itMatch) {
        role.checked = false;
        roles.push(role);
      }
    });
    return roles;
  }
}
