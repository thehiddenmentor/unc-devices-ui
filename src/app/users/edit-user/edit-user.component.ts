import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
import { HttpErrorResponse } from '@angular/common/http';
import { ModalElement } from '../../@types/modal-element.type';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnChanges {
  @Output() success = new EventEmitter<any>();
  @Input() user!: User;
  form = new FormGroup({
    name: new FormControl(''),
    employeeId: new FormControl(''),
    role: new FormControl(''),
    active: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.form = this.formBuilder.group({
      name: [this.user.name || '', Validators.required],
      employeeId: [this.user.employeeId || '', Validators.required],
      role: [this.user.role || 'ADMIN', Validators.required],
      active: [this.user.active ?? true, Validators.required],
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
    this.usersService
      .updateUser(this.user.id, this.form.value as Partial<User>)
      .subscribe({
        next: (res) => {
          this.success.emit();

          const e = document.getElementById(
            `edit-user-${this.user.id}`
          ) as ModalElement;
          e.close();
        },
        error: (err: HttpErrorResponse) => {
          this.handleHttpError(err);
        },
      });
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
}
