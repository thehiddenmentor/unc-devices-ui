import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { User } from '../../models/User';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { ModalElement } from '../../@types/modal-element.type';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent implements OnInit {
  @Output() success = new EventEmitter<any>();
  form = new FormGroup({
    name: new FormControl(''),
    employeeId: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl(''),
    active: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      employeeId: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['ADMIN', Validators.required],
      active: [true, Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.usersService.createUser(this.form.value as Partial<User>).subscribe({
      next: (res) => {
        this.success.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err);
      },
    });

    const e = document.getElementById('add-user') as ModalElement;
    e.close();
    this.onReset();
  }

  private handleHttpError(err: HttpErrorResponse) {
    switch (err.status) {
      case 400:
        console.log(err);
        break;
      case 401:
        this.router.navigate(['/login']);
        break;
      case 403:
        this.router.navigate(['/forbidden']);
        break;
      case 409:
        this.form.get('employeeId')?.setErrors({ incorrect: true });
        break;
      default:
        this.router.navigate(['/server-error']);
    }
  }

  onReset() {
    this.form.get('name')?.reset();
    this.form.get('employeeId')?.reset();
    this.form.get('password')?.reset();
  }
}
