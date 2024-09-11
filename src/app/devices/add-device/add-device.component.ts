import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DevicesService } from '../../services/devices.service';
import { Router } from '@angular/router';
import { Device } from '../../models/Device';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalElement } from '../../@types/modal-element.type';
import { NgClass, NgFor } from '@angular/common';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/Category';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matPlusOutline } from '@ng-icons/material-icons/outline';

@Component({
  selector: 'app-add-device',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIconComponent],
  viewProviders: [
    provideIcons({
      matPlusOutline,
    }),
  ],
  templateUrl: './add-device.component.html',
  styleUrl: './add-device.component.css',
})
export class AddDeviceComponent implements OnInit {
  @Output() success = new EventEmitter<any>();
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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      model: ['', Validators.required],
      tagNumber: ['', Validators.required],
      serialNumber: [''],
      remarks: [''],
      status: ['AVAILABLE', Validators.required],
      categoryId: ['', Validators.required],
    });

    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.cdr.detectChanges();
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
      .createDevice(this.form.value as Partial<Device>)
      .subscribe({
        next: () => {
          this.success.emit();

          const e = document.getElementById('add-device') as ModalElement;
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
          this.getAllCategories();
          const element = document.getElementById(
            'add-category'
          ) as ModalElement;
          element.close();
          this.categoryForm.reset();
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
    this.form.get('model')?.reset();
    this.form.get('tagNumber')?.reset();
    this.form.get('serialNumber')?.reset();
    this.form.get('remarks')?.reset();
    this.form.get('categoryId')?.reset();
    this.form.get('status')?.setValue('AVAILABLE');
  }
}
