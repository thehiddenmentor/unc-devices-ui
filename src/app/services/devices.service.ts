import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '../models/Device';
import { API_URL } from '../utils/environment.util';
import { DevicesStatusCount } from '../models/devices-status-count';

@Injectable({ providedIn: 'root' })
export class DevicesService {
  private resource = '/devices';

  constructor(private http: HttpClient) {}

  createDevice(device: Partial<Device>) {
    return this.http.post<Device>(API_URL + this.resource, device);
  }

  getAllDevices(q?: string, filterByStatus?: string) {
    return this.http.get<Device[]>(
      API_URL +
        this.resource +
        `?q=${q || ''}&filterByStatus=${filterByStatus || ''}`
    );
  }

  getDevicesStatusCount() {
    return this.http.get<DevicesStatusCount>(
      API_URL + this.resource + '/device-count'
    );
  }

  updateDevice(id: number, device: Partial<Device>) {
    return this.http.patch<Device>(API_URL + this.resource + `/${id}`, device);
  }

  deleteDevice(id: number) {
    return this.http.delete(API_URL + this.resource + `/${id}`);
  }
}
