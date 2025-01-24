import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { User } from '../models/user';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Register } from '../models/register';
import MinimumAgeValidator from '../shared/ageValidators';
import MatchPasswordValidator from '../shared/matchPasswordValidators';
import PasswordValidator from '../shared/passwordValidatos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  // @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();

  registerUser: Register | undefined;

  registerForm: FormGroup | any;

  validationErrors: string[] = [];

  maxDate = new Date();

  constructor(
    private userServices: UserService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // caculating your born year
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 22);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      knownAs: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birthday: ['', [Validators.required, MinimumAgeValidator(18)]],
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          PasswordValidator.PasswordStrength,
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          // MatchPasswordValidator('password'),
          PasswordValidator.MatchPassword,
        ],
      ],
    });

    // Update the validity of confirmPassword when password is changed
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  getControl(name: string): AbstractControl {
    return this.registerForm.get(name);
  }

  register() {
    this.userServices.register(this.registerForm.value as Register).subscribe(
      (re) => {
        this.router.navigateByUrl('/members');
        this.cancel();
      },
      (error: any) => {
        this.validationErrors = error;
      }
    );
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
