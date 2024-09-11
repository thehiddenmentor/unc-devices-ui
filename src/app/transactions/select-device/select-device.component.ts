import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matSearchOutline } from '@ng-icons/material-icons/outline';
import { Device } from '../../models/Device';
import { DevicesService } from '../../services/devices.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalElement } from '../../@types/modal-element.type';
import { NoResultComponent } from '../../ui/no-result/no-result.component';

@Component({
  selector: 'app-select-device',
  standalone: true,
  imports: [NgIcon, NoResultComponent],
  viewProviders: [
    provideIcons({
      matSearchOutline,
    }),
  ],
  templateUrl: './select-device.component.html',
  styleUrl: './select-device.component.css',
})
export class SelectDeviceComponent implements OnInit {
  @Output() selectedDevice = new EventEmitter<Device>();
  q = '';
  devices: Device[] = [];

  constructor(private devicesService: DevicesService, private router: Router) {}

  ngOnInit(): void {
    this.getAllDevices();
  }

  getAllDevices(q?: string, filterByStatus = 'AVAILABLE') {
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

  onSelect(device: Device) {
    this.selectedDevice.emit(device);
    const e = document.getElementById('select-device') as ModalElement;
    e.close();
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.q = inputElement.value;
    this.getAllDevices(this.q);
  }
}
