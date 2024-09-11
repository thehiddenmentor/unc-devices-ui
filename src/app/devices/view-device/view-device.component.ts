import { Component, Input } from '@angular/core';
import { Device } from '../../models/Device';

@Component({
  selector: 'app-view-device',
  standalone: true,
  imports: [],
  templateUrl: './view-device.component.html',
  styleUrl: './view-device.component.css',
})
export class ViewDeviceComponent {
  @Input() device!: Device;
}
