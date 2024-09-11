import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DepartmentsService } from '../../services/departments.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Department } from '../../models/Department';
import { ModalElement } from '../../@types/modal-element.type';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.css',
})
export class AddDepartmentComponent implements OnInit {
  @Output() added = new EventEmitter<void>();
  form = new FormGroup({
    name: new FormControl(''),
    code: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private departmentsService: DepartmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
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

    this.departmentsService
      .createDepartment(this.form.value as Partial<Department>)
      .subscribe({
        next: (res) => {
          const e = document.getElementById('add-department') as ModalElement;
          e.close();
          this.form.reset();
          this.added.emit();
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
        this.form.get('code')?.setErrors({ incorrect: true });
        break;
      default:
        this.router.navigate(['/server-error']);
    }
  }
}
