import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../ui/sidebar/sidebar.component';
import { TitleComponent } from '../ui/title/title.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matPlusOutline } from '@ng-icons/material-icons/outline';
import { NgClass } from '@angular/common';
import {
  matDelete,
  matEdit,
  matRemoveRedEye,
} from '@ng-icons/material-icons/baseline';
import { Device } from '../models/Device';
import { DevicesService } from '../services/devices.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AddDeviceComponent } from './add-device/add-device.component';
import { ModalElement } from '../@types/modal-element.type';
import { DeleteDeviceComponent } from './delete-device/delete-device.component';
import { NoResultComponent } from '../ui/no-result/no-result.component';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { ViewDeviceComponent } from './view-device/view-device.component';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    SidebarComponent,
    TitleComponent,
    NgIconComponent,
    NgClass,
    ReactiveFormsModule,
    AddDeviceComponent,
    DeleteDeviceComponent,
    NoResultComponent,
    EditDeviceComponent,
    ViewDeviceComponent,
  ],
  viewProviders: [
    provideIcons({
      matPlusOutline,
      matEdit,
      matDelete,
      matRemoveRedEye,
    }),
  ],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css',
})
export class DevicesComponent implements OnInit {
  q = '';
  devices: Device[] = [];
  statusForm = new FormControl('');

  constructor(private devicesService: DevicesService, private router: Router) {}

  ngOnInit(): void {
    this.statusForm.setValue('');
    this.statusForm.valueChanges.subscribe((id) => {
      if (id === '') {
        this.getAllDevices();
      } else {
        this.getAllDevices('', id!);
      }
    });

    this.getAllDevices();
  }

  handleClick() {
    const e = document.getElementById('add-device') as ModalElement;
    e.showModal();
  }

  openDeleteDevice(id: number) {
    const e = document.getElementById(`delete-device-${id}`) as ModalElement;
    e.showModal();
  }

  openEditDevice(id: number) {
    const e = document.getElementById(`edit-device-${id}`) as ModalElement;
    e.showModal();
  }

  openViewDevice(id: number) {
    const e = document.getElementById(`view-device-${id}`) as ModalElement;
    e.showModal();
  }

  deleteDevice(id: number) {
    this.devicesService.deleteDevice(id).subscribe({
      next: () => {
        this.getAllDevices();
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err);
      },
    });

    const e = document.getElementById(`delete-device-${id}`) as ModalElement;
    e.close();
  }

  getAllDevices(q?: string, filterByStatus?: string) {
    this.devicesService.getAllDevices(q, filterByStatus).subscribe({
      next: (res) => {
        this.devices = res;
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err);
      },
    });
  }

  private handleHttpError(error: HttpErrorResponse) {
    switch (error.status) {
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

  onSearch(e: Event) {
    const el = e.target as HTMLInputElement;
    this.q = el.value;

    this.getAllDevices(this.q, this.statusForm.value!);
  }
}
