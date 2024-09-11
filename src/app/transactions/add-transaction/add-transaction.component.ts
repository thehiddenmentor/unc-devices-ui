import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matPlusOutline } from '@ng-icons/material-icons/outline';
import { Transaction } from '../../models/Transaction';
import { Department } from '../../models/Department';
import { DepartmentsService } from '../../services/departments.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalElement } from '../../@types/modal-element.type';
import { AddDepartmentComponent } from '../add-department/add-department.component';
import { SelectDeviceComponent } from '../select-device/select-device.component';
import { Device } from '../../models/Device';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [
    NgIconComponent,
    ReactiveFormsModule,
    AddDepartmentComponent,
    SelectDeviceComponent,
  ],
  viewProviders: [
    provideIcons({
      matPlusOutline,
    }),
  ],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css',
})
export class AddTransactionComponent implements OnInit {
  @Output() success = new EventEmitter<void>();
  departments: Department[] = [];
  selectedDevice = {} as Device;
  form = new FormGroup({
    borrowerName: new FormControl(''),
    borrowerId: new FormControl(''),
    remarks: new FormControl(''),
    deviceId: new FormControl(),
    departmentId: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private departmentsService: DepartmentsService,
    private transactionsService: TransactionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      borrowerName: ['', Validators.required],
      borrowerId: ['', Validators.required],
      remarks: [''],
      deviceId: ['', Validators.required],
      departmentId: ['', Validators.required],
    });
    this.getAllDepartments();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.transactionsService
      .createTransaction(this.form.value as Partial<Transaction>)
      .subscribe({
        next: (res) => {
          this.success.emit();
          const e = document.getElementById('add-transaction') as ModalElement;
          e.close();
        },
        error: (err: HttpErrorResponse) => {
          this.handleHttpError(err);
        },
      });
  }

  get f() {
    return this.form.controls;
  }

  getAllDepartments() {
    this.departmentsService.getAllDepartments().subscribe({
      next: (res) => {
        this.departments = res;
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err);
      },
    });
  }

  private handleHttpError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        console.log(error);
        break;
      case 401:
        this.router.navigate(['/login']);
        break;
      case 403:
        this.router.navigate(['/forbidden']);
        break;
      default:
        this.router.navigate(['/server-error']);
    }
  }

  openAddDepartment() {
    const e = document.getElementById('add-department') as ModalElement;
    e.showModal();
  }

  openSelectDevice() {
    const e = document.getElementById('select-device') as ModalElement;
    e.showModal();
  }

  onSelectedDevice(device: Device) {
    this.selectedDevice = device;
    this.form.get('deviceId')?.setValue(device.id);
  }
}
