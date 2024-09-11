import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matPlusOutline } from '@ng-icons/material-icons/outline';
import { Category } from '../../models/Category';
import { DevicesService } from '../../services/devices.service';
import { CategoriesService } from '../../services/categories.service';
import { Router } from '@angular/router';
import { Device } from '../../models/Device';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalElement } from '../../@types/modal-element.type';

@Component({
  selector: 'app-edit-device',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIconComponent],
  viewProviders: [
    provideIcons({
      matPlusOutline,
    }),
  ],
  templateUrl: './edit-device.component.html',
  styleUrl: './edit-device.component.css',
})
export class EditDeviceComponent implements OnChanges, OnInit {
  @Output() success = new EventEmitter<any>();
  @Input() device!: Device;
  form = new FormGroup({
    model: new FormControl(''),
    tagNumber: new FormControl(''),
    serialNumber: new FormControl(''),
    remarks: new FormControl(''),
    status: new FormControl(''),
    categoryId: new FormControl(),
  });
  categories: Category[] = [];
  categoryForm = new FormGroup({
    name: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private devicesService: DevicesService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.form = this.formBuilder.group({
      model: [this.device.model || '', Validators.required],
      tagNumber: [this.device.tagNumber || '', Validators.required],
      serialNumber: [this.device.serialNumber || ''],
      remarks: [this.device.remarks || ''],
      status: [this.device.status || 'AVAILABLE', Validators.required],
      categoryId: [this.device.category.id || '', Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err);
      },
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
    this.devicesService
      .updateDevice(this.device.id, this.form.value as Partial<Device>)
      .subscribe({
        next: () => {
          this.success.emit();

          const e = document.getElementById(
            `edit-device-${this.device.id}`
          ) as ModalElement;
          e.close();
          this.onReset();
        },
        error: (err: HttpErrorResponse) => {
          this.handleHttpError(err);
        },
      });
  }

  addCategoryModal() {
    const element = document.getElementById('add-category') as ModalElement;
    element.showModal();
  }

  onAddCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.categoriesService
      .createCategory(this.categoryForm.value as Partial<Category>)
      .subscribe({
        next: (res) => {
          const element = document.getElementById(
            'add-category'
          ) as ModalElement;
          element.close();
          this.categoryForm.reset();
          this.getAllCategories();
        },
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 409:
              this.categoryForm.get('name')?.setErrors({ conflict: true });
              break;
            default:
              this.router.navigate(['/server-error']);
          }
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
        this.form.get('tagNumber')?.setErrors({ incorrect: true });
        break;
      default:
        this.router.navigate(['/server-error']);
    }
  }

  onReset() {
    this.form.get('model')?.setValue(this.device.model);
    this.form.get('tagNumber')?.setValue(this.device.tagNumber);
    this.form.get('serialNumber')?.setValue(this.device.serialNumber);
    this.form.get('remarks')?.setValue(this.device.remarks);
    this.form.get('status')?.setValue(this.device.status);
    this.form.get('categoryId')?.setValue(this.device.category.id);
  }
}
